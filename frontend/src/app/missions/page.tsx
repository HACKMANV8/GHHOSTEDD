"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Target,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Shield,
  LogOut
} from "lucide-react";
import { authService } from '@/lib/api';

interface Mission {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'upcoming';
  priority: 'high' | 'medium' | 'low';
  location: string;
  assignedTeam: string;
  startDate: string;
  estimatedDuration: string;
}

export default function MissionsPage() {
  const router = useRouter();
  const [missions] = useState<Mission[]>([
    {
      id: "ALPHA-001",
      title: "Tactical Reconnaissance Mission",
      description: "Conduct surveillance and gather intelligence on hostile territory sector 7-B",
      status: "active",
      priority: "high",
      location: "Sector 7-B, Grid 42N",
      assignedTeam: "Alpha Squad",
      startDate: "2025-11-01",
      estimatedDuration: "6 hours"
    },
    {
      id: "BRAVO-002",
      title: "Equipment Recovery Operation",
      description: "Retrieve critical communication equipment from abandoned outpost",
      status: "active",
      priority: "medium",
      location: "Outpost Delta-9",
      assignedTeam: "Bravo Team",
      startDate: "2025-11-02",
      estimatedDuration: "4 hours"
    },
    {
      id: "CHARLIE-003",
      title: "Perimeter Security Sweep",
      description: "Routine security patrol and threat assessment of designated zone",
      status: "upcoming",
      priority: "low",
      location: "Zone 3, Perimeter Echo",
      assignedTeam: "Charlie Unit",
      startDate: "2025-11-03",
      estimatedDuration: "8 hours"
    },
    {
      id: "DELTA-004",
      title: "Emergency Medical Evacuation",
      description: "Extract injured personnel from hot zone with air support",
      status: "completed",
      priority: "high",
      location: "Hot Zone Alpha",
      assignedTeam: "Delta Force",
      startDate: "2025-10-30",
      estimatedDuration: "2 hours"
    },
  ]);
  
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missionId, setMissionId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showIdModal, setShowIdModal] = useState(false);

  const handleMissionClick = (mission: Mission) => {
    setSelectedMission(mission);
    setShowIdModal(true);
    setError('');
    setMissionId('');
  };

  const handleEnterMission = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate mission ID
    if (missionId.trim().toUpperCase() !== selectedMission?.id) {
      setError('Invalid Mission ID. Please check and try again.');
      setLoading(false);
      return;
    }

    // Store mission in localStorage
    localStorage.setItem('currentMission', JSON.stringify(selectedMission));
    
    // Redirect to home page
    setTimeout(() => {
      router.push('/home');
    }, 500);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-black';
      case 'completed': return 'bg-gray-500 text-white';
      case 'upcoming': return 'bg-blue-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Target className="h-4 w-4" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'upcoming': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-400" />
              <div>
                <h1 className="text-2xl font-bold text-green-400">Mission Control</h1>
                <p className="text-sm text-gray-400">Select your active deployment</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Missions</p>
                  <p className="text-2xl font-bold text-green-400">
                    {missions.filter(m => m.status === 'active').length}
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {missions.filter(m => m.status === 'upcoming').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-gray-400">
                    {missions.filter(m => m.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">High Priority</p>
                  <p className="text-2xl font-bold text-red-400">
                    {missions.filter(m => m.priority === 'high').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => (
            <Card
              key={mission.id}
              className="bg-[#1a1a1a] border-gray-800 hover:border-green-400 transition-all cursor-pointer transform hover:scale-105"
              onClick={() => handleMissionClick(mission)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getStatusColor(mission.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(mission.status)}
                      {mission.status.toUpperCase()}
                    </span>
                  </Badge>
                  <Badge className={getPriorityColor(mission.priority)}>
                    {mission.priority.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-green-400 text-lg">{mission.title}</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Mission ID: {mission.id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">{mission.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{mission.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{mission.assignedTeam}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{mission.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{mission.estimatedDuration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Mission ID Modal */}
      {showIdModal && selectedMission && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Target className="h-6 w-6" />
                Enter Mission
              </CardTitle>
              <CardDescription className="text-gray-400">
                {selectedMission.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEnterMission} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-400">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="bg-[#0a0a0a] p-4 rounded-lg border border-gray-800">
                  <p className="text-sm text-gray-400 mb-2">Mission Details:</p>
                  <p className="text-white font-semibold">{selectedMission.title}</p>
                  <p className="text-gray-400 text-sm">Location: {selectedMission.location}</p>
                  <p className="text-gray-400 text-sm">Team: {selectedMission.assignedTeam}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="missionId" className="text-gray-300">
                    Enter Mission ID to Confirm
                  </Label>
                  <Input
                    id="missionId"
                    name="missionId"
                    type="text"
                    placeholder="e.g., ALPHA-001"
                    value={missionId}
                    onChange={(e) => setMissionId(e.target.value)}
                    required
                    className="bg-[#0a0a0a] border-gray-700 text-white placeholder:text-gray-500 focus:border-green-400 uppercase"
                  />
                  <p className="text-xs text-gray-500">
                    Hint: Mission ID is displayed on the mission card
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowIdModal(false);
                      setSelectedMission(null);
                      setMissionId('');
                      setError('');
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Entering...
                      </>
                    ) : (
                      'Enter Mission'
                    )}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}