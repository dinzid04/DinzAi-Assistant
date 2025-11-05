
const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    // --- Test Case 1: User Uploaded Image ---
    console.log('Running test case 1: User-uploaded image preview...');

    // 1. Upload an image to trigger a message with an image
    await page.setInputFiles('input#imageUpload', 'test_image.png');

    // 2. Add a caption and send the message
    await page.fill('textarea#chatInput', 'Check out this user image!');
    await page.click('button#sendBtn');

    // 3. Wait for the image to appear and click it
    const userImageInChat = await page.waitForSelector('.message.user-message .attached-file-container img', { timeout: 5000 });
    assert(userImageInChat, 'User image was not found in the chat container.');
    await userImageInChat.click();

    // 4. Verify the modal is visible
    await page.waitForSelector('#imagePreviewModal', { state: 'visible', timeout: 2000 });
    let modal = await page.$('#imagePreviewModal');
    assert(await modal.isVisible(), 'Image preview modal should be visible for user image.');

    // 5. Take a screenshot and close the modal
    await page.screenshot({ path: 'user_image_preview_modal.png' });
    await page.click('#closeImagePreview');

    // 6. Verify the modal is hidden
    await page.waitForSelector('#imagePreviewModal', { state: 'hidden', timeout: 2000 });
    console.log('Test case 1 successful!');

    // --- Test Case 2: AI Generated Image ---
    console.log('Running test case 2: AI-generated image preview...');

    // 1. Send the /create-image command
    await page.fill('textarea#chatInput', '/create-image a simple cat');
    await page.click('button#sendBtn');

    // 2. Wait for the AI's image response and click it
    // Increased timeout to allow for image generation
    const aiImageInChat = await page.waitForSelector('.message.bot-message .attached-file-container img', { timeout: 30000 });
    assert(aiImageInChat, 'AI-generated image was not found in the chat container.');
    await aiImageInChat.click();

    // 3. Verify the modal is visible again
    await page.waitForSelector('#imagePreviewModal', { state: 'visible', timeout: 2000 });
    modal = await page.$('#imagePreviewModal');
    assert(await modal.isVisible(), 'Image preview modal should be visible for AI image.');

    // 4. Take a screenshot and close the modal
    await page.screenshot({ path: 'ai_image_preview_modal.png' });
    await page.click('#closeImagePreview');

    // 5. Verify the modal is hidden again
    await page.waitForSelector('#imagePreviewModal', { state: 'hidden', timeout: 2000 });
    console.log('Test case 2 successful!');

    console.log('All frontend verification tests passed!');

  } catch (error) {
    console.error('Frontend verification failed:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
