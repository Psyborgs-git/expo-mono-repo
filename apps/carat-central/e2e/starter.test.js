const { device, expect, element, by, waitFor } = require('detox');

describe('Carat Central App', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show the app on launch', async () => {
    // Basic test to ensure the app launches
    // This can be expanded as the app develops
    await waitFor(element(by.text('Carat Central (Expo Router)')))
      .toBeVisible()
      .withTimeout(10000);

    await expect(element(by.text('Carat Central (Expo Router)'))).toBeVisible();
  });

  it('should show button on screen', async () => {
    // Wait for the app to load and check for button
    await waitFor(element(by.text('Tap me')))
      .toBeVisible()
      .withTimeout(10000);

    await expect(element(by.text('Tap me'))).toBeVisible();
  });

  it('should handle app state changes', async () => {
    await device.sendToHome();
    await device.launchApp();

    // Just ensure the app can be relaunched
    await waitFor(element(by.text('Carat Central (Expo Router)')))
      .toBeVisible()
      .withTimeout(10000);
  });
});
