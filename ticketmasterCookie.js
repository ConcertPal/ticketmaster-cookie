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
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    `--proxy-server=${proxy.host}:${proxy.port}`,
  ],
  executablePath: "/usr/bin/chromium-browser",
};

let ticketMasterCookie = null;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const TicketMasterfetchCookies = async (retries = 10) => {
  try {
    let newCookie = "";
    console.log("Browser launched");
    var browser = await puppeteer.launch(config);
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
              await page.close();
              newCookie = ticketMasterCookie;
              resolve(ticketMasterCookie);
            }
          }
          // await browser.close();
          return newCookie;
        } catch (error) {
          //supress

          console.log(error);
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
};

export { TicketMasterfetchCookies, ticketMasterCookie };
