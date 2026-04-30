import { NextResponse } from "next/server";

type City = {
  name: string;
  latitude: number;
  longitude: number;
  timeZone: string;
};

const CITIES: City[] = [
  {
    name: "New York",
    latitude: 40.7128,
    longitude: -74.006,
    timeZone: "America/New_York",
  },
  {
    name: "Chicago",
    latitude: 41.8781,
    longitude: -87.6298,
    timeZone: "America/Chicago",
  },
  {
    name: "London",
    latitude: 51.5072,
    longitude: -0.1276,
    timeZone: "Europe/London",
  },
  {
    name: "Tokyo",
    latitude: 35.6762,
    longitude: 139.6503,
    timeZone: "Asia/Tokyo",
  },
];

const fallbackWeather = [
  { city: "New York", condition: "Clear", tempF: 62, tempC: 17 },
  { city: "Chicago", condition: "Wind", tempF: 56, tempC: 13 },
  { city: "London", condition: "Cloudy", tempF: 54, tempC: 12 },
  { city: "Tokyo", condition: "Rain", tempF: 68, tempC: 20 },
];

function codeToCondition(code: number) {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if (code >= 51 && code <= 82) return "Rain";
  if (code >= 95) return "Storm";
  return "Wind";
}

function fToC(tempF: number) {
  return Math.round((tempF - 32) * (5 / 9));
}

export async function GET() {
  try {
    const weather = await Promise.all(
      CITIES.map(async (city) => {
        const params = new URLSearchParams({
          latitude: String(city.latitude),
          longitude: String(city.longitude),
          current: "temperature_2m,weather_code",
          temperature_unit: "fahrenheit",
          timezone: city.timeZone,
        });
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params}`,
          { next: { revalidate: 900 } }
        );

        if (!response.ok) {
          throw new Error(`Weather request failed for ${city.name}`);
        }

        const data = (await response.json()) as {
          current?: {
            temperature_2m?: number;
            weather_code?: number;
          };
        };
        const tempF = Math.round(data.current?.temperature_2m ?? 0);
        const code = data.current?.weather_code ?? 0;

        return {
          city: city.name,
          condition: codeToCondition(code),
          tempF,
          tempC: fToC(tempF),
        };
      })
    );

    return NextResponse.json({ weather });
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json({ weather: fallbackWeather, fallback: true });
  }
}
