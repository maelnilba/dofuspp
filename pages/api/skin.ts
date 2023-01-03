import { NextApiRequest, NextApiResponse } from "next";
import { addExtra } from "puppeteer-extra";

// Add the Imports before StealthPlugin
require("puppeteer-extra-plugin-stealth/evasions/chrome.app");
require("puppeteer-extra-plugin-stealth/evasions/chrome.csi");
require("puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes");
require("puppeteer-extra-plugin-stealth/evasions/chrome.runtime");
require("puppeteer-extra-plugin-stealth/evasions/defaultArgs"); // pkg warned me this one was missing
require("puppeteer-extra-plugin-stealth/evasions/iframe.contentWindow");
require("puppeteer-extra-plugin-stealth/evasions/media.codecs");
require("puppeteer-extra-plugin-stealth/evasions/navigator.hardwareConcurrency");
require("puppeteer-extra-plugin-stealth/evasions/navigator.languages");
require("puppeteer-extra-plugin-stealth/evasions/navigator.permissions");
require("puppeteer-extra-plugin-stealth/evasions/navigator.plugins");
require("puppeteer-extra-plugin-stealth/evasions/navigator.vendor");
require("puppeteer-extra-plugin-stealth/evasions/navigator.webdriver");
require("puppeteer-extra-plugin-stealth/evasions/sourceurl");
require("puppeteer-extra-plugin-stealth/evasions/user-agent-override");
require("puppeteer-extra-plugin-stealth/evasions/webgl.vendor");
require("puppeteer-extra-plugin-stealth/evasions/window.outerdimensions");

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
