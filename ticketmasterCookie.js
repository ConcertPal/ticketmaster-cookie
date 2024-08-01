import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

let ticketMasterCookie = null;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const proxy = {
  host: "geo.iproyal.com",
  port: "12321",
  username: "9AOJ3CyVgpOJNQnr",
  password: "spotconcertcal",
};

const TicketMasterfetchCookies = async (retries = 10) => {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: "/usr/bin/chromium-browser",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        `--proxy-server=${proxy.host}:${proxy.port}`,
      ],
    });

    const page = await browser.newPage();

    await page.authenticate({
      username: proxy.username,
      password: proxy.password,
    });

    const url = "https://www.ticketmaster.com/event/Z7r9jZ1A7F--O";

    // Set a timeout for the page navigation
    const navigationPromise = page.goto(url, { waitUntil: "networkidle2" });

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 60000)
    ); // 60 seconds timeout

    await Promise.race([navigationPromise, timeout]);

    await sleep(4000);

    const cookies = await page.cookies();
    const reese84 = cookies.find((c) => c.name === "reese84");

    if (!reese84?.value) {
      throw new Error("Cookie not found");
    }
    await browser.close();

    ticketMasterCookie = reese84?.value;

    return ticketMasterCookie;
  } catch (err) {
    console.log(err);
    if (browser) {
      await browser.close();
    }

    // Retry logic
    if (retries > 0) {
      console.warn(
        `COOKIE | TICKETMASTER | FAILURE | COOKIE FETCHING | Retrying... (${retries} retries left)`
      );
      await TicketMasterfetchCookies(retries - 1);
    } else {
      console.error(
        "COOKIE | TICKETMASTER | Max retries reached. Could not fetch cookies."
      );
    }
  }
};

export { TicketMasterfetchCookies, ticketMasterCookie };
