import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const proxy = {
  host: "geo.iproyal.com",
  port: "12321",
  username: "9AOJ3CyVgpOJNQnr",
  password: "spotconcertcal",
};

let browser = await puppeteer.launch({
  headless: false,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    // `--proxy-server=${proxy.host}:${proxy.port}`,
  ],
});

let ticketMasterCookie = null;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const TicketMasterfetchCookies = async (retries = 10) => {
  try {
    if (!browser) {
      browser = await puppeteer.launch({
        headless: false,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          // `--proxy-server=${proxy.host}:${proxy.port}`,
        ],
      });
    }
    return new Promise(async (resolve, reject) => {
      console.time("cookie");
      const page = await browser.newPage();

      await page.authenticate({
        username: proxy.username,
        password: proxy.password,
      });

      const url = "https://www.ticketmaster.com/event/Z7r9jZ1A7F--O";
      page.goto(url, {
        timeout: 0,
      });

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
              await page.close();
            }
          }
        } catch (error) {
          //supress
        }
      });
    });
    
  } catch (err) {
 
  }
};

export { TicketMasterfetchCookies, ticketMasterCookie };
