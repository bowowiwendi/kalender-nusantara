import { NextResponse } from "next/server";
import { calculatePrayerTimes, prayerMethods } from "@/lib/prayerTimes";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "-6.2088");
  const lng = parseFloat(searchParams.get("lng") || "106.8456");
  const methodId = parseInt(searchParams.get("method") || "2");
  const tz = parseInt(searchParams.get("tz") || "7");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: "Invalid coordinates. Use lat and lng parameters." },
      { status: 400 }
    );
  }

  const method = prayerMethods.find((m) => m.id === methodId) || prayerMethods[2];
  const today = new Date();
  const times = calculatePrayerTimes(today, lat, lng, tz, methodId);

  return NextResponse.json({
    status: "success",
    data: {
      ...times,
      method: method.name,
      coordinates: { lat, lng },
      timezone: tz,
    },
  });
}
