'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [currentMission, setCurrentMission] = useState<any>(null);

  useEffect(() => {
    // Get the selected mission from localStorage
    const missionData = localStorage.getItem('currentMission');
    if (missionData) {
      try {
        const mission = JSON.parse(missionData);
        setCurrentMission(mission);
        console.log('Current Mission:', mission);
      } catch (error) {
        console.error('Failed to parse mission data:', error);
      }
    }
  }, []);

  return (
    <section className="container mx-auto">
      <div className="grid grid-cols-1 gap-8">
        {/* Active Mission Display */}
        {currentMission && (
          <div className="mb-4 p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg">
            <h2 className="text-green-400 font-bold">Active Mission: {currentMission.title}</h2>
            <p className="text-gray-400 text-sm">Mission ID: {currentMission.id}</p>
            <p className="text-gray-400 text-sm">Location: {currentMission.location}</p>
          </div>
        )}

        {/* Original Hero Panel */}
        <div className="military-panel p-8">
          <h1 className="text-3xl font-bold text-[color:var(--accent-green)]">
            Naakshatra: Intelligent Life-Saving Detection System
          </h1>
          <p className="mt-3 text-[color:var(--text-secondary)] max-w-2xl">
            Minimal, performant dashboard starter for rapid hackathon development.
          </p>
          <div className="mt-6">
            <Link href="/admin" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}