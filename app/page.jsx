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
        const res = await fetch(`/api/scan?token=${token}`);
        const json = await res.json();

        if (json.error) {
          throw new Error(json.error);
        }

        setPair(json.pair);
        setSignal(json.signal);
      } catch (e) {
        setError("Failed to fetch data");
        setPair(null);
        setSignal(null);
      }

      setLoading(false);
    }

    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <main style={{ padding: 20 }}>
      <h2>🧠 Solana Live Memecoin Scanner</h2>

      <input
        value={token}
        onChange={(e) => setToken(e.target.value.trim())}
        placeholder="Paste token mint (pump.fun or Raydium)"
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
          fontSize: 14
        }}
      />

      {loading && <p>⏳ Loading live data…</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !pair && !error && (
        <p style={{ color: "orange" }}>
          ⚠️ Token not indexed yet or no liquidity
        </p>
      )}

      {pair && (
        <div
          style={{
            border: "1px solid #333",
            padding: 12,
            borderRadius: 6,
            marginTop: 10
          }}
        >
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
        <div style={{ marginTop: 12 }}>
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
          ? "🟡 EARLY SIGNAL (PUMP.FUN)"
          : "❌ NO SIGNAL"}
      </p>
    </main>
  );
}
