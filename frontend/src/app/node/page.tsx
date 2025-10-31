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
  AlertTriangle 
} from "lucide-react";

export default function NodePage() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [gasLevel, setGasLevel] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Backend origin (match node-service)
    const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:4000';

    // Connect to WebSocket
    const socket = io(API_ORIGIN, { withCredentials: true });

    // Initialize data
    const initializeData = async () => {
      try {
        console.log('[NodePage] initializing data, calling backend API...');
        // Start heatmap streaming
        await nodeService.startHeatmap();
        
        // Get initial gas level
        const gasResponse = await nodeService.getGasLevel();
        setGasLevel(gasResponse);
        
        // Get location
        const locResponse = await nodeService.getLocation();
        setLocation(locResponse.loc);
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing data:', error);
        setLoading(false);
      }
    };

    // Listen for heatmap updates
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

  // Page content wrapper.
  // The padding (p-4) is applied here, and the <header> is removed.
  return (
    <div className="text-white p-4 md:p-6">
      
      {/* Page title and badge, placed inside content area */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-400">Node</h1>
        <Badge variant="outline" className="text-green-400 border-green-400">
          NODE_ALPHA-01
        </Badge>
      </div>

      {/* Main Content Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === COLUMN 1 === */}
        <div className="flex flex-col gap-6">
          
          {/* Command & Comms Card */}
          <Card className="bg-[#1a1a1a] border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Terminal className="h-5 w-5" />
                Command & Comms
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                TRANSMIT SOS
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                REQUEST EVAC
              </button>
            </CardContent>
          </Card>

          {/* Unit Roster Card (Added flex-1 and flex-col) */}
          <Card className="bg-[#1a1a1a] border-gray-800 text-white flex-1 flex flex-col">
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
                  <span>Cdt. Singh (ALPHA-02)</span>
                  <Badge className="bg-green-500 text-black font-semibold">OPERATIONAL</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Cdt. Nillian (BRAVO-01)</span>
                  <Badge className="bg-yellow-500 text-black font-semibold">WARNING</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Cdt. Lee (BRAVO-02)</span>
                  <Badge className="bg-red-600 text-white font-semibold">DANGER</Badge>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* === COLUMN 2 === */}
        <div className="flex flex-col gap-6">
          
          {/* Environmental Trend Card (DYNAMIC) */}
          <Card className="bg-[#1a1a1a] border-gray-800 text-white lg:h-96 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <BarChart3 className="h-5 w-5" />
                Environmental Trend
              </CardTitle>
            </CardHeader>
            {/* Added flex-1 and flex-col to content for spacing */}
            <CardContent className="flex-1 flex flex-col items-center justify-center">
              <p className="text-gray-400 mb-2">Current Gas Level</p>
              <h2 className="text-4xl font-bold text-green-400 text-center">{gasLevel || "N/A"}</h2>
              {/* Added mt-auto to push placeholder to bottom */}
              <p className="text-sm text-gray-600 mt-auto pt-4">[Gas Level Chart Placeholder]</p>
            </CardContent>
          </Card>

          {/* Sub-grid for Primary Visualizer & Biometric */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            
            {/* Primary Visualizer Card (DYNAMIC) (Added flex-1 and flex-col) */}
            <Card className="bg-[#1a1a1a] border-gray-800 text-white flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <MapPin className="h-5 w-5" />
                  Primary Visualizer
                </CardTitle>
              </CardHeader>
              {/* Added flex-1 and flex-col to content for spacing */}
              <CardContent className="flex-1 flex flex-col">
                <p className="text-gray-400 mb-2">Current Coordinates:</p>
                <pre className="text-sm bg-black p-2 rounded-md overflow-x-auto">
                  {location || "No location data"}
                </pre>
                {/* Added mt-auto to push placeholder to bottom */}
                <p className="text-sm text-gray-600 mt-auto pt-4">[Mapbox / Data Feed]</p>
              </CardContent>
            </Card>

            {/* Biometric Feed Card (Added flex-1 and flex-col) */}
            <Card className="bg-[#1a1a1a] border-gray-800 text-white flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <HeartPulse className="h-5 w-5" />
                  Biometric Feed (Soldier)
                </CardTitle>
              </CardHeader>
              {/* Added flex-1 to content */}
              <CardContent className="flex-1 flex flex-col items-center justify-center">
                <p className="text-gray-600">[Heart Rate / SpO2 Chart]</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* === COLUMN 3 === */}
        <div className="flex flex-col gap-6">
          
          {/* System Health Card */}
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
                  <span>LoRa Network</span>
                  <Badge className="bg-green-500 text-black font-semibold">OPERATIONAL</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Gas Sensors (MQ)</span>
                  <Badge className="bg-green-500 text-black font-semibold">OPERATIONAL</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>GPS Module</span>
                  <Badge className="bg-yellow-500 text-black font-semibold">WARNING</Badge>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Recent Alerts Card (Added flex-1 and flex-col) */}
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

      </main>
    </div>
  );
}