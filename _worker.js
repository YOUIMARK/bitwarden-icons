async function handleRequest(request, env) {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/([^/]+)\/icon\.png$/);
  if (!match) {
    return new Response("Not found", { status: 404 });
  }

  const domain = match[1];
  const token = env.LOGO_DEV_TOKEN;
  const logoUrl = `https://img.logo.dev/${domain}?token=${token}&retina=true`;

  const response = await fetch(logoUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36" },
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
      "Cache-Control": "public, max-age=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export default { fetch: handleRequest };

export const onRequest = ({ request, env }) => handleRequest(request, env);
