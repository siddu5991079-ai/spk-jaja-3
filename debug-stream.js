const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

const TARGET_URL = process.env.TARGET_URL || 'https://your-target-stream-link.com';

(async () => {
    console.log('[*] Starting browser...');
    const browser = await puppeteer.launch({
        headless: false, // Virtual display ke liye zaroori
        defaultViewport: { width: 1280, height: 720 },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=1280,720',
            '--autoplay-policy=no-user-gesture-required'
        ]
    });

    const page = await browser.newPage();

    // 🛑 POPUP & REDIRECT BLOCKER
    // Agar click karne se koi naya tab khulta hai, yeh usko foran block/close kar dega
    browser.on('targetcreated', async (target) => {
        if (target.type() === 'page') {
            try {
                const newPage = await target.page();
                if (newPage && newPage !== page) {
                    console.log(`[!] Popup Tab detected and blocked! Keeping focus on video...`);
                    await page.bringToFront(); 
                    await newPage.close();
                }
            } catch (e) {}
        }
    });

    console.log(`[*] Navigating to: ${TARGET_URL}`);
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // 🎥 START SCREEN RECORDING
    const recorder = new PuppeteerScreenRecorder(page, {
        followNewTab: false,
        fps: 30,
        videoFrame: { width: 1280, height: 720 },
    });
    
    console.log('[*] 🔴 Recording Started...');
    await recorder.start('./recording.mp4');

    // 🖱️ AUTO CLICKER FOR JW PLAYER BUTTON
    try {
        console.log('[*] Waiting for Play Button to appear...');
        // Selector from your image: .jw-icon-display
        await page.waitForSelector('.jw-icon-display', { timeout: 15000 });
        
        console.log('[*] Clicking the Play Button...');
        await page.click('.jw-icon-display');
        console.log('[+] Clicked successfully! Stream should start now.');
    } catch (err) {
        console.log('[-] Play button not found or already playing.');
    }

    // ⏱️ WAIT FOR 30 SECONDS (Recording timeframe)
    console.log('[*] Recording for 30 seconds... (You can cancel workflow anytime to check partial video)');
    await new Promise(r => setTimeout(r, 30000));

    // 🛑 STOP RECORDING & CLEANUP
    console.log('[*] Stopping recording...');
    await recorder.stop();
    await browser.close();
    console.log('[+] Done! Video saved as recording.mp4');
})();
