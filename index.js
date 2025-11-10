import express, { json } from "express";
import cors from "cors";

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

const app = express();

app.use(cors());
app.use(express.json());

// Lazy load route handlers
app.post("/api/verify", async (req, res) => {
  try {
    const { verify } = await import("./verify.js");
    return verify(req, res);
  } catch (error) {
    console.error("Error loading verify module:", error);
    return res.status(500).json({ error: "Failed to load verify module", details: error.message });
  }
});

app.post("/api/getVrcId", async (req, res) => {
  try {
    const { getVrcID } = await import("./getVrcID.js");
    return getVrcID(req, res);
  } catch (error) {
    console.error("Error loading getVrcID module:", error);
    return res.status(500).json({ error: "Failed to load getVrcID module", details: error.message });
  }
});

app.post("/api/getTrust", async (req, res) => {
  try {
    const { getTrust } = await import("./getTrust.js");
    return getTrust(req, res);
  } catch (error) {
    console.error("Error loading getTrust module:", error);
    return res.status(500).json({ error: "Failed to load getTrust module", details: error.message });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "health check" });
});

app.get("/locate", async (req, res) => {
  try {
    const r = await fetch("https://vrchat.com/api/1/auth/verifyLoginPlace?userId=usr_8d93d82e-9878-462a-aec4-1f7a7ac53344&placeCode=US&token=eml_fb9c8d9d-c037-45ef-9241-f41b9bde24dd");
    const data = await r.json();
    res.status(200).json({ message: data });
  } catch (error) {
    console.error("Error in /locate:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
