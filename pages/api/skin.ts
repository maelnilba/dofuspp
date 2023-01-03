import { NextApiRequest, NextApiResponse } from "next";
import { addExtra } from "puppeteer-extra";
import chromium from "chrome-aws-lambda";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
const puppeteerExtra = addExtra(chromium.puppeteer);
puppeteerExtra.use(StealthPlugin());

const URL = "https://www.dofus.com/";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { url },
  } = req;

  if (!url?.includes(URL) || typeof url !== "string") {
    res.end();
    return;
  }

  const browser = await puppeteerExtra.launch({
    args: chromium.args,
    executablePath:
      process.env.NODE_ENV === "production"
        ? await chromium.executablePath
        : "/Applications/Chromium.app/Contents/MacOS/Chromium",
    headless: process.env.NODE_ENV === "production" ? chromium.headless : true,
  });
  const page = await browser.newPage();
  await page.goto(url);
  const backgroundImage = await page.evaluate(
    (el: any) => window.getComputedStyle(el).backgroundImage,
    await page.$(".ak-entitylook")
  );

  const backgroundImageCleaned = backgroundImage.match(/url\("(.*)"/)?.[1];

  await browser.close();

  res.status(200).json({
    image: backgroundImageCleaned,
  });
};
