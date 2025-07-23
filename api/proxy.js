export default async function handler(req, res) {
  const path = req.url.replace("/api/proxy", "");
  const targetUrl = "https://api.ryzumi.vip" + path;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: "api.ryzumi.vip"
      },
      body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body
    });

    const contentType = response.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);

    const buffer = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(buffer));
  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).json({ error: "Proxy request failed", detail: err.message });
  }
}
