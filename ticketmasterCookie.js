import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
let ticketMasterCookie = null;
const TicketMasterfetchCookies = async (retries = 10) => {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: false,
      executablePath: "/usr/bin/chromium-browser",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    const url =
      "https://www.ticketmaster.com/janet-jackson-together-again-austin-texas-07-27-2024/event/3A006029A27922C3";

    // Set a timeout for the page navigation
    const navigationPromise = page.goto(url, { waitUntil: "networkidle2" });
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 10000)
    ); // 10 seconds timeout

    await Promise.race([navigationPromise, timeout]);

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
