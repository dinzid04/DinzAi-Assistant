
const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    // 1. Upload an image to trigger a message with an image
    // The test image 'test_image.png' should exist in the root directory
    await page.setInputFiles('input#imageUpload', 'test_image.png');

    // Add a caption and send the message
    await page.fill('textarea#chatInput', 'Check out this image!');
    await page.click('button#sendBtn');

    // Wait for the image to appear in the chat container
    await page.waitForSelector('.message.user-message .attached-file-container img', { timeout: 5000 });
    const imageInChat = await page.$('.message.user-message .attached-file-container img');
    assert(imageInChat, 'Image was not found in the chat container after sending.');

    // 2. Click on the image to open the preview modal
    await imageInChat.click();

    // 3. Verify the modal is visible
    await page.waitForSelector('#imagePreviewModal', { state: 'visible', timeout: 2000 });
    const modal = await page.$('#imagePreviewModal');
    assert(await modal.isVisible(), 'Image preview modal should be visible after clicking the image.');

    // 4. Take a screenshot
    await page.screenshot({ path: 'image_preview_modal.png' });

    // 5. Click the close button
    await page.click('#closeImagePreview');

    // 6. Verify the modal is hidden
    await page.waitForSelector('#imagePreviewModal', { state: 'hidden', timeout: 2000 });
    const modalAfterClose = await page.$('#imagePreviewModal');
    assert(!(await modalAfterClose.isVisible()), 'Image preview modal should be hidden after clicking the close button.');

    console.log('Frontend verification successful!');

  } catch (error) {
    console.error('Frontend verification failed:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
