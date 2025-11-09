import express, { json } from "express";
import cors from "cors";
import { VRChat } from "vrchat";

import { verify } from "./verify.js";
import { getTrust } from "./getTrust.js";
import { getVrcID } from "./getVrcID.js";
const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/verify", verify);
app.post("/api/getVrcId", getVrcID);
app.post("/api/getTrust", getTrust);

app.get("/", (req, res) => {
  res.status(200).json({ message: "health check" });
});
app.listen(3000, () => {
  console.log("server is running");
});
