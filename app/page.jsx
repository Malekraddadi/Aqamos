"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [token, setToken] = useState(
    "5ZaE8y3G1KpAAeAf33xoSALFFKGj7hjzfoPphdurpump"
  );
  const [pair, setPair] = useState(null);
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const dexRes = await fetch(
          `https://api.dexscreener.com/latest/dex/search?q=${token}`
        );
        const dex = await dexRes.json();

        const debotRes = await fetch(
          `https://debot.ai/api/community/signal/channel/token/kline?chain=solana&tokens=${token}`
        );
        const debot = await debotRes.json();

        if (!dex?.pairs?.length) {
          setPair(null);
        } else {
          setPair(dex.pairs[0]); // pumpfun supported
        }

        setSignal(debot?.data?.slice(-1)?.[0] || null);
      } catch (e) {
        setError("Failed to fetch data");
      }

      setLoading(false);
    }

    load();
    const i = setInterval(load, 15000);
    return () => clearInterval(i);
  }, [token]);

  return (
    <main style={{ padding: 20 }}>
      <h2>🧠 Solana Live Memecoin Scanner</h2>

      <input
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      {loading && <p>⏳ Loading live data…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !pair && (
        <p style={{ color: "orange" }}>
          ⚠️ Token not indexed yet (or no liquidity)
        </p>
      )}

      {pair && (
        <div style={{ border: "1px solid #333", padding: 10 }}>
          <p><strong>Name:</strong> {pair.baseToken.name}</p>
          <p><strong>Symbol:</strong> {pair.baseToken.symbol}</p>
          <p><strong>DEX:</strong> {pair.dexId}</p>
          <p><strong>Price:</strong> ${pair.priceUsd}</p>
          <p><strong>Market Cap:</strong> ${pair.marketCap}</p>
          <p><strong>Liquidity:</strong> ${pair.liquidity?.usd ?? "N/A"}</p>
          <p><strong>24h Volume:</strong> ${pair.volume?.h24}</p>
        </div>
      )}

      {signal && (
        <div style={{ marginTop: 10 }}>
          <p>
            📊 <strong>DeBotAI Signal Close:</strong> {signal.close}
          </p>
        </div>
      )}

      <hr />

      <p>
        <strong>Decision:</strong>{" "}
        {signal && pair
          ? "🟢 LIVE + SIGNAL CONFIRMED"
          : signal
          ? "🟡 EARLY SIGNAL"
          : "❌ NO SIGNAL"}
      </p>
    </main>
  );
}      />

      {data && (
        <>
          <p>Price: ${data.priceUsd}</p>
          <p>Liquidity: ${data.liquidity?.usd}</p>
          <p>Volume: ${data.volume?.h24}</p>
        </>
      )}

      {signal && (
        <p>
          DeBot Signal → Close: {signal.close}
        </p>
      )}
    </main>
  );
}
