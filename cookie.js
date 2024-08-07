import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const proxy = {
  host: "geo.iproyal.com",
  port: "12321",
  username: "9AOJ3CyVgpOJNQnr",
  password: "spotconcertcal",
};

const config = {
  headless: false,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    `--proxy-server=${proxy.host}:${proxy.port}`,
  ],
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const TicketMasterfetchCookies = async (retries = 10) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const browser = await puppeteer.launch(config);
      const page = await browser.newPage();

      await page.authenticate({
        username: proxy.username,
        password: proxy.password,
      });

      await page.goto("https://www.ticketmaster.com/event/Z7r9jZ1A7F--O", {
        waitUntil: "networkidle2",
        timeout: 0,
      });

      const cookiePromise = new Promise((resolve) => {
        page.on("response", async () => {
          const cookies = await page.cookies();
          for (const cookie of cookies) {
            if (cookie.name === "reese84") {
              await browser.close();
              resolve(cookie.value);
              return;
            }
          }
        });

        setTimeout(() => {
          resolve(null);
        }, 30000);
      });

      const ticketMasterCookie = await cookiePromise;

      if (ticketMasterCookie) {
        return ticketMasterCookie;
      }
    } catch (error) {
      console.error(`Error during attempt ${attempt + 1}:`, error);
      await sleep(2000);
    }
  }

  return null;
};

let time = Date.now();
TicketMasterfetchCookies(1).then((res) =>
  console.log("Result:", res, `\nTime: ${Date.now() - time}ms`)
);
