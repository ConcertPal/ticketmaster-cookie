import cors from "cors";
import { TicketMasterfetchCookies } from "./ticketmasterCookie.js";
import express from "express";
import morgan from "morgan";
import "dotenv/config";
const app = express();
express(cors());

app.use(morgan("dev"));
app.get("/ticketmaster/cookie", async (req, res) => {
  console.log("Request received");
  try {
    const response = await TicketMasterfetchCookies();
    if (!response) {
      return res.status(500).send("Failed to fetch cookie");
    }
    res.status(200).send(response);
  } catch (err) {
    // console.log(err);
  }
});

app.get("/health", (req, res) => {
  res.status(200).send("Server is running");
});
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
