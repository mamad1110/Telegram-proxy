import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// اینجا درخواست‌ها رو از ربات می‌گیریم و به تلگرام می‌فرستیم
app.all("/telegram/:path*", async (req, res) => {
  try {
    const path = req.params.path + (req.params[0] || "");
    const tgUrl = `https://api.telegram.org/${path}`;
    console.log("🔁 Forwarding to Telegram:", tgUrl);

    const response = await fetch(tgUrl, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "GET" ? undefined : JSON.stringify(req.body),
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (err) {
    console.error("❌ Proxy Error:", err);
    res.status(500).json({ error: "Proxy connection failed" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Telegram Proxy Active and Running!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Telegram Proxy running on port ${PORT}`));
