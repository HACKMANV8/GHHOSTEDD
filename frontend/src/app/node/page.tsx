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

/* -------------------------------------------------------------------------- */
/*                              DATA TYPES                                    */
/* -------------------------------------------------------------------------- */
interface HeatmapPoint {
  lat: number;
  lng: number;
  value?: number;
}

interface LocationResponse {
  loc?: string; // "12.9716,77.5946"
}

/* -------------------------------------------------------------------------- */
/*                              COMPASS COMPONENT                             */
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
        <div className="absolute inset-0 rounded-full border-4 border-green-400/30" />

        {["N", "E", "S", "W"].map((dir, i) => (
          <span
            key={dir}
            className="absolute text-green-400 text-xs font-bold"
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
          <div className="w-1 h-12 bg-green-400 rounded-t-full shadow-lg" />
          <div className="w-1 h-12 bg-red-600 rounded-b-full -mt-12 shadow-lg" />
        </div>

        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-green-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md" />
      </div>

      <div className="mt-3 text-green-400 font-mono text-sm">{bearing.toFixed(0)}°</div>
      <div className="text-xs text-gray-500 mt-1">Nearest hotspot</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN PAGE                                    */
/* -------------------------------------------------------------------------- */
export default function NodePage() {
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [gasLevel, setGasLevel] = useState<string>('');
  const [location, setLocation] = useState<[number, number]>([12.9716, 77.5946]);
  const [loading, setLoading] = useState(true);

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

    initializeData();

    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-green-400" />
          <span className="text-green-400 text-lg">Loading node data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-400">Node</h1>
        <Badge variant="outline" className="text-green-400 border-green-400">
          NODE_ALPHA-01
        </Badge>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* COLUMN 1 */}
        <div className="flex flex-col gap-6">
          <Card className="bg-[#1a1a1a] border-gray-800 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Terminal className="h-5 w-5" /> Command & Comms
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-0">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                TRANSMIT SOS
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                REQUEST EVAC
              </button>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
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

          <Card className="bg-[#1a1a1a] border-gray-800 text-white flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <AlertTriangle className="h-5 w-5" /> Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="text-yellow-400">
                  <span className="font-bold">14:32</span> - CAUTION: Methane spike (Grid 4C)
                </li>
                <li className="text-red-500">
                  <span className="font-bold">14:28</span> - DANGER: CO2 Levels Critical (Grid 4B)
                </li>
                <li className="text-gray-400">
                  <span className="font-bold">14:25</span> - INFO: Comms re-established
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* COLUMN 2 */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="bg-[#1a1a1a] border-gray-800 text-white lg:h-96 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <BarChart3 className="h-5 w-5" /> Environmental Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 m-0">
              <EnvironmentalMap centerLocation={location} heatmapData={heatmapData} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#1a1a1a] border-gray-800 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <MapPin className="h-5 w-5" /> Primary Visualizer
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-4">
                <p className="text-gray-400 text-sm mb-1">Current Gas Status:</p>
                <h3 className="text-2xl font-bold text-green-400 text-center">
                  {gasLevel || "N/A"}
                </h3>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <HeartPulse className="h-5 w-5" /> Biometric Feed (Soldier)
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-4">
                <p className="text-gray-600">[Heart Rate / SpO2 Chart]</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* COLUMN 3 */}
        <div className="flex flex-col gap-6">
          <Card className="bg-[#1a1a1a] border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
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

          <Card className="bg-[#1a1a1a] border-gray-800 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-400">
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