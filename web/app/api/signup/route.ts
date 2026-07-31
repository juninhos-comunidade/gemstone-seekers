export async function POST(req: Request) {
  const body = await req.json();

  const upstreamResponse = await fetch(
    "https://gemstone-seekers-1.onrender.com/api/v1/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const text = await upstreamResponse.text();
  const contentType =
    upstreamResponse.headers.get("content-type") ?? "application/json";

  return new Response(text, {
    status: upstreamResponse.status,
    headers: {
      "Content-Type": contentType,
    },
  });
}
