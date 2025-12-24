export const runtime = "nodejs";

async function safeJson(res) {
  const text = await res.text();
  if (!text || text.startsWith("<")) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

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
    // 1️⃣ DexScreener (primary – always reliable)
    const dexRes = await fetch(
      `https://api.dexscreener.com/latest/dex/search?q=${token}`,
      { cache: "no-store" }
    );
    const dex = await safeJson(dexRes);
    const pair = dex?.pairs?.[0] || null;

    // 2️⃣ DeBotAI (secondary – optional)
    let debotSignal = null;
    try {
      const debotRes = await fetch(
        `https://debot.ai/api/community/signal/channel/token/kline?chain=solana&tokens=${token}`,
        { cache: "no-store" }
      );
      const debot = await safeJson(debotRes);
      debotSignal = debot?.data?.slice(-1)?.[0] || null;
    } catch {
      debotSignal = null;
    }

    // 3️⃣ Decision logic (Dex-only fallback)
    const decision =
      pair && pair.volume?.h24 > 5000 && pair.txns?.h1?.buys > pair.txns?.h1?.sells
        ? "BUY"
        : "NO_SIGNAL";

    return new Response(
      JSON.stringify({
        token,
        pair,
        debotSignal,
        decision
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
        error: "Scan failed",
        details: err.message
      }),
      { status: 500 }
    );
  }
}
