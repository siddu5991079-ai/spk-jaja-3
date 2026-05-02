
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const { spawn } = require('child_process');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

// 🚀 Multi-Stream Key Manager (Ab 8 Keys ke sath)
const STREAM_KEYS = {
    '1': '14601603391083_14040893622891_puxzrwjniu', 
    '2': '14601696583275_14041072274027_apdzpdb5xi', 
    '3': '14617940008555_14072500914795_ohw67ls7ny',
    '4': '14601972227691_14041593547371_obdhgewlmq',
    '5': '15145825803883_15082736847467_hjyjq4bud4',
    '6': '15145851166315_15082784229995_mr5eweath4', 
    '7': '15145866042987_15082813393515_axt6r27f7m',
    '8': '15145878756971_15082836265579_oeowgtmnxu'
};

const TARGET_URL = process.env.TARGET_URL || 'https://dadocric.st/player.php?id=starsp3&v=m';
const SELECTED_CHANNEL = process.env.OKRU_STREAM_ID || '1';
const ACTIVE_STREAM_KEY = STREAM_KEYS[SELECTED_CHANNEL] || STREAM_KEYS['1'];
const RTMP_DESTINATION = `rtmp://vsu.okcdn.ru/input/${ACTIVE_STREAM_KEY}`;

let browser = null;
let ffmpegProcess = null;

