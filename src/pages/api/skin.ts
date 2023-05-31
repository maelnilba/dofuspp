import { NextApiRequest, NextApiResponse } from "next";
import { addExtra } from "puppeteer-extra";
import Cors from "cors";

// Add the Imports before StealthPlugin, this is only due to bug in Vercel
require("puppeteer-extra-plugin-stealth/evasions/chrome.app");
require("puppeteer-extra-plugin-stealth/evasions/chrome.csi");
require("puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes");
require("puppeteer-extra-plugin-stealth/evasions/chrome.runtime");
require("puppeteer-extra-plugin-stealth/evasions/defaultArgs");
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
require("puppeteer-extra-plugin-user-preferences");
require("puppeteer-extra-plugin-user-data-dir");
//

import chromium from "chrome-aws-lambda";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
const puppeteerExtra = addExtra(chromium.puppeteer);
puppeteerExtra.use(StealthPlugin());

const URL = "https://www.dofus.com/";

function initMiddleware(middleware: any) {
  return (req: any, res: any) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ["OPTIONS", "GET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

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

  let imageb64: string | null = null;
  page.on("response", async (response: any) => {
    const matches = /.*\.(jpg|png|svg|gif)$/.exec(response.url());
    if (matches && matches.length === 2) {
      const buffer = await response.buffer();
      imageb64 = buffer.toString("base64");
    }
  });
  await page.goto(backgroundImageCleaned, { waitUntil: "networkidle2" });
  await browser.close();

  res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate");
  res.status(200).json({
    src: backgroundImageCleaned,
    image: imageb64,
  });
};
