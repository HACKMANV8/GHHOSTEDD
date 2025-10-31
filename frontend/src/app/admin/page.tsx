"use client";

import React from "react";

/* -------------------------------------------------
   Minimal Card – No borders, no shadow, full height
   ------------------------------------------------- */
const Card = ({ children, className = "" }) => (
  <div className={`h-full ${className}`}>
    <div className="h-full overflow-y-auto">{children}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  let colors = "";
  switch (status) {
    case "OPERATIONAL":
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
      colors = "bg-blue-400/20 text-blue-400";
      break;
    default:
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
   Main AdminPage – Fullscreen, No Header, No Borders
   ------------------------------------------------- */
export default function AdminPage() {
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

  return (
    <div className="flex flex-col h-screen w-full bg-[#121212] text-gray-200 font-sans">
      {/* No Header */}

      {/* Fullscreen Grid: Left = Mission, Right = System */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        
        {/* LEFT: Mission Details – Full Height */}
        <div className="lg:col-span-1 p-6 overflow-y-auto">
          <div className="space-y-5 text-sm">
            <h2 className="text-lg font-semibold text-[#39ff14] mb-4">Mission Details</h2>
            <p><span className="font-medium text-gray-400">Mission:</span> Operation Nightfall</p>
            <p><span className="font-medium text-gray-400">Start:</span> 2025-11-01 03:00</p>
            <p><span className="font-medium text-gray-400">End (est.):</span> 2025-11-01 09:00</p>
            <p><span className="font-medium text-gray-400">Objective:</span> Secure perimeter and extract VIP.</p>
            <p><span className="font-medium text-gray-400">Teams:</span> ALPHA, BRAVO</p>
          </div>
        </div>

        {/* RIGHT: System Overview – Full Height */}
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

            {/* System Status – Full width below */}
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