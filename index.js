const puppeteer = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
const https = require("https");

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: "30a5a2befdafc9b87ffe06d90b1c7219",
    },
    visualFeedback: true,
  })
);
(async () => {
  let launchOptions = {
    headless: false,
    executablePath: "/usr/bin/google-chrome-stable", // because we are using puppeteer-core so we must define this option
    args: ["--start-maximized"],
  };

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  // go to the target web
  await page.goto("https://www.google.com/recaptcha/api2/demo");

  await page.solveRecaptchas();

  await Promise.all([
    page.waitForNavigation(),
    await page.click("#recaptcha-demo-submit"),
  ]);

  await page.screenshot({ path: "data/pandora.png" });

  await page.close();
  await browser.close();
})();
