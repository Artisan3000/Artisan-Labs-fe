"use client";

import { useEffect, useState } from "react";
import styles from "./WorldClock.module.css";

type City = {
  name: string;
  timeZone: string;
};

const CITIES: City[] = [
  { name: "New York", timeZone: "America/New_York" },
  { name: "Chicago", timeZone: "America/Chicago" },
  { name: "London", timeZone: "Europe/London" },
  { name: "Tokyo", timeZone: "Asia/Tokyo" },
];

function formatTime(timeZone: string) {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone,
  });
}

export default function WorldClock() {
  const [times, setTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const tick = () => {
      const next: Record<string, string> = {};

      for (const city of CITIES) {
        next[city.name] = formatTime(city.timeZone);
      }

      setTimes(next);
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.worldClock}>
      {CITIES.map((city) => (
        <div key={city.name} className={styles.city}>
          <span className={styles.cityTime}>{times[city.name] ?? "--:--:--"}</span>
          <span className={styles.cityName}>{city.name}</span>
        </div>
      ))}
    </div>
  );
}
