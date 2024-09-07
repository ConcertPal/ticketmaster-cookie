import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const proxy = {
  host: "geo.iproyal.com",
  port: "12321",
  username: "9AOJ3CyVgpOJNQnr",
  password: "hellospotca12_country-us",
};

const config = {
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    `--proxy-server=${proxy.host}:${proxy.port}`,
  ],
  executablePath: "/usr/bin/chromium-browser",
};

let ticketMasterCookie = null;

const TicketMasterfetchCookies = async (retries = 10) => {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch(config);
    try {
      const page = await browser.newPage();

      await page.authenticate({
        username: proxy.username,
        password: proxy.password,
      });

      const url = "https://www.ticketmaster.com/event/Z7r9jZ1A7F--O";

      page.on("request", async (r) => {
        const cookies = await page.cookies();
        // getting reese84
        for (let cookie in cookies) {
          cookie = cookies[cookie];
          if (cookie.name === "reese84") {
            ticketMasterCookie = cookie.value;
            await browser.close();
            resolve(ticketMasterCookie);
          }
        }
      });

      page
        .goto(url, {
          timeout: 0,
        })
        .catch(async () => {
          await browser.close();
          resolve(ticketMasterCookie);
        });
    } catch (err) {
      await browser.close();
      return newCookie;
    }
  });
};

export { TicketMasterfetchCookies, ticketMasterCookie };
