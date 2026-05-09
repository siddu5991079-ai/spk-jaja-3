
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const { spawn } = require('child_process');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');



// 🚀 Multi-Stream Key Manager
const STREAM_KEYS = {
    '1'   : '15254238731883_15281627925099_najspfkgne', 
    '1.1' : '15254260751979_15281671637611_2plrcfqzze', 
    '1.2' : '15254285524587_15281717840491_7e6qdknzsu',
    
    '2'   : '15254299352683_15281743071851_7dvz3h5d7q',
    '2.1' : '15254308986475_15281761618539_3xca7oij3u',
    '2.2' : '15254328122987_15281795566187_zjqa6bqzoq', 

    '3'   : '15254341885547_15281821059691_hhlpb5vicy', 
    '3.1' : '15254357089899_15281848322667_sxeexgvzl4', 
    '3.2' : '15254367510123_15281868180075_pc4jrytfgm',

    '4'   : '15255022345835_15283095800427_vwrupxzstm', 
    '4.1' : '15255038074475_15283122080363_ai5qqp2we4', 
    '4.2' : '15255045480043_15283135842923_tldl4bhmii',
    '4.3' : '15255208599147_15283449629291_abltofuc7m', 
    '4.4' : '15255217708651_15283466603115_bojrrqtlmu', 
    '4.5' : '15255227670123_15283486263915_jpntt54mve',

    '5'   : '15273689226859_15317451606635_d7zzy3c7qi', 
    '5.1' : '15273713933931_15317494860395_avj47smmim', 
    '5.2' : '15273722257003_15317510195819_6edjluvdqi',
    '5.3' : '15273739624043_15317541653099_ii4bxpvabe',
    '5.4' : '15273750175339_15317561707115_csel26ku5a', 
    '5.5' : '15273760071275_15317579467371_cnewcj54me',
    '5.6' : '15273767935595_15317595851371_3q43tk7tvm', 
    '5.7' : '15273778683499_15317616560747_4piekvs4wu',

    's1-1'  : '14204232736303_14846150314543_37jq4ryehq',
    's1-2'  : '14204288179759_14846247373359_tnsknmapva',
    's1-3'  : '14204319768111_14846302489135_sr4ht4ccwq',
    's1-4'  : '14204331957807_14846326147631_dji2acqcze',
    's1-5'  : '14204346572335_14846351641135_7gvns4o5ue',
    's1-6'  : '14204361252399_14846376479279_cjajhf4d3y',
    's1-7'  : '14204370492975_14846393649711_6fduhdqite',
    's1-8'  : '14204395527727_14846438017583_s2jlti7lsm',
    's1-9'  : '14204411387439_14846464887343_f5lxgcqj5y',
    's1-10' : '14204424691247_14846487562799_xmbvntt6wa',

    's2-1'  : '14204490948143_14846603495983_kzevn36tii',
    's2-2'  : '14204506742319_14846634494511_ta2rxyg2oy',
    's2-3'  : '14204523322927_14846661233199_foqb3q7zb4',
    's2-4'  : '14204540034607_14846689085999_gjejdie4uy',
    's2-5'  : '14204555304495_14846715497007_zdanghuxzu',
    's2-6'  : '14204565200431_14846734371375_ap3bqpabpu',
    's2-7'  : '14204577259055_14846756194863_3ecad2535u',
    's2-8'  : '14204592528943_14846785227311_4hjl46y62e',
    's2-9'  : '14204602621487_14846802594351_ilnp6lxekq',
    's2-10' : '14206184136239_14849618610735_ihnbx7hkoi'
};



// // 🚀 Multi-Stream Key Manager
// const STREAM_KEYS = {
//     '1'   : '15254238731883_15281627925099_najspfkgne', 
//     '1.1' : '15254260751979_15281671637611_2plrcfqzze', 
//     '1.2' : '15254285524587_15281717840491_7e6qdknzsu',
    
//     '2'   : '15254299352683_15281743071851_7dvz3h5d7q',
//     '2.1' : '15254308986475_15281761618539_3xca7oij3u',
//     '2.2' : '15254328122987_15281795566187_zjqa6bqzoq', 

//     '3'   : '15254341885547_15281821059691_hhlpb5vicy', 
//     '3.1' : '15254357089899_15281848322667_sxeexgvzl4', 
//     '3.2' : '15254367510123_15281868180075_pc4jrytfgm',

//     '4'   : '15255022345835_15283095800427_vwrupxzstm', 
//     '4.1' : '15255038074475_15283122080363_ai5qqp2we4', 
//     '4.2' : '15255045480043_15283135842923_tldl4bhmii',
//     '4.3' : '15255208599147_15283449629291_abltofuc7m', 
//     '4.4' : '15255217708651_15283466603115_bojrrqtlmu', 
//     '4.5' : '15255227670123_15283486263915_jpntt54mve',

//     '5'   : '15273689226859_15317451606635_d7zzy3c7qi', 
//     '5.1' : '15273713933931_15317494860395_avj47smmim', 
//     '5.2' : '15273722257003_15317510195819_6edjluvdqi',
//     '5.3' : '15273739624043_15317541653099_ii4bxpvabe',
//     '5.4' : '15273750175339_15317561707115_csel26ku5a', 
//     '5.5' : '15273760071275_15317579467371_cnewcj54me',
//     '5.6' : '15273767935595_15317595851371_3q43tk7tvm', 
//     '5.7' : '15273778683499_15317616560747_4piekvs4wu'
// };


// // 🚀 Multi-Stream Key Manager (Ab 8 Keys ke sath)
// const STREAM_KEYS = {
//     '1': '15254285524587_15281717840491_7e6qdknzsu', 
//     '2': '14601696583275_14041072274027_apdzpdb5xi', 
//     '3': '14617940008555_14072500914795_ohw67ls7ny',
//     '4': '14601972227691_14041593547371_obdhgewlmq',
//     '5': '15145825803883_15082736847467_hjyjq4bud4',
//     '6': '15145851166315_15082784229995_mr5eweath4', 
//     '7': '15145866042987_15082813393515_axt6r27f7m',
//     '8': '15145878756971_15082836265579_oeowgtmnxu'
// };

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
