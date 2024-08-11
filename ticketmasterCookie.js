import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const proxy = {
  host: "proxy.packetstream.io",
  port: "31112",
  username: "gurbinder8727",
  password: "as3Yf3Mg4WsSStDv_country-India",
};

const config = {
  headless: false,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    `--proxy-server=${proxy.host}:${proxy.port}`,
  ],
  executablePath: "/usr/bin/chromium-browser",
};

let browser;

async function launchBrowser() {
  if (!browser) {
    browser = await puppeteer.launch(config);
  }
}

async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let ticketMasterCookie = null;

const TicketMasterfetchCookies = async (retries = 10) => {
  try {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Attempt ${i + 1}`);

        if (!browser) {
          await launchBrowser();
        }
        await launchBrowser();
        const page = await browser.newPage();

        await page.authenticate({
          username: proxy.username,
          password: proxy.password,
        });

        const url = "https://www.ticketmaster.com/event/Z7r9jZ1A7u9-M";
        await page.goto(url, {
          waitUntil: "networkidle2",
          timeout: 60000, // 60 seconds timeout
        });

        const cookies = await page.cookies();
        console.log(cookies);
        for (const cookie of cookies) {
          if (cookie.name === "reese84") {
            ticketMasterCookie = cookie.value;
            await page.close();
            return ticketMasterCookie;
          }
        }

        await page.close();
        await closeBrowser();
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        await sleep(1000);
        await closeBrowser();
      }
    }
    throw new Error(
      "Failed to fetch the TicketMaster cookie after multiple attempts"
    );
  } catch (err) {
    console.log(err);
  } finally {
    await closeBrowser();
  }
};

// (async () => {
//   try {
//     const cookie = await TicketMasterfetchCookies();
//     console.log("Fetched cookie:", cookie);
//   } catch (error) {
//     console.error("Failed to fetch the cookie:", error);
//   } finally {
//     await closeBrowser();
//   }
// })();

export { TicketMasterfetchCookies, ticketMasterCookie };
