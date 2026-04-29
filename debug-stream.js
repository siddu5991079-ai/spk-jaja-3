const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

const TARGET_URL = process.env.TARGET_URL || 'https://your-target-stream-link.com';

(async () => {
    console.log('[*] Starting browser in Stealth Mode...');
    const browser = await puppeteer.launch({
        headless: false, 
        defaultViewport: { width: 1280, height: 720 },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=1280,720',
            '--autoplay-policy=no-user-gesture-required'
        ]
    });

    const page = await browser.newPage();

    // 🛑 POPUP & REDIRECT BLOCKER (Yeh ad tabs ko foran kill karega)
    browser.on('targetcreated', async (target) => {
        if (target.type() === 'page') {
            try {
                const newPage = await target.page();
                if (newPage && newPage !== page) {
                    console.log(`[!] Popup Tab detected and KILLED! Keeping focus on stream...`);
                    await page.bringToFront(); 
                    await newPage.close();
                }
            } catch (e) {}
        }
    });

    console.log(`[*] Navigating to: ${TARGET_URL}`);
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // 🎥 START SCREEN RECORDING IMMEDIATELY
    const recorder = new PuppeteerScreenRecorder(page, {
        followNewTab: false,
        fps: 30,
        videoFrame: { width: 1280, height: 720 },
    });
    
    console.log('[*] 🔴 Recording Started...');
    await recorder.start('./recording.mp4');

    // Thora wait karte hain taake player sahi se load ho jaye
    await new Promise(r => setTimeout(r, 5000));

    // =========================================================================
    // 🖱️ THE TERMINATOR CLICKER: Jab tak button zinda hai, chhorna nahi!
    // =========================================================================
    console.log('[*] Hunting for the JW Player Play Button...');
    let buttonGone = false;
    let attempts = 0;
    const maxAttempts = 15; // Max 15 baar try karega (approx 30 seconds)

    while (!buttonGone && attempts < maxAttempts) {
        buttonGone = true; // Assume karte hain gayab ho gaya, unless mil jaye
        
        // Main page aur tamam iframes mein dhoondega
        for (const frame of page.frames()) {
            try {
                // Aapki image ke mutabiq exact selector
                const playBtn = await frame.$('.jw-icon-display[aria-label="Play"]');
                
                if (playBtn) {
                    // Check if it's actually visible on screen
                    const isVisible = await frame.evaluate(el => {
                        const style = window.getComputedStyle(el);
                        return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                    }, playBtn);

                    if (isVisible) {
                        buttonGone = false; // Button abhi bhi zinda hai!
                        console.log(`[*] Play button detected in frame! SMASHING IT... (Attempt ${attempts + 1}/${maxAttempts})`);
                        
                        // Javascript ke zariye force click (overrides invisible divs)
                        await frame.evaluate(el => el.click(), playBtn); 
                        
                        // Click karne ke baad 2 seconds wait karega taake popup blocker apna kaam kare
                        await new Promise(r => setTimeout(r, 2000));
                        break; // Loop break karega aur dobara check karega naye siray se
                    }
                }
            } catch (err) {
                // Ignore cross-origin frame errors silently
            }
        }
        attempts++;
    }

    if (buttonGone) {
        console.log('[+] SUCCESS: Play button is completely GONE! Stream is running.');
    } else {
        console.log('[-] WARNING: Reached max click attempts, button might still be stuck.');
    }
    // =========================================================================

    // ⏱️ WAIT FOR REST OF THE RECORDING (Total ~30-40 seconds video banegi)
    console.log('[*] Capturing stream for a few more seconds...');
    await new Promise(r => setTimeout(r, 15000));

    // 🛑 STOP RECORDING & CLEANUP
    console.log('[*] Stopping recording...');
    await recorder.stop();
    await browser.close();
    console.log('[+] Done! Video saved as recording.mp4, ready for GitHub Release upload.');
})();