// =========================================================================
// 🔄 MAIN LOOP
// =========================================================================
async function mainLoop() {
    while (true) {
        try {
            await startDirectStreaming();
        } catch (error) {
            console.error(`\n[!] ALERT: ${error.message}`);
            console.log('[*] 🔄 Restarting everything in 3 seconds...');
            await cleanup();
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
}

async function startDirectStreaming() {
    console.log(`[*] Starting browser and FFmpeg...`);
    const streamQuality = process.env.STREAM_QUALITY || '110KBps (Balanced 480p)';
    
    browser = await puppeteer.launch({
        headless: false, 
        defaultViewport: { width: 1280, height: 720 },
        ignoreDefaultArgs: ['--enable-automation'], 
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=1280,720',
            '--kiosk', 
            '--autoplay-policy=no-user-gesture-required'
        ]
    });

    const page = await browser.newPage();
    const pages = await browser.pages();
    for (const p of pages) {
        if (p !== page) await p.close();
    }

    // 🛑 POPUP & REDIRECT BLOCKER
    browser.on('targetcreated', async (target) => {
        if (target.type() === 'page') {
            try {
                const newPage = await target.page();
                if (newPage && newPage !== page) {
                    console.log(`[!] Ad Popup detected and KILLED! Focus maintained.`);
                    await page.bringToFront(); 
                    await newPage.close();
                }
            } catch (e) {}
        }
    });

    console.log(`[*] Navigating to: ${TARGET_URL}`);
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // 🎥 1. START 30-SEC DEBUG RECORDING
    const recorder = new PuppeteerScreenRecorder(page, { followNewTab: false, fps: 30, videoFrame: { width: 1280, height: 720 } });
    console.log('[*] 🔴 Debug Recording Started...');
    await recorder.start('./recording.mp4');

    await new Promise(r => setTimeout(r, 5000));

    // 🖱️ 2. THE TERMINATOR CLICKER
    console.log('[*] Hunting for the JW Player Play Button...');
    let buttonGone = false;
    let attempts = 0;
    
    while (!buttonGone && attempts < 15) {
        buttonGone = true;
        for (const frame of page.frames()) {
            try {
                const playBtn = await frame.$('.jw-icon-display[aria-label="Play"]');
                if (playBtn) {
                    const isVisible = await frame.evaluate(el => {
                        const style = window.getComputedStyle(el);
                        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                    }, playBtn);

                    if (isVisible) {
                        buttonGone = false;
                        console.log(`[*] Play button detected! Smashing it... (Attempt ${attempts + 1}/15)`);
                        await frame.evaluate(el => el.click(), playBtn); 
                        await new Promise(r => setTimeout(r, 2000));
                        break; 
                    }
                }
            } catch (err) {}
        }
        attempts++;
    }

    // 🧠 3. THE SMART SCANNER (Brought Back to Fix the DEAD issue!)
    console.log('[*] Scanning iframes for the REAL Live Stream Video...');
    let targetFrame = null;
    for (const frame of page.frames()) {
        try {
            const isRealLiveStream = await frame.evaluate(() => {
                const vid = document.querySelector('video');
                // Check if video exists and is somewhat visible
                if (!vid) return false;
                if (vid.clientWidth < 100 || vid.clientHeight < 100) return false; 
                return true; 
            });

            if (isRealLiveStream) {
                targetFrame = frame;
                console.log(`[+] Smart Scanner locked onto video frame: ${frame.url().substring(0, 50)}...`);
                break; // Mill gaya video, aur dhoondne ki zaroorat nahi
            }
        } catch (e) { }
    }

    if (!targetFrame) {
        console.log('[-] Smart Scanner could not find an iframe with video, defaulting to main page.');
        targetFrame = page.mainFrame();
    }

    // ⬛ 4. IMMEDIATE BLACK BACKGROUND & FULLSCREEN FORCE
    console.log('[*] Enforcing Black Background and Full Screen UI...');
    await page.evaluate(() => {
        document.body.style.backgroundColor = 'black';
        document.body.style.overflow = 'hidden';
        document.querySelectorAll('iframe').forEach(iframe => {
            iframe.style.position = 'fixed'; iframe.style.top = '0'; iframe.style.left = '0';
            iframe.style.width = '100vw'; iframe.style.height = '100vh';
            iframe.style.zIndex = '999999'; iframe.style.backgroundColor = 'black'; iframe.style.border = 'none';
        });
    }).catch(() => {});

    await targetFrame.evaluate(async () => {
        const style = document.createElement('style');
        style.innerHTML = `.jw-controls, .jw-ui, .plyr__controls, .vjs-control-bar, [data-player] .controls { display: none !important; }`;
        document.head.appendChild(style);

        const video = document.querySelector('video');
        if (video) { 
            video.muted = false; 
            video.volume = 1.0; 
            video.style.position = 'fixed'; video.style.top = '0'; video.style.left = '0';
            video.style.width = '100vw'; video.style.height = '100vh';
            video.style.zIndex = '2147483647'; video.style.backgroundColor = 'black'; video.style.objectFit = 'contain';
        }
    }).catch(()=>{});

    // 📡 5. START FFMPEG BROADCAST
    console.log(`[+] Broadcasting to OK.ru CHANNEL: ${SELECTED_CHANNEL} - Quality: ${streamQuality}`);
    const displayNum = process.env.DISPLAY || ':99';
    let ffmpegArgs = [
        '-y', '-use_wallclock_as_timestamps', '1', '-thread_queue_size', '1024',
        '-f', 'x11grab', '-draw_mouse', '0', '-video_size', '1280x720', '-framerate', '30',
        '-i', displayNum, '-thread_queue_size', '1024', '-f', 'pulse', '-i', 'default',
        '-vf', 'scale=854:480', '-c:v', 'libx264', '-preset', 'veryfast', '-profile:v', 'main',
        '-b:v', '800k', '-maxrate', '850k', '-bufsize', '1700k',
        '-pix_fmt', 'yuv420p', '-g', '60', '-c:a', 'aac', '-b:a', '64k', '-ac', '2', '-ar', '44100',
        '-async', '1', '-f', 'flv', RTMP_DESTINATION 
    ];
    
    ffmpegProcess = spawn('ffmpeg', ffmpegArgs);
    ffmpegProcess.stderr.on('data', (data) => {
        if (data.toString().includes('Error')) console.log(`[FFmpeg Error]: ${data}`);
    });

    // ⏱️ 6. STOP RECORDING AFTER 30 SECONDS (To safely compile the .mp4 file)
    console.log('[*] Capturing stream for 30 seconds to finalize Debug Recording...');
    await new Promise(r => setTimeout(r, 30000));
    await recorder.stop();
    console.log('[+] 30-Sec Debug Video Saved! Safe to cancel workflow anytime now.');

    // 🧠 7. THE SMART WATCHDOG (Privacy & Health Check Active...)
    console.log('\n[*] Smart Engine Connected! 24/7 Monitoring Active...');
    while (true) {
        if (!browser || !browser.isConnected()) throw new Error("Browser closed.");

        const status = await targetFrame.evaluate(() => {
            const bodyText = document.body.innerText.toLowerCase();
            if (bodyText.includes("stream error") || bodyText.includes("could not be loaded")) return 'CRITICAL_ERROR';
            const v = document.querySelector('video');
            if (!v || v.ended) return 'DEAD';
            return 'HEALTHY';
        }).catch(() => 'EVAL_ERROR');

        if (status === 'CRITICAL_ERROR' || status === 'DEAD') {
            console.log('\n[!] ❌ STREAM DEAD DETECTED! Restarting process...');
            throw new Error("Watchdog detected video dead."); 
        }

        await new Promise(r => setTimeout(r, 5000)); 
    }
}

async function cleanup() {
    if (ffmpegProcess) { try { ffmpegProcess.kill('SIGKILL'); } catch(e){} ffmpegProcess = null; }
    if (browser) { try { await browser.close(); } catch(e){} browser = null; }
}

process.on('SIGINT', async () => {
    console.log('\n[*] Stopping live script cleanly...');
    await cleanup();
    process.exit(0);
});

// =========================================================================
// ⏱️ AUTO-OVERLAP TRIGGER (Using Native GitHub CLI / Zbrdst Logic)
// =========================================================================
setTimeout(() => {
    console.log("\n[*] 5h 50m completed! Triggering next action for seamless overlap...");
    try {
        const { execSync } = require('child_process');
        
        const targetUrl = process.env.TARGET_URL || 'https://dadocric.st/player.php?id=starsp3&v=m';
        const channel = process.env.OKRU_STREAM_ID || '1';
        const quality = process.env.STREAM_QUALITY || '110KBps (Balanced 480p)';

        // Yeh command File 2 (main.yml) ko dubara run karegi (Note: Is project mein USE_PROXY variable nahi hai)
        const cmd = `gh workflow run main.yml -f target_url="${targetUrl}" -f okru_stream_channel="${channel}" -f stream_quality="${quality}"`;
        
        console.log(`[*] Executing Command: ${cmd}`);
        execSync(cmd, { stdio: 'inherit' });
        
        console.log("[+] Next workflow run successfully triggered!");

        // 5 minute ka waqfa taake naya action start hoke apni live key le sakay
        setTimeout(async () => {
            console.log("\n[*] Handing over stream to next action. Shutting down cleanly...");
            await cleanup();
            process.exit(0);
        }, 300000); // 300,000 ms = 5 Minutes Wait

    } catch (err) {
        console.error("[-] Failed to trigger next workflow using GH CLI:", err.message);
    }
}, 21000000); // 21,000,000 ms = Exactly 5 Hours & 50 Minutes

mainLoop();



































// ======== Done Done Alhamdullah -----------------------






// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// puppeteer.use(StealthPlugin());

// const { spawn } = require('child_process');
// const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

// // 🚀 Multi-Stream Key Manager
// const STREAM_KEYS = {
//     '1': '14601603391083_14040893622891_puxzrwjniu', 
//     '2': '14601696583275_14041072274027_apdzpdb5xi', 
//     '3': '14617940008555_14072500914795_ohw67ls7ny',
//     '4': '14601972227691_14041593547371_obdhgewlmq',
//     '5': '15145825803883_15082736847467_hjyjq4bud4',
//     '6': '15145851166315_15082784229995_mr5eweath4', 
//     '7': '15145866042987_15082813393515_axt6r27f7m',
//     '8': '15145878756971_15082836265579_oeowgtmnxu'
// };

// const TARGET_URL = process.env.TARGET_URL || 'https://dadocric.st/player.php?id=starsp3&v=m';
// const SELECTED_CHANNEL = process.env.OKRU_STREAM_ID || '1';
// const ACTIVE_STREAM_KEY = STREAM_KEYS[SELECTED_CHANNEL] || STREAM_KEYS['1'];
// const RTMP_DESTINATION = `rtmp://vsu.okcdn.ru/input/${ACTIVE_STREAM_KEY}`;

// let browser = null;
// let ffmpegProcess = null;

// // =========================================================================
// // 🔄 MAIN LOOP
// // =========================================================================
// async function mainLoop() {
//     while (true) {
//         try {
//             await startDirectStreaming();
//         } catch (error) {
//             console.error(`\n[!] ALERT: ${error.message}`);
//             console.log('[*] 🔄 Restarting everything in 3 seconds...');
//             await cleanup();
//             await new Promise(resolve => setTimeout(resolve, 3000));
//         }
//     }
// }

// async function startDirectStreaming() {
//     console.log(`[*] Starting browser and FFmpeg...`);
//     const streamQuality = process.env.STREAM_QUALITY || '110KBps (Balanced 480p)';
    
//     browser = await puppeteer.launch({
//         headless: false, 
//         defaultViewport: { width: 1280, height: 720 },
//         ignoreDefaultArgs: ['--enable-automation'], 
//         args: [
//             '--no-sandbox',
//             '--disable-setuid-sandbox',
//             '--window-size=1280,720',
//             '--kiosk', 
//             '--autoplay-policy=no-user-gesture-required'
//         ]
//     });

//     const page = await browser.newPage();
//     const pages = await browser.pages();
//     for (const p of pages) {
//         if (p !== page) await p.close();
//     }

//     // 🛑 POPUP & REDIRECT BLOCKER
//     browser.on('targetcreated', async (target) => {
//         if (target.type() === 'page') {
//             try {
//                 const newPage = await target.page();
//                 if (newPage && newPage !== page) {
//                     console.log(`[!] Ad Popup detected and KILLED! Focus maintained.`);
//                     await page.bringToFront(); 
//                     await newPage.close();
//                 }
//             } catch (e) {}
//         }
//     });

//     console.log(`[*] Navigating to: ${TARGET_URL}`);
//     await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

//     // 🎥 1. START 30-SEC DEBUG RECORDING
//     const recorder = new PuppeteerScreenRecorder(page, { followNewTab: false, fps: 30, videoFrame: { width: 1280, height: 720 } });
//     console.log('[*] 🔴 Debug Recording Started...');
//     await recorder.start('./recording.mp4');

//     await new Promise(r => setTimeout(r, 5000));

//     // 🖱️ 2. THE TERMINATOR CLICKER
//     console.log('[*] Hunting for the JW Player Play Button...');
//     let buttonGone = false;
//     let attempts = 0;
    
//     while (!buttonGone && attempts < 15) {
//         buttonGone = true;
//         for (const frame of page.frames()) {
//             try {
//                 const playBtn = await frame.$('.jw-icon-display[aria-label="Play"]');
//                 if (playBtn) {
//                     const isVisible = await frame.evaluate(el => {
//                         const style = window.getComputedStyle(el);
//                         return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
//                     }, playBtn);

//                     if (isVisible) {
//                         buttonGone = false;
//                         console.log(`[*] Play button detected! Smashing it... (Attempt ${attempts + 1}/15)`);
//                         await frame.evaluate(el => el.click(), playBtn); 
//                         await new Promise(r => setTimeout(r, 2000));
//                         break; 
//                     }
//                 }
//             } catch (err) {}
//         }
//         attempts++;
//     }

//     // 🧠 3. THE SMART SCANNER (Brought Back to Fix the DEAD issue!)
//     console.log('[*] Scanning iframes for the REAL Live Stream Video...');
//     let targetFrame = null;
//     for (const frame of page.frames()) {
//         try {
//             const isRealLiveStream = await frame.evaluate(() => {
//                 const vid = document.querySelector('video');
//                 // Check if video exists and is somewhat visible
//                 if (!vid) return false;
//                 if (vid.clientWidth < 100 || vid.clientHeight < 100) return false; 
//                 return true; 
//             });

//             if (isRealLiveStream) {
//                 targetFrame = frame;
//                 console.log(`[+] Smart Scanner locked onto video frame: ${frame.url().substring(0, 50)}...`);
//                 break; // Mill gaya video, aur dhoondne ki zaroorat nahi
//             }
//         } catch (e) { }
//     }

//     if (!targetFrame) {
//         console.log('[-] Smart Scanner could not find an iframe with video, defaulting to main page.');
//         targetFrame = page.mainFrame();
//     }

//     // ⬛ 4. IMMEDIATE BLACK BACKGROUND & FULLSCREEN FORCE
//     console.log('[*] Enforcing Black Background and Full Screen UI...');
//     await page.evaluate(() => {
//         document.body.style.backgroundColor = 'black';
//         document.body.style.overflow = 'hidden';
//         document.querySelectorAll('iframe').forEach(iframe => {
//             iframe.style.position = 'fixed'; iframe.style.top = '0'; iframe.style.left = '0';
//             iframe.style.width = '100vw'; iframe.style.height = '100vh';
//             iframe.style.zIndex = '999999'; iframe.style.backgroundColor = 'black'; iframe.style.border = 'none';
//         });
//     }).catch(() => {});

//     await targetFrame.evaluate(async () => {
//         const style = document.createElement('style');
//         style.innerHTML = `.jw-controls, .jw-ui, .plyr__controls, .vjs-control-bar, [data-player] .controls { display: none !important; }`;
//         document.head.appendChild(style);

//         const video = document.querySelector('video');
//         if (video) { 
//             video.muted = false; 
//             video.volume = 1.0; 
//             video.style.position = 'fixed'; video.style.top = '0'; video.style.left = '0';
//             video.style.width = '100vw'; video.style.height = '100vh';
//             video.style.zIndex = '2147483647'; video.style.backgroundColor = 'black'; video.style.objectFit = 'contain';
//         }
//     }).catch(()=>{});

//     // 📡 5. START FFMPEG BROADCAST
//     console.log(`[+] Broadcasting to OK.ru CHANNEL: ${SELECTED_CHANNEL} - Quality: ${streamQuality}`);
//     const displayNum = process.env.DISPLAY || ':99';
//     let ffmpegArgs = [
//         '-y', '-use_wallclock_as_timestamps', '1', '-thread_queue_size', '1024',
//         '-f', 'x11grab', '-draw_mouse', '0', '-video_size', '1280x720', '-framerate', '30',
//         '-i', displayNum, '-thread_queue_size', '1024', '-f', 'pulse', '-i', 'default',
//         '-vf', 'scale=854:480', '-c:v', 'libx264', '-preset', 'veryfast', '-profile:v', 'main',
//         '-b:v', '800k', '-maxrate', '850k', '-bufsize', '1700k',
//         '-pix_fmt', 'yuv420p', '-g', '60', '-c:a', 'aac', '-b:a', '64k', '-ac', '2', '-ar', '44100',
//         '-async', '1', '-f', 'flv', RTMP_DESTINATION 
//     ];
    
//     ffmpegProcess = spawn('ffmpeg', ffmpegArgs);
//     ffmpegProcess.stderr.on('data', (data) => {
//         if (data.toString().includes('Error')) console.log(`[FFmpeg Error]: ${data}`);
//     });

//     // ⏱️ 6. STOP RECORDING AFTER 30 SECONDS (To safely compile the .mp4 file)
//     console.log('[*] Capturing stream for 30 seconds to finalize Debug Recording...');
//     await new Promise(r => setTimeout(r, 30000));
//     await recorder.stop();
//     console.log('[+] 30-Sec Debug Video Saved! Safe to cancel workflow anytime now.');

//     // 🧠 7. THE SMART WATCHDOG (Privacy & Health Check Active...)
//     console.log('\n[*] Smart Engine Connected! 24/7 Monitoring Active...');
//     while (true) {
//         if (!browser || !browser.isConnected()) throw new Error("Browser closed.");

//         const status = await targetFrame.evaluate(() => {
//             const bodyText = document.body.innerText.toLowerCase();
//             if (bodyText.includes("stream error") || bodyText.includes("could not be loaded")) return 'CRITICAL_ERROR';
//             const v = document.querySelector('video');
//             if (!v || v.ended) return 'DEAD';
//             return 'HEALTHY';
//         }).catch(() => 'EVAL_ERROR');

//         if (status === 'CRITICAL_ERROR' || status === 'DEAD') {
//             console.log('\n[!] ❌ STREAM DEAD DETECTED! Restarting process...');
//             throw new Error("Watchdog detected video dead."); 
//         }

//         await new Promise(r => setTimeout(r, 5000)); 
//     }
// }

// async function cleanup() {
//     if (ffmpegProcess) { try { ffmpegProcess.kill('SIGKILL'); } catch(e){} ffmpegProcess = null; }
//     if (browser) { try { await browser.close(); } catch(e){} browser = null; }
// }

// process.on('SIGINT', async () => {
//     console.log('\n[*] Stopping live script cleanly...');
//     await cleanup();
//     process.exit(0);
// });

// // =========================================================================
// // ⏱️ AUTO-OVERLAP TRIGGER (Runs exactly after 5h 50m)
// // =========================================================================
// setTimeout(async () => {
//     console.log("\n[*] 5h 50m completed! Triggering next action for overlap...");
//     const repo = process.env.GITHUB_REPOSITORY;
//     const token = process.env.GH_PAT;
//     const ref = process.env.GITHUB_REF_NAME || 'main';
    
//     if (!repo || !token) return;

//     try {
//         await fetch(`https://api.github.com/repos/${repo}/actions/workflows/main.yml/dispatches`, {
//             method: 'POST',
//             headers: { 'Accept': 'application/vnd.github.v3+json', 'Authorization': `token ${token}` },
//             body: JSON.stringify({
//                 ref: ref,
//                 inputs: {
//                     target_url: process.env.TARGET_URL,
//                     okru_stream_channel: process.env.OKRU_STREAM_ID,
//                     stream_quality: process.env.STREAM_QUALITY
//                 }
//             })
//         });
//         console.log("[+] Next workflow run successfully triggered!");
//     } catch (err) {
//         console.error("[-] Failed to trigger next workflow.");
//     }
// }, 21000000); 

// mainLoop();


























// =================== Great job , local test Done =======================



// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// puppeteer.use(StealthPlugin());
// const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

// const TARGET_URL = process.env.TARGET_URL || 'https://your-target-stream-link.com';

// (async () => {
//     console.log('[*] Starting browser in Stealth Mode...');
//     const browser = await puppeteer.launch({
//         headless: false, 
//         defaultViewport: { width: 1280, height: 720 },
//         args: [
//             '--no-sandbox',
//             '--disable-setuid-sandbox',
//             '--window-size=1280,720',
//             '--autoplay-policy=no-user-gesture-required'
//         ]
//     });

//     const page = await browser.newPage();

//     // 🛑 POPUP & REDIRECT BLOCKER (Yeh ad tabs ko foran kill karega)
//     browser.on('targetcreated', async (target) => {
//         if (target.type() === 'page') {
//             try {
//                 const newPage = await target.page();
//                 if (newPage && newPage !== page) {
//                     console.log(`[!] Popup Tab detected and KILLED! Keeping focus on stream...`);
//                     await page.bringToFront(); 
//                     await newPage.close();
//                 }
//             } catch (e) {}
//         }
//     });

//     console.log(`[*] Navigating to: ${TARGET_URL}`);
//     await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

//     // 🎥 START SCREEN RECORDING IMMEDIATELY
//     const recorder = new PuppeteerScreenRecorder(page, {
//         followNewTab: false,
//         fps: 30,
//         videoFrame: { width: 1280, height: 720 },
//     });
    
//     console.log('[*] 🔴 Recording Started...');
//     await recorder.start('./recording.mp4');

//     // Thora wait karte hain taake player sahi se load ho jaye
//     await new Promise(r => setTimeout(r, 5000));

//     // =========================================================================
//     // 🖱️ THE TERMINATOR CLICKER: Jab tak button zinda hai, chhorna nahi!
//     // =========================================================================
//     console.log('[*] Hunting for the JW Player Play Button...');
//     let buttonGone = false;
//     let attempts = 0;
//     const maxAttempts = 15; // Max 15 baar try karega (approx 30 seconds)

//     while (!buttonGone && attempts < maxAttempts) {
//         buttonGone = true; // Assume karte hain gayab ho gaya, unless mil jaye
        
//         // Main page aur tamam iframes mein dhoondega
//         for (const frame of page.frames()) {
//             try {
//                 // Aapki image ke mutabiq exact selector
//                 const playBtn = await frame.$('.jw-icon-display[aria-label="Play"]');
                
//                 if (playBtn) {
//                     // Check if it's actually visible on screen
//                     const isVisible = await frame.evaluate(el => {
//                         const style = window.getComputedStyle(el);
//                         return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
//                     }, playBtn);

//                     if (isVisible) {
//                         buttonGone = false; // Button abhi bhi zinda hai!
//                         console.log(`[*] Play button detected in frame! SMASHING IT... (Attempt ${attempts + 1}/${maxAttempts})`);
                        
//                         // Javascript ke zariye force click (overrides invisible divs)
//                         await frame.evaluate(el => el.click(), playBtn); 
                        
//                         // Click karne ke baad 2 seconds wait karega taake popup blocker apna kaam kare
//                         await new Promise(r => setTimeout(r, 2000));
//                         break; // Loop break karega aur dobara check karega naye siray se
//                     }
//                 }
//             } catch (err) {
//                 // Ignore cross-origin frame errors silently
//             }
//         }
//         attempts++;
//     }

//     if (buttonGone) {
//         console.log('[+] SUCCESS: Play button is completely GONE! Stream is running.');
//     } else {
//         console.log('[-] WARNING: Reached max click attempts, button might still be stuck.');
//     }
//     // =========================================================================

//     // ⏱️ WAIT FOR REST OF THE RECORDING (Total ~30-40 seconds video banegi)
//     console.log('[*] Capturing stream for a few more seconds...');
//     await new Promise(r => setTimeout(r, 15000));

//     // 🛑 STOP RECORDING & CLEANUP
//     console.log('[*] Stopping recording...');
//     await recorder.stop();
//     await browser.close();
//     console.log('[+] Done! Video saved as recording.mp4, ready for GitHub Release upload.');
// })();
