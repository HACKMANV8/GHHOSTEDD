"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, AreaChart, HeartPulse, Send, Users, ShieldCheck, AlertTriangle, HardDrive, Power, Activity, Bell } from "lucide-react";

export default function NodePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* HEADER */}
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-gray-800 bg-[#0a0a0a]">
        <h1 className="text-3xl font-bold text-green-400">Node</h1>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-green-400 border-green-400">
            NODE_ALPHA-01
          </Badge>
        </div>
      </header>

      {/* GRID LAYOUT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_2.5fr_1fr] gap-4 lg:overflow-hidden w-full pb-4 md:pb-6">
        
        {/* LEFT PANEL */}
        <div className="flex flex-col gap-4 overflow-y-auto pl-4">
          <Card className="bg-[#1a1a1a] border border-gray-800">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Power className="w-5 h-5" />
                Command & Comms
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button className="bg-green-500 hover:bg-green-600 text-black font-bold">
                TRANSMIT SOS
              </Button>
              <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                REQUEST EVAC
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border border-gray-800">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Unit Roster
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {[
                ["Cdt. Khan (ALPHA-01)", "OPERATIONAL", "green"],
                ["Cdt. Singh (ALPHA-02)", "OPERATIONAL", "green"],
                ["Cdt. Nillian (BRAVO-01)", "WARNING", "yellow"],
                ["Cdt. Lee (BRAVO-02)", "DANGER", "red"],
              ].map(([name, status, color]) => (
                <div key={name} className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{name}</span>
                  <Badge
                    className={`text-black ${
                      color === "green"
                        ? "bg-green-400"
                        : color === "yellow"
                        ? "bg-yellow-400"
                        : "bg-red-500"
                    }`}
                  >
                    {status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* CENTER PANEL */}
        <div className="flex flex-col gap-4 overflow-hidden">
          {/* Environmental Trend */}
          <Card className="bg-[#1a1a1a] border border-gray-800 h-[250px]">
            <CardHeader>
              <CardTitle className="text-green-400">
                Environmental Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center text-gray-400 border border-green-800 h-full">
              [Gas Level Chart Placeholder]
            </CardContent>
          </Card>

          {/* HUGE MAP VISUALIZER */}
          <Card className="bg-[#1a1a1a] border border-gray-800 flex-grow h-[600px]">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Map className="w-5 h-5" />
                Primary Visualizer
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center text-green-700 border border-green-900 h-full">
              [Mapbox / Data Feed]
            </CardContent>
          </Card>

          {/* Biometric Feed */}
          <Card className="bg-[#1a1a1a] border border-gray-800 h-[250px]">
            <CardHeader>
              <CardTitle className="text-green-400">
                Biometric Feed (Soldier)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center text-gray-400 border border-green-800 h-full">
              [Heart Rate / SpO2 Chart]
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-4">
          <Card className="bg-[#1a1a1a] border border-gray-800">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {[
                ["Main CPU", "OPERATIONAL", "green"],
                ["LoRa Network", "OPERATIONAL", "green"],
                ["Gas Sensors (MQ)", "OPERATIONAL", "green"],
                ["GPS Module", "WARNING", "yellow"],
              ].map(([system, status, color]) => (
                <div key={system} className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{system}</span>
                  <Badge
                    className={`text-black ${
                      color === "green"
                        ? "bg-green-400"
                        : color === "yellow"
                        ? "bg-yellow-400"
                        : "bg-red-500"
                    }`}
                  >
                    {status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border border-gray-800">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              {[
                ["14:32", "CAUTION: Methane spike (Grid 4C)", "text-yellow-400"],
                ["14:28", "DANGER: CO2 Levels Critical (Grid 4B)", "text-red-400"],
                ["14:25", "INFO: Comms re-established", "text-blue-400"],
              ].map(([time, msg, color]) => (
                <div key={time} className="flex justify-between">
                  <span className="font-mono">{time}</span>
                  <span className={`${color}`}>{msg}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
