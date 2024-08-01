import cors from "cors";
import { TicketMasterfetchCookies } from "./ticketmasterCookie.js";
import express from "express";
import morgan from "morgan";
const app = express();
express(cors());

app.use(morgan("dev"));
app.get("/ticketmaster/cookie", async (req, res) => {
  try {
    const response = await TicketMasterfetchCookies();
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
  }
});
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
