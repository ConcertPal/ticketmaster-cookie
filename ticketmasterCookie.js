import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import "dotenv/config";
puppeteer.use(StealthPlugin());

console.log(process.env.PROXY_PASSWORD, process.env.PROXY_USERNAME);
// const proxy = {
//   host: "geo.iproyal.com",
//   port: "12321",
//   username: process.env.PROXY_USERNAME,
//   password: process.env.PROXY_PASSWORD,
// };

const config = {
  headless: false,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    // `--proxy-server=${proxy.host}:${proxy.port}`,
  ],
  executablePath: "/usr/bin/chromium-browser",
};

let ticketMasterCookie = null;

const TicketMasterfetchCookies = async (retries = 10) => {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch(config);
    try {
      const page = await browser.newPage();

      // await page.authenticate({
      //   username: proxy.username,
      //   password: proxy.password,
      // });

      const url =
        "https://www.ticketmaster.com/don-toliver-psycho-tour-saint-louis-missouri-11-19-2024/event/060060D4FE5B9E64";

      page.on("request", async (r) => {
        const cookies = await page.cookies();
        for (let cookie in cookies) {
          cookie = cookies[cookie];
          if (cookie.name === "tmpt") {
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
