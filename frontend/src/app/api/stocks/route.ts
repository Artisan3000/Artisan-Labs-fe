import { NextResponse } from "next/server";

type MarketSymbol = {
  label: string;
  symbol: string;
  type?: "index" | "equity";
  fallbackPrice: number;
};

const SYMBOLS: MarketSymbol[] = [
  { label: "S&P 500", symbol: "^spx", type: "index", fallbackPrice: 4850 },
  { label: "DOW", symbol: "^dji", type: "index", fallbackPrice: 38200 },
  { label: "NASDAQ", symbol: "^ndq", type: "index", fallbackPrice: 15400 },
  { label: "AAPL", symbol: "aapl.us", fallbackPrice: 185 },
  { label: "TSLA", symbol: "tsla.us", fallbackPrice: 240 },
  { label: "NVDA", symbol: "nvda.us", fallbackPrice: 520 },
];

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function fallbackStocks() {
  const minuteBlock = Math.floor(Date.now() / 60000);

  return SYMBOLS.map((item, index) => {
    const rand = pseudoRandom(minuteBlock + index) - 0.5;
    const change = rand * (item.type === "index" ? 0.8 : 2.6);

    return {
      symbol: item.label,
      price: item.fallbackPrice + change,
      change,
      type: item.type ?? "equity",
    };
  });
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (const char of line) {
    if (char === "\"") {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

export async function GET() {
  try {
    const stocks = await Promise.all(
      SYMBOLS.map(async (symbol) => {
        const response = await fetch(
          `https://stooq.com/q/l/?s=${encodeURIComponent(
            symbol.symbol
          )}&f=sd2t2ohlcv&h&e=csv`,
          { next: { revalidate: 300 } }
        );

        if (!response.ok) {
          throw new Error(`Market request failed for ${symbol.label}`);
        }

        const csv = await response.text();
        const row = csv.trim().split(/\r?\n/)[1];

        if (!row) {
          throw new Error(`Missing quote for ${symbol.label}`);
        }

        const [, , , open, , , close] = parseCsvLine(row);
        const openPrice = Number(open);
        const price = Number(close);
        const delta =
          Number.isFinite(openPrice) && openPrice !== 0
            ? ((price - openPrice) / openPrice) * 100
            : 0;

        if (!Number.isFinite(price)) {
          throw new Error(`Invalid quote for ${symbol.label}`);
        }

        return {
          symbol: symbol.label,
          price,
          change: Number.isFinite(delta) ? delta : 0,
          type: symbol.type ?? "equity",
        };
      })
    );

    return NextResponse.json({ stocks });
  } catch (error) {
    console.error("Stocks API error:", error);
    return NextResponse.json({ stocks: fallbackStocks(), fallback: true });
  }
}
