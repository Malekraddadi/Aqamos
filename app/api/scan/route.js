export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return Response.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const dexRes = await fetch(
      `https://api.dexscreener.com/latest/dex/search?q=${token}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const dex = await dexRes.json();

    const debotRes = await fetch(
      `https://debot.ai/api/community/signal/channel/token/kline?chain=solana&tokens=${token}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const debot = await debotRes.json();

    return Response.json({
      pair: dex?.pairs?.[0] || null,
      signal: debot?.data?.slice(-1)?.[0] || null
    });
  } catch (e) {
    return Response.json({ error: "Fetch failed" }, { status: 500 });
  }
}
