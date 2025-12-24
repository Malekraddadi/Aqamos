export const runtime = "nodejs"; // 🚨 THIS IS THE KEY FIX

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response(
      JSON.stringify({ error: "Missing token" }),
      { status: 400 }
    );
  }

  try {
    const dexRes = await fetch(
      `https://api.dexscreener.com/latest/dex/search?q=${token}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        },
        cache: "no-store"
      }
    );

    const dex = await dexRes.json();

    const debotRes = await fetch(
      `https://debot.ai/api/community/signal/channel/token/kline?chain=solana&tokens=${token}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        },
        cache: "no-store"
      }
    );

    const debot = await debotRes.json();

    return new Response(
      JSON.stringify({
        pair: dex?.pairs?.[0] || null,
        signal: debot?.data?.slice(-1)?.[0] || null
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Fetch failed",
        details: err?.message || "unknown"
      }),
      { status: 500 }
    );
  }
}
