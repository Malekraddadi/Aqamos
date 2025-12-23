"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [token, setToken] = useState("6WdHhpRY7vL8SQ69bd89tAj3sk8jsjBrCLDUTZSNpump");
  const [data, setData] = useState(null);
  const [signal, setSignal] = useState(null);

  useEffect(() => {
    async function load() {
      const dex = await fetch(
        `https://api.dexscreener.com/latest/dex/search?q=${token}`
      ).then(r => r.json());

      const debot = await fetch(
        `https://debot.ai/api/community/signal/channel/token/kline?chain=solana&tokens=${token}`
      ).then(r => r.json());

      setData(dex?.pairs?.[0]);
      setSignal(debot?.data?.slice(-1)?.[0]);
    }

    load();
    const i = setInterval(load, 15000);
    return () => clearInterval(i);
  }, [token]);

  return (
    <main style={{ padding: 20 }}>
      <h1>Solana Live Memecoin Scanner</h1>

      <input
        value={token}
        onChange={e => setToken(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

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
