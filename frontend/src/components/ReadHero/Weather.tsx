"use client";

import { useEffect, useState } from "react";
import styles from "./Weather.module.css";

type WeatherCity = {
  city: string;
  condition: string;
  tempF: number;
  tempC: number;
};

const fallbackWeather: WeatherCity[] = [
  { city: "New York", condition: "Clear", tempF: 62, tempC: 17 },
  { city: "Chicago", condition: "Wind", tempF: 56, tempC: 13 },
  { city: "London", condition: "Cloudy", tempF: 54, tempC: 12 },
  { city: "Tokyo", condition: "Rain", tempF: 68, tempC: 20 },
];

function WeatherIcon({ condition }: { condition: string }) {
  if (condition === "Rain" || condition === "Storm") {
    return (
      <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
        <path d="M7 18h10a4 4 0 0 0 .7-7.94A6 6 0 0 0 6.2 8.5 4.8 4.8 0 0 0 7 18Z" />
        <path d="M8 21l1-2" />
        <path d="M13 21l1-2" />
        <path d="M18 21l1-2" />
      </svg>
    );
  }

  if (condition === "Cloudy" || condition === "Fog") {
    return (
      <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
        <path d="M7 18h10a4 4 0 0 0 .7-7.94A6 6 0 0 0 6.2 8.5 4.8 4.8 0 0 0 7 18Z" />
        <path d="M5 21h14" />
      </svg>
    );
  }

  if (condition === "Wind") {
    return (
      <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
        <path d="M3 8h12a3 3 0 1 0-3-3" />
        <path d="M3 14h17a3 3 0 1 1-3 3" />
        <path d="M3 20h9" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
      <path d="m4.9 4.9 2.1 2.1" />
      <path d="m17 17 2.1 2.1" />
      <path d="m19.1 4.9-2.1 2.1" />
      <path d="m7 17-2.1 2.1" />
    </svg>
  );
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherCity[]>(fallbackWeather);

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      try {
        const response = await fetch("/api/weather");
        const data = (await response.json()) as { weather?: WeatherCity[] };

        if (!cancelled && data.weather?.length) {
          setWeather(data.weather);
        }
      } catch (error) {
        console.error("Failed to load weather:", error);
      }
    }

    loadWeather();
    const interval = setInterval(loadWeather, 900000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles.weather}>
      {weather.map((item) => (
        <div key={item.city} className={styles.weatherCity}>
          <div>
            <span className={styles.weatherCond}>{item.condition}</span>
            {", "}
            <span className={styles.weatherTemp}>
              {item.tempF}°F / {item.tempC}°C
            </span>
          </div>
          <WeatherIcon condition={item.condition} />
        </div>
      ))}
    </div>
  );
}
