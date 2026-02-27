"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CropHealth from "@/components/dashboard/CropHealth";
import TankLevel from "@/components/dashboard/TankLevel";
import SmartValve from "@/components/dashboard/SmartValve";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import IrrigationLog from "@/components/dashboard/IrrigationLog";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/login');
  }, [router]);
  return null;
}
