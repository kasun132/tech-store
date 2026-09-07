const base = "http://localhost:3000";
const tinyPng = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

async function call(path, input, method = "GET") {
  const query = method === "GET" ? `?batch=1&input=${encodeURIComponent(JSON.stringify({ 0: { json: input } }))}` : "?batch=1";
  const response = await fetch(`${base}/api/trpc/${path}${query}`, {
    method,
    headers: method === "POST" ? { "content-type": "application/json" } : undefined,
    body: method === "POST" ? JSON.stringify({ 0: { json: input } }) : undefined,
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${path} ${response.status}: ${text}`);
  return JSON.parse(text);
}

const catalog = await call("catalog.list", null);
if (!Array.isArray(catalog?.[0]?.result?.data?.json)) throw new Error("catalog.list did not return an array");
const upload = await call("media.uploadImage", { fileName: `verification-${Date.now()}.png`, contentType: "image/png", base64: `data:image/png;base64,${tinyPng}` }, "POST");
const uploadedUrl = upload?.[0]?.result?.data?.json?.url;
if (!uploadedUrl || !uploadedUrl.startsWith("/manus-storage/")) throw new Error(`storage URL missing: ${JSON.stringify(upload)}`);
console.log(JSON.stringify({ catalogItems: catalog[0].result.data.json.length, uploadedUrl }));
