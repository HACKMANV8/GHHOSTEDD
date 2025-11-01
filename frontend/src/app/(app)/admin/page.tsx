"use client";

// Import React hooks, router, and API services
import React, { useState, useEffect } from "react";
import { io, Socket } from 'socket.io-client'; // Added for node data
// We will use 'window.location.href' for redirection
import { missionService, nodeService, MissionFrontend, setAuthToken } from '@/lib/api'; // Added nodeService, reverted to alias
import { Loader2 } from "lucide-react";
import EnvironmentalMap from '@/components/EnvironmentalMap'; // Added Map component

/* -------------------------------------------------
  TypeScript Interfaces
------------------------------------------------- */
interface Mission extends MissionFrontend {}

// Added from node/page.tsx
interface HeatmapPoint {
  lat: number;
  lng: number;
  value?: number;
}

// Added from node/page.tsx
interface LocationResponse {
  loc?: string; // "12.9716,77.5946"
}

/* -------------------------------------------------
  Re-usable components from your original file
------------------------------------------------- */
const StatusBadge = ({ status }: { status: string }) => {
  let colors = "";
  switch (status.toUpperCase()) { // Use toUpperCase() for safety
    case "OPERATIONAL":
    case "ACTIVE": // Added 'active' from your mission page
      colors = "bg-[#39ff14]/20 text-[#39ff14]";
      break;
    case "WARNING":
      colors = "bg-[#facc15]/20 text-[#facc15]";
      break;
    case "CRITICAL":
    case "DANGER":
      colors = "bg-[#ef4444]/20 text-[#ef4444]";
      break;
    case "INFO":
    case "UPCOMING": // Added 'upcoming' from your mission page
      colors = "bg-blue-400/20 text-blue-400";
      break;
    default: // 'completed' etc.
      colors = "bg-gray-700 text-gray-300";
  }
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${colors}`}
    >
      {status}
    </span>
  );
};

/* -------------------------------------------------
  Main AdminPage - Now with data fetching
------------------------------------------------- */
export default function AdminPage() {
  
  // ------------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // ------------------------------------------------------------------
  // -- Auth State
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // -- Mission State
  const [missionLoading, setMissionLoading] = useState(true); // Renamed from 'loading'
  const [error, setError] = useState('');
  const [allMissions, setAllMissions] = useState<Mission[]>([]);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);

  // -- Node/Map State (Added from node/page.tsx)
  const [nodeLoading, setNodeLoading] = useState(true); // Separate loading for node data
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [location, setLocation] = useState<[number, number]>([12.9716, 77.5946]); // Default location

  // ------------------------------------------------------------------
  // 2. AUTH GUARD (from missions/page.tsx)
  // ------------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    // Token exists, proceed to fetch data
    setCheckingAuth(false);
  }, []);

  // ------------------------------------------------------------------
  // 3. FETCH MISSIONS (from missions/page.tsx)
  // ------------------------------------------------------------------
  useEffect(() => {
    // Only run if auth check has passed
    if (checkingAuth) {
      return;
    }

    const fetchMissions = async () => {
      try {
        const data = await missionService.getMyMissions();
        setAllMissions(data || []);
        // Set the first mission as the "current" one for display
        setCurrentMission(data[0] || null); 
      } catch (err: any) {
        console.error('Mission fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load missions');
        // If token is expired or invalid, boot to login
        if (err.response?.status === 401) {
          localStorage.removeItem('authToken');
          setAuthToken(null);
          window.location.href = '/login';
        }
      } finally {
        setMissionLoading(false); // Use mission-specific loading state
      }
    };

    fetchMissions();
  }, [checkingAuth]);


  // ------------------------------------------------------------------
  // 4. FETCH NODE/MAP DATA (Added from node/page.tsx)
  // ------------------------------------------------------------------
  useEffect(() => {
    // Only run if auth check has passed
    if (checkingAuth) {
      return;
    }

    const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:4000';
    const socket: Socket = io(API_ORIGIN, { withCredentials: true });

    const initializeData = async () => {
      try {
        // We don't need gas level, but we need location and heatmap
        await nodeService.startHeatmap();
        
        const locResponse = await nodeService.getLocation() as LocationResponse;
        if (locResponse?.loc) {
          const [lat, lng] = locResponse.loc.split(',').map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            setLocation([lat, lng]);
          }
        }
      } catch (error) {
        console.error('Error initializing node data:', error);
        // Don't set global error, just log it
      } finally {
        setNodeLoading(false); // Use node-specific loading state
      }
    };

    // Listen for heatmap data
    socket.on('heatmap-data', (data: unknown) => {
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
  }, [checkingAuth]); // Run once after auth check


  // ------------------------------------------------------------------
  // 5. STATIC DATA (from your original admin page)
  // ------------------------------------------------------------------
  const devices = [
    { id: "NODE-A1", type: "Cadet Tracker", status: "OPERATIONAL", metric: "98% Signal" },
    { id: "NODE-L4", type: "Env Sensor", status: "WARNING", metric: "CO2 Spike" },
    { id: "NODE-B2", type: "Cadet Tracker", status: "OPERATIONAL", metric: "99% Signal" },
    { id: "SYS-MAIN", type: "Comms Relay", status: "OPERATIONAL", metric: "1.2s Latency" },
  ];

  const alerts = [
    { level: "WARNING", msg: "Env Sensor NODE-L4 reports CO2 spike.", time: "1 min ago" },
    { level: "CRITICAL", msg: "Cadet C. Lee (BRAVO-02) vitals unstable.", time: "3 min ago" },
    { level: "INFO", msg: "Comms re-established with ALPHA team.", time: "5 min ago" },
  ];

  // ------------------------------------------------------------------
  // 6. RENDER LOGIC
  // ------------------------------------------------------------------

  // Show main loader while checking auth or fetching *any* initial data
  if (checkingAuth || missionLoading || nodeLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#121212]">
        <Loader2 className="h-10 w-10 animate-spin text-[#39ff14]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#121212] text-gray-200 font-sans">
      
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-900/50 text-red-300 text-center font-medium">
          {error}
        </div>
      )}

      {/* Fullscreen Grid: Left = Mission, Right = System */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        
        {/* LEFT: Dynamic Mission Details + Map */}
        <div className="lg:col-span-1 p-6 overflow-y-auto">
          
          {/* --- Mission Details Section --- */}
          <div className="space-y-5 text-sm">
            <h2 className="text-lg font-semibold text-[#39ff14] mb-4">Mission Details</h2>
            
            {/* DYNAMIC CONTENT */}
            {currentMission ? (
              <>
                <p><span className="font-medium text-gray-400">Mission:</span> {currentMission.title}</p>
                <p><span className="font-medium text-gray-400">Status:</span> <StatusBadge status={currentMission.status} /></p>
                <p><span className="font-medium text-gray-400">Start:</span> {currentMission.startDate}</p>
                <p><span className="font-medium text-gray-400">Duration (est.):</span> {currentMission.estimatedDuration}</p>
                <p><span className="font-medium text-gray-400">Objective:</span> {currentMission.description || 'N/A'}</p>
                <p><span className="font-medium text-gray-400">Teams:</span> {currentMission.assignedTeam || 'N/A'}</p>
                <p><span className="font-medium text-gray-400">Location:</span> {currentMission.location || 'N/A'}</p>
              </>
            ) : (
              <p className="text-gray-500">No active mission data found.</p>
            )}
            {/* END DYNAMIC CONTENT */}
          </div>

          {/* --- NEW MAP SECTION --- */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[#39ff14] mb-4">Live Environmental Map</h2>
            <div className="h-80 w-full bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-700">
              <EnvironmentalMap centerLocation={location} heatmapData={heatmapData} />
            </div>
          </div>
          {/* --- END NEW MAP SECTION --- */}

        </div>

        {/* RIGHT: System Overview (Still Static) */}
        {/* This data doesn't come from /missions, so we leave it as-is */}
        <div className="lg:col-span-2 p-6 overflow-y-auto bg-[#1a1a1a]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">

            {/* Live Device Data */}
            <section>
              <h3 className="text-base font-semibold text-gray-200 mb-3">Live Device Data</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase border-b border-gray-700">
                      <th className="py-2 text-left">ID</th>
                      <th className="py-2 text-left">Type</th>
                      <th className="py-2 text-left">Status</th>
                      <th className="py-2 text-left">Metric</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {devices.map((d) => (
                      <tr key={d.id}>
                        <td className="py-2 font-medium text-white">{d.id}</td>
                        <td className="py-2 text-gray-400">{d.type}</td>
                        <td className="py-2"><StatusBadge status={d.status} /></td>
                        <td className="py-2 text-gray-400">{d.metric}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Alerts */}
            <section>
              <h3 className="text-base font-semibold text-gray-200 mb-3">Alerts &amp; Notifications</h3>
              <div className="space-y-3">
                {alerts.map((a, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <StatusBadge status={a.level} />
                    <div>
                      <p className="text-sm text-gray-200">{a.msg}</p>
                      <p className="text-xs text-gray-500">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* System Status */}
            <section className="md:col-span-2 mt-6">
              <h3 className="text-base font-semibold text-gray-200 mb-3">System Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Overall Health</span>
                  <StatusBadge status="OPERATIONAL" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Database</span>
                  <StatusBadge status="OPERATIONAL" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">API Latency</span>
                  <span className="text-sm font-semibold text-white">45ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Active Nodes</span>
                  <span className="text-sm font-semibold text-white">4 / 4</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}