export default async function handler(req, res) {
  const targetPath = req.url.replace("/api/proxy/", "");
  const url = `https://api.ryzumi.vip/${targetPath}`;

  try {
    const upstreamRes = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers,
        host: "api.ryzumi.vip"
      },
      body: req.method === "GET" || req.method === "HEAD" ? undefined : JSON.stringify(req.body)
    });

    const contentType = upstreamRes.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);

    const buffer = await upstreamRes.arrayBuffer();
    res.status(upstreamRes.status).send(Buffer.from(buffer));
  } catch (err) {
    console.error("❌ Proxy Error:", err);
    res.status(500).json({ error: "Proxy error", detail: err.message });
  }
}
