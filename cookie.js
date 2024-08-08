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
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    `--proxy-server=${proxy.host}:${proxy.port}`,
  ],
  //executablePath: "/usr/bin/chromium-browser",
};

let browser;
let ticketMasterCookie = null;

const TicketMasterfetchCookies = async (retries = 10) => {
  try {
    if (!browser) {
      browser = await puppeteer.launch(config);
    }
    return new Promise(async (resolve, reject) => {
      console.time("cookie");
      const page = await browser.newPage();

      await page.authenticate({
        username: proxy.username,
        password: proxy.password,
      });

      const url = "https://www.ticketmaster.com/event/Z7r9jZ1A7F--O";
      await page
        .goto(url, { timeout: 0 })
        .then(() => {})
        .catch(() => {});

      page.on("request", async (r) => {
        try {
          const cookies = await page.cookies();
          // getting reese84
          for (let cookie in cookies) {
            cookie = cookies[cookie];
            if (cookie.name === "reese84") {
              ticketMasterCookie = cookie.value;
              console.timeEnd("cookie");
              page.removeAllListeners("request");
              resolve(ticketMasterCookie);
              await browser.close();
            }
          }
        } catch (error) {
          //supress
        }
      });
    });
  } catch (err) {}
};

export { TicketMasterfetchCookies, ticketMasterCookie };
