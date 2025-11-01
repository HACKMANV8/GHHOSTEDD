"use client";

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { nodeService } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Terminal,
  Users,
  BarChart3,
  MapPin,
  HeartPulse,
  Server,
  AlertTriangle,
  Compass as CompassIcon
} from "lucide-react";

import EnvironmentalMap from '@/components/EnvironmentalMap';
// 💡 NEW: Import the toast notification utility
import toast from 'react-hot-toast';

/* -------------------------------------------------------------------------- */
/* DATA TYPES                                */
/* -------------------------------------------------------------------------- */
interface HeatmapPoint {
  lat: number;
  lng: number;
  value?: number;
}

interface LocationResponse {
  loc?: string; // "12.9716,77.5946"
}

// 💡 NEW: Define the types for the environment status and socket events
type EnvStatus = "Safe" | "Caution" | "Danger" | "Unknown";

interface EnvUpdate {
  environment_status: EnvStatus;
}

interface SurvivalUpdate {
  survival_time: number | null;
}

/* -------------------------------------------------------------------------- */
/* COMPASS COMPONENT                             */
/* -------------------------------------------------------------------------- */
interface CompassProps {
  nodeLocation: [number, number];
  heatmapData: HeatmapPoint[];
}

function Compass({ nodeLocation, heatmapData }: CompassProps) {
  const [bearing, setBearing] = useState<number>(0);

  const calculateBearing = (from: [number, number], to: [number, number]): number => {
    const [lat1, lon1] = from.map(d => (d * Math.PI) / 180);
    const [lat2, lon2] = to.map(d => (d * Math.PI) / 180);

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

    let brng = (Math.atan2(y, x) * 180) / Math.PI;
    return (brng + 360) % 360;
  };

  const findNearestPoint = (): [number, number] | null => {
    if (!Array.isArray(heatmapData) || heatmapData.length === 0) return null;

    let closest: HeatmapPoint | null = null;
    let minDist = Infinity;

    for (const p of heatmapData) {
      // Runtime type guard
      if (typeof p?.lat === 'number' && typeof p?.lng === 'number') {
        const d = Math.pow(p.lat - nodeLocation[0], 2) + Math.pow(p.lng - nodeLocation[1], 2);
        if (d < minDist) {
          minDist = d;
          closest = p;
        }
      }
    }

    return closest ? [closest.lat, closest.lng] : null;
  };

  useEffect(() => {
    const target = findNearestPoint();
    setBearing(target ? calculateBearing(nodeLocation, target) : 0);
  }, [nodeLocation, heatmapData]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mx-auto">
        {/* CHANGED: Now uses your theme variable */}
        <div className="absolute inset-0 rounded-full border-4 border-accent-green/30" />

        {["N", "E", "S", "W"].map((dir, i) => (
          <span
            key={dir}
            // CHANGED: Now uses your theme variable
            className="absolute text-accent-green text-xs font-bold"
            style={{
              top: i === 0 ? "-8px" : i === 2 ? "auto" : "50%",
              bottom: i === 2 ? "-8px" : "auto",
              left: i === 3 ? "-8px" : i === 1 ? "auto" : "50%",
              right: i === 1 ? "-8px" : "auto",
              transform: i < 2 ? "translateX(-50%)" : "translateY(-50%)",
            }}
          >
            {dir}
          </span>
        ))}

        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
          style={{ transform: `rotate(${bearing}deg)` }}
        >
          {/* CHANGED: Now uses your theme variable */}
          <div className="w-1 h-12 bg-accent-green rounded-t-full shadow-lg" />
          <div className="w-1 h-12 bg-red-600 rounded-b-full -mt-12 shadow-lg" />
        </div>

        {/* CHANGED: Now uses your theme variable */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-accent-green rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md" />
      </div>

      {/* CHANGED: Now uses your theme variable */}
      <div className="mt-3 text-accent-green font-mono text-sm">{bearing.toFixed(0)}°</div>
      {/* CORRECT: This class matches your theme file */}
      <div className="text-xs text-muted-foreground mt-1">Nearest hotspot</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN PAGE                                 */
/* -------------------------------------------------------------------------- */
export default function NodePage() {
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [gasLevel, setGasLevel] = useState<string>('');
  const [location, setLocation] = useState<[number, number]>([12.9716, 77.5946]);
  const [loading, setLoading] = useState(true);
  
  // 💡 NEW: State for environment status
  const [envStatus, setEnvStatus] = useState<EnvStatus>("Unknown");
  // 💡 NEW: State and constants for toast alert throttling
  const [lastAlertTime, setLastAlertTime] = useState(0); 
  const ALERT_COOLDOWN_MS = 10000; // 10 seconds cooldown for DANGER alerts

  // 💡 NEW: Conditional class for borders
  const borderClass = envStatus === "Danger" 
    ? "border-red-500 ring-4 ring-red-500/50" // Danger: Red border and ring
    : envStatus === "Caution"
    ? "border-yellow-500" // Caution: Yellow border
    : "border"; // Default border

  // 💡 NEW: Function to display the DANGER evacuation alert
  const triggerDangerAlert = (survivalTime: number | null) => {
    const now = Date.now();
    if (now - lastAlertTime < ALERT_COOLDOWN_MS) {
      // Suppress alert if one was shown recently
      return;
    }

    const survivalMsg = survivalTime !== null
        ? `Estimated Time to Loss: ${survivalTime.toFixed(1)} minutes.`
        : 'Survival time is critical and unknown.';

    toast.custom((t) => (
      <div
        className={`bg-red-900 border-4 border-red-500 text-white p-4 rounded-lg shadow-2xl flex items-center gap-4 transition-all duration-300 ${
          t.visible ? 'animate-enter' : 'animate-leave'
        }`}
        style={{ animationDuration: '300ms' }} // Assuming you have Tailwind/CSS keyframes for animate-enter/leave
      >
        <AlertTriangle className="h-6 w-6 flex-shrink-0 text-red-400" />
        <div>
          <p className="font-bold text-lg">DANGER! IMMEDIATE EVACUATION REQUIRED</p>
          <p className="text-sm">{survivalMsg}</p>
        </div>
        <button 
          onClick={() => toast.dismiss(t.id)} 
          className="ml-4 text-red-300 hover:text-white font-bold"
        >
          DISMISS
        </button>
      </div>
    ), { 
      duration: 6000, // Toast lasts for 6 seconds
      position: 'top-center'
    });

    setLastAlertTime(now);
  };
  
  useEffect(() => {
    const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:4000';
    const socket: Socket = io(API_ORIGIN, { withCredentials: true });

    const initializeData = async () => {
      try {
        await nodeService.startHeatmap();

        const gasResponse = await nodeService.getGasLevel();
        setGasLevel(gasResponse as string);

        const locResponse = await nodeService.getLocation() as LocationResponse;
        if (locResponse?.loc) {
          const [lat, lng] = locResponse.loc.split(',').map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            setLocation([lat, lng]);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error initializing data:', error);
        setLoading(false);
      }
    };

    // CRITICAL: Explicitly type the incoming data
    socket.on('heatmap-data', (data: unknown) => {
      // Validate and cast
      if (Array.isArray(data)) {
        const validData = data.filter((p: any): p is HeatmapPoint =>
          typeof p?.lat === 'number' && typeof p?.lng === 'number'
        );
        setHeatmapData(validData);
      }
    });

    // 💡 NEW: Socket listener for environment status
    socket.on('env_update', (data: EnvUpdate) => {
        setEnvStatus(data.environment_status);
    });

    // 💡 NEW: Socket listener for survival prediction (triggers alert)
    socket.on('survival_update', (data: SurvivalUpdate) => {
      // Only show the alert if the status is currently Danger
      if (envStatus === "Danger") {
        triggerDangerAlert(data.survival_time);
      }
    });

    initializeData();

    return () => {
      socket.disconnect();
    };
  }, [envStatus]); // Dependency on envStatus is important for the `survival_update` logic

  if (loading) {
    return (
      // CORRECT: These classes match your theme file
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex items-center gap-2">
          {/* CHANGED: Now uses your theme variable */}
          <Loader2 className="h-6 w-6 animate-spin text-accent-green" />
          <span className="text-accent-green text-lg">Loading node data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        {/* CHANGED: Now uses your theme variable */}
        <h1 className="text-3xl font-bold text-accent-green">Node</h1>
        {/* CHANGED: Now uses your theme variable */}
        {/* 💡 NOTE: You might want to color the badge based on envStatus too */}
        <Badge variant="outline" className="text-accent-green border-accent-green">
          NODE_ALPHA-01
        </Badge>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* COLUMN 1 */}
        <div className="flex flex-col gap-6">
          {/* 💡 Applied conditional border: Command & Comms */}
          <Card className={`bg-card text-card-foreground ${borderClass}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-accent-green">
                <Terminal className="h-5 w-5" /> Command & Comms
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-0">
              {/* Note: These buttons are hard-coded and not theme-aware */}
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                TRANSMIT SOS
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                REQUEST EVAC
              </button>
            </CardContent>
          </Card>

          {/* 💡 Applied conditional border: Unit Roster */}
          <Card className={`bg-card text-card-foreground ${borderClass}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent-green">
                <Users className="h-5 w-5" /> Unit Roster
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span>Cdt. Khan (ALPHA-01)</span>
                  <Badge className="bg-green-500 text-black font-semibold">OPERATIONAL</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Cdt. Lee (BRAVO-02)</span>
                  <Badge className="bg-red-600 text-white font-semibold">DANGER</Badge>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 💡 Applied conditional border: Recent Alerts */}
          <Card className={`bg-card text-card-foreground ${borderClass} flex-1`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent-green">
                <AlertTriangle className="h-5 w-5" /> Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {/* KEPT: Using standard Tailwind yellow. You can create a '--warning' variable if you prefer */}
                <li className="text-yellow-600 dark:text-yellow-400">
                  <span className="font-bold">14:32</span> - CAUTION: Methane spike (Grid 4C)
                </li>
                {/* CHANGED: Now uses your theme variable */}
                <li className="text-danger">
                  <span className="font-bold">14:28</span> - DANGER: CO2 Levels Critical (Grid 4B)
                </li>
                {/* CORRECT: This class matches your theme file */}
                <li className="text-muted-foreground">
                  <span className="font-bold">14:25</span> - INFO: Comms re-established
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* COLUMN 2 */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* 💡 Applied conditional border: Environmental Trend (Map) */}
          <Card className={`bg-card text-card-foreground ${borderClass} lg:h-96 flex flex-col`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent-green">
                <BarChart3 className="h-5 w-5" /> Environmental Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 m-0">
              <EnvironmentalMap centerLocation={location} heatmapData={heatmapData} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 💡 Applied conditional border: Primary Visualizer */}
            <Card className={`bg-card text-card-foreground ${borderClass}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-accent-green">
                  <MapPin className="h-5 w-5" /> Primary Visualizer
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-4">
                {/* CORRECT: This class matches your theme file */}
                <p className="text-muted-foreground text-sm mb-1">Current Gas Status:</p>
                {/* CHANGED: Now uses your theme variable */}
                <h3 className="text-2xl font-bold text-accent-green text-center">
                  {gasLevel || "N/A"}
                </h3>
              </CardContent>
            </Card>

            {/* 💡 Applied conditional border: Biometric Feed (Soldier) */}
            <Card className={`bg-card text-card-foreground ${borderClass}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-accent-green">
                  <HeartPulse className="h-5 w-5" /> Biometric Feed (Soldier)
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-4">
                {/* CORRECT: This class matches your theme file */}
                <p className="text-muted-foreground">[Heart Rate / SpO2 Chart]</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* COLUMN 3 */}
        <div className="flex flex-col gap-6">
          {/* 💡 Applied conditional border: System Health */}
          <Card className={`bg-card text-card-foreground ${borderClass}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent-green">
                <Server className="h-5 w-5" /> System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span>Main CPU</span>
                  <Badge className="bg-green-500 text-black font-semibold">OPERATIONAL</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>GPS Module</span>
                  <Badge className="bg-yellow-500 text-black font-semibold">WARNING</Badge>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 💡 Applied conditional border: Compass */}
          <Card className={`bg-card text-card-foreground ${borderClass}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-accent-green">
                <CompassIcon className="h-5 w-5" /> Compass
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <Compass nodeLocation={location} heatmapData={heatmapData} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}