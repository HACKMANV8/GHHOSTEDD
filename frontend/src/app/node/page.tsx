"use client";

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { nodeService } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, AlertTriangle, Activity, Loader2 } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold text-green-400">Node</h1>
        <Badge variant="outline" className="text-green-400 border-green-400">
          NODE_ALPHA-01
        </Badge>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <Card className="bg-[#1a1a1a] border border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Heatmap Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            {heatmapData.length > 0 ? (
              <pre>{JSON.stringify(heatmapData, null, 2)}</pre>
            ) : (
              <p>No heatmap data available</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Gas Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{gasLevel}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{location}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}