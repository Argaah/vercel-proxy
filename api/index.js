// file: api/index.js
const fetch = require("node-fetch");

export default async function handler(req, res) {
  const path = req.url.replace(/^\/api/, "");
  const url = "https://api.ryzumi.vip" + path;

  try {
    const upstream = await fetch(url, {
      method: req.method,
      headers: req.headers,
      body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body
    });

    const contentType = upstream.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);

    const body = await upstream.arrayBuffer();
    res.status(upstream.status).send(Buffer.from(body));
  } catch (err) {
    console.error("❌ Proxy Error:", err);
    res.status(500).json({ error: "Proxy failed", detail: err.message });
  }
}
