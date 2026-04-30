"use client";

import { useEffect, useState } from "react";
import styles from "./Stocks.module.css";

type Stock = {
  symbol: string;
  price: number;
  change: number;
  type: "equity" | "index";
};

const fallbackStocks: Stock[] = [
  { symbol: "S&P 500", price: 4850, change: 0.3, type: "index" },
  { symbol: "DOW", price: 38200, change: -0.1, type: "index" },
  { symbol: "NASDAQ", price: 15400, change: 0.5, type: "index" },
  { symbol: "AAPL", price: 185, change: 0.8, type: "equity" },
  { symbol: "TSLA", price: 240, change: -1.2, type: "equity" },
  { symbol: "NVDA", price: 520, change: 1.6, type: "equity" },
];

function formatNumber(value: number, decimals = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function TrendIcon({ up }: { up: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={up ? "M7 17 17 7" : "M7 7l10 10"} />
      <path d={up ? "M7 7h10v10" : "M17 7v10H7"} />
    </svg>
  );
}

export default function Stocks() {
  const [stocks, setStocks] = useState<Stock[]>(fallbackStocks);

  useEffect(() => {
    let cancelled = false;

    async function loadStocks() {
      try {
        const response = await fetch("/api/stocks");
        const data = (await response.json()) as { stocks?: Stock[] };

        if (!cancelled && data.stocks?.length) {
          setStocks(data.stocks);
        }
      } catch (error) {
        console.error("Failed to load stocks:", error);
      }
    }

    loadStocks();
    const interval = setInterval(loadStocks, 300000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles.stocks}>
      {stocks.map((stock) => {
        const up = stock.change >= 0;

        return (
          <div key={stock.symbol} className={styles.stock}>
            <span className={styles.symbol}>{stock.symbol}</span>
            <div className={styles.num}>
              <span className={styles.price}>
                ${formatNumber(stock.price, stock.type === "index" ? 0 : 2)}
              </span>
              <span
                className={`${styles.delta} ${up ? styles.up : styles.down}`}
              >
                <TrendIcon up={up} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
