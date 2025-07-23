// /api/index.js
const fetch = require("node-fetch");

export default async function handler(req, res) {
  const targetPath = req.url.replace(/^\/api/, "");
  const targetUrl = "https://api.ryzumi.vip" + targetPath;

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body
    });

    const contentType = upstream.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);

    const buffer = await upstream.arrayBuffer();
    res.status(upstream.status).send(Buffer.from(buffer));
  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).json({ error: "Proxy failed", detail: err.message });
  }
}
