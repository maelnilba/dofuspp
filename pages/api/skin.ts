import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-extra";
import chrome from "chrome-aws-lambda";
// import StealthPlugin from "puppeteer-extra-plugin-stealth";
// import { Protocol } from "puppeteer";
// puppeteer.use(StealthPlugin());

const URL = "https://www.dofus.com/";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { url },
  } = req;

  if (!url?.includes(URL) || typeof url !== "string") {
    res.end();
    return;
  }

  const browser = await puppeteer.launch(
    process.env.NODE_ENV === "production"
      ? {
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
        }
      : {
          executablePath: "/Applications/Chromium.app/Contents/MacOS/Chromium",
        }
  );
  const page = await browser.newPage();
  await page.goto(url);
  const backgroundImage = await page.evaluate(
    (el) => window.getComputedStyle(el).backgroundImage,
    await page.$(".ak-entitylook")
  );

  const backgroundImageCleaned = backgroundImage.match(/url\("(.*)"/)?.[1];

  await browser.close();

  res.status(200).json({
    image: backgroundImageCleaned,
  });
};
