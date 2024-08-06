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
};

export const TicketMasterfetchCookies = async () => {
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();
  let reese84Cookie = null;

  try {
    await page.authenticate({
      username: proxy.username,
      password: proxy.password,
    });

    await page.goto("https://www.ticketmaster.com/event/Z7r9jZ1A7F--O", {
      waitUntil: "networkidle2",
    });

    const cookies = await page.cookies();
    const cookie = cookies.find((c) => c.name === "reese84");

    reese84Cookie = cookie?.value;
  } catch (error) {
    console.error("Error encountered:", error);
  } finally {
    await browser.close();
  }

  return reese84Cookie;
};

// const start = Date.now();
// TicketMasterfetchCookies().then((res) =>
//   console.log("Result:", res, `\nTime: ${Date.now() - start}ms`)
// );
