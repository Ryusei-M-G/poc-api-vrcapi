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

app.get("/locate",async(req,res) => {
  const r = await fetch("https://vrchat.com/api/1/auth/verifyLoginPlace?userId=usr_8d93d82e-9878-462a-aec4-1f7a7ac53344&placeCode=US&token=eml_fb9c8d9d-c037-45ef-9241-f41b9bde24dd");
  res.status(200).json({message: res});
})

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
