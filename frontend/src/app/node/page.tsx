"use client";

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
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
  Compass
} from "lucide-react";

// ✅ 1. IMPORT YOUR MAP COMPONENT
import EnvironmentalMap from '@/components/EnvironmentalMap';

export default function NodePage() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [gasLevel, setGasLevel] = useState('');
  const [location, setLocation] = useState<[number, number]>([12.9716, 77.5946]); // default coords (Bangalore)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:4000';
    const socket = io(API_ORIGIN, { withCredentials: true });

    const initializeData = async () => {
      try {
        console.log('[NodePage] initializing data...');
        await nodeService.startHeatmap();

        const gasResponse = await nodeService.getGasLevel();
        setGasLevel(gasResponse);

        // Assuming backend returns something like { loc: { lat, lng } }
        const locResponse = await nodeService.getLocation();
        if (locResponse?.loc) {
          const [lat, lng] = locResponse.loc.split(',').map(Number);
          setLocation([lat, lng]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error initializing data:', error);
        setLoading(false);
      }
    };

    socket.on('heatmap-data', (data) => {
      setHeatmapData(data);
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
      {/* Page title and badge */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-400">Node</h1>
        <Badge variant="outline" className="text-green-400 border-green-400">
          NODE_ALPHA-01
        </Badge>
      </div>

      {/* === Main Content Grid === */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* === COLUMN 1 (Narrow) === */}
        <div className="flex flex-col gap-6">
          <Card className="bg-[#1a1a1a] border-gray-800 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Terminal className="h-5 w-5" />
                Command & Comms
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

          <Card className="bg-[#1a1a1a] border-gray-800 text-white flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Users className="h-5 w-5" />
                Unit Roster
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

          <Card className="bg-[#1a1a1a] border-gray-800 text-white flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <AlertTriangle className="h-5 w-5" />
                Recent Alerts
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

        {/* === COLUMN 2 (Wide) === */}
        <div className="flex flex-col gap-6 lg:col-span-2">

          {/* 🌍 Environmental Trend (Map Section) */}
          <Card className="bg-[#1a1a1a] border-gray-800 text-white lg:h-96 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <BarChart3 className="h-5 w-5" />
                Environmental Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 m-0">
              <EnvironmentalMap 
                centerLocation={location ? location : [12.9716, 77.5946]}
                heatmapData={heatmapData}
              />
            </CardContent>
          </Card>

          {/* Sub-grid for Visualizer & Biometric */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Gas Level Visualizer */}
            <Card className="bg-[#1a1a1a] border-gray-800 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <MapPin className="h-5 w-5" />
                  Primary Visualizer
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-4">
                <p className="text-gray-400 text-sm mb-1">Current Gas Status:</p>
                <h3 className="text-2xl font-bold text-green-400 text-center">
                  {gasLevel || "N/A"}
                </h3>
              </CardContent>
            </Card>

            {/* Biometric Feed */}
            <Card className="bg-[#1a1a1a] border-gray-800 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <HeartPulse className="h-5 w-5" />
                  Biometric Feed (Soldier)
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-4">
                <p className="text-gray-600">[Heart Rate / SpO2 Chart]</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* === COLUMN 3 (Narrow) === */}
        <div className="flex flex-col gap-6">
          <Card className="bg-[#1a1a1a] border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Server className="h-5 w-5" />
                System Health
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
                <Compass className="h-5 w-5" />
                Compass
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <p className="text-gray-600">[Compass Placeholder]</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}