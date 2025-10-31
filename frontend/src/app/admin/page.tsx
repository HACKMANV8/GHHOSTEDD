"use client"; // <-- This directive marks the component as a Client Component

import React, { useState } from 'react';

/**
 * Card Component
 * A reusable, flexible-height card for holding dashboard widgets.
 * Now includes dark mode styles.
 */
const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`
      bg-white dark:bg-[#1a1a1a] 
      shadow-lg rounded-lg 
      flex flex-col h-full overflow-hidden 
      ${className}`
    }>
      {/* Card Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
      </div>
      
      {/* Card Body */}
      <div className="p-4 flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

/**
 * StatusBadge Component
 * Displays a colored badge based on the status prop.
 * Now has both light and dark mode styles.
 */
const StatusBadge = ({ status }) => {
  let colors = '';
  // Use arbitrary values for dark mode to match the user's original theme
  switch (status) {
    case 'OPERATIONAL':
      colors = 'bg-green-100 text-green-800 dark:bg-[#39ff14]/20 dark:text-[#39ff14]';
      break;
    case 'WARNING':
      colors = 'bg-yellow-100 text-yellow-800 dark:bg-[#facc15]/20 dark:text-[#facc15]';
      break;
    case 'CRITICAL':
    case 'DANGER':
      colors = 'bg-red-100 text-red-800 dark:bg-[#ef4444]/20 dark:text-[#ef4444]';
      break;
    case 'INFO':
      colors = 'bg-blue-100 text-blue-800 dark:bg-blue-400/20 dark:text-blue-400';
      break;
    default:
      colors = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${colors}`}>
      {status}
    </span>
  );
};

/**
 * Sun icon for theme toggle
 */
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

/**
 * Moon icon for theme toggle
 */
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);


/**
 * Main AdminPage Component
 * This is the main export, combining all elements into a
 * responsive, single-screen dashboard with a theme toggle.
 */
export default function AdminPage() {
  // Default to dark mode to match the "Node" theme
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Mock data for the widgets
  const devices = [
    { id: 'NODE-A1', type: 'Cadet Tracker', status: 'OPERATIONAL', metric: '98% Signal' },
    { id: 'NODE-L4', type: 'Env Sensor', status: 'WARNING', metric: 'CO2 Spike' },
    { id: 'NODE-B2', type: 'Cadet Tracker', status: 'OPERATIONAL', metric: '99% Signal' },
    { id: 'SYS-MAIN', type: 'Comms Relay', status: 'OPERATIONAL', metric: '1.2s Latency' },
  ];

  const alerts = [
    { level: 'WARNING', msg: 'Env Sensor NODE-L4 reports CO2 spike.', time: '1 min ago' },
    { level: 'CRITICAL', msg: 'Cadet C. Lee (BRAVO-02) vitals unstable.', time: '3 min ago' },
    { level: 'INFO', msg: 'Comms re-established with ALPHA team.', time: '5 min ago' },
  ];

  return (
    // Page container: Full height, flex-col layout
    // Conditionally applies the 'dark' class to the root element
    <section 
      className={`
        flex flex-col h-screen w-full 
        bg-gray-100 text-gray-900 
        dark:bg-[#121212] dark:text-gray-200
        font-sans transition-colors duration-200
        ${isDarkMode ? 'dark' : ''}`
    }>
      
      {/* Header */}
      <header className="
        bg-white dark:bg-black 
        shadow-sm dark:border-b dark:border-gray-700/50 
        p-4 flex justify-between items-center
      ">
        {/* Title matches the dark/light themes */}
        <h1 className="text-2xl font-bold text-blue-700 dark:text-[#39ff14]">
          Admin Console
        </h1>
        
        {/* Theme Toggle Button */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="
            p-2 rounded-full 
            text-gray-700 dark:text-gray-300
            hover:bg-gray-200 dark:hover:bg-gray-800
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-600
          "
          aria-label="Toggle theme"
        >
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Live Device Data */}
        <div className="md:col-span-2 lg:col-span-2">
          <Card title="Live Device Data">
            <div className="flow-root">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Device ID</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Metric</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-[#1a1a1a] divide-y divide-gray-200 dark:divide-gray-700">
                  {devices.map((device) => (
                    <tr key={device.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{device.id}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{device.type}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={device.status} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{device.metric}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Card 2: Alerts & Notifications */}
        <div className="md:col-span-1 lg:col-span-1">
          <Card title="Alerts & Notifications">
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3">
                  <StatusBadge status={alert.level} />
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{alert.msg}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Card 3: System Status */}
        <div className="md:col-span-1 lg:col-span-1">
          <Card title="System Status">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Health</div>
                <StatusBadge status="OPERATIONAL" />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Database Connection</div>
                <StatusBadge status="OPERATIONAL" />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">API Latency</div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">45ms</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Nodes</div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">4 / 4</span>
              </div>
            </div>
          </Card>
        </div>
        
      </main>
    </section>
  );
}

