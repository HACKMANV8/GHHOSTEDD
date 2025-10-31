// app/missions/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  LogOut,
  Plus,
} from "lucide-react";
import { authService, missionService, setAuthToken } from '@/lib/api';

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

  // ------------------------------------------------------------------
  // 1. AUTH GUARD – redirect if token missing/expired
  // ------------------------------------------------------------------
  const [checkingAuth, setCheckingAuth] = useState(true);

useEffect(() => {
  const token = localStorage.getItem('authToken');
  console.log('Token from localStorage:', token); // Debug

  if (!token) {
    router.replace('/login');
    return;
  }

  // Token exists → allow missions to load
  setCheckingAuth(false);
}, [router]);
  // ------------------------------------------------------------------
  // 2. MISSIONS STATE
  // ------------------------------------------------------------------
  const [mission, setMission] = useState<Mission | null>(null);
  const [allMissions, setAllMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'upcoming' as const,
    priority: 'medium' as const,
    location: '',
    assignedTeam: '',
    startDate: '',
    estimatedDuration: '',
  });

  // ------------------------------------------------------------------
  // 3. FETCH MISSIONS (only after auth)
  // ------------------------------------------------------------------
  useEffect(() => {
  if (checkingAuth) {
    console.log('Still checking auth...');
    return;
  }

  console.log('Fetching missions...');

 const fetchMissions = async () => {
  try {
    const data = await missionService.getMyMissions();
    console.log('Raw missions data:', data); // Debug
    setAllMissions(data || []);
    setMission(data[0] || null);
  } catch (err: any) {
    console.error('Mission fetch error:', err);
    setError(err.response?.data?.message || 'Failed to load missions');
    if (err.response?.status === 401) {
      localStorage.removeItem('authToken');
      setAuthToken(null);
      router.replace('/login');
    }
  } finally {
    setLoading(false);
  }
};

  fetchMissions();
}, [checkingAuth, router]);

  // ------------------------------------------------------------------
  // 4. CREATE MISSION
  // ------------------------------------------------------------------
  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      const newMission = await missionService.createMission(form);
      setAllMissions(prev => [newMission, ...prev]);
      setMission(newMission);
      setShowCreateModal(false);
      setForm({
        title: '', description: '', status: 'upcoming', priority: 'medium',
        location: '', assignedTeam: '', startDate: '', estimatedDuration: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create mission');
    } finally {
      setCreating(false);
    }
  };

  // ------------------------------------------------------------------
  // 5. LOGOUT
  // ------------------------------------------------------------------
  const handleLogout = async () => {
    await authService.logout();
    router.replace('/login');
  };

  // ------------------------------------------------------------------
  // 6. UI HELPERS
  // ------------------------------------------------------------------
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'active': return 'bg-green-500 text-black';
      case 'completed': return 'bg-gray-500 text-white';
      case 'upcoming': return 'bg-blue-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };
  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-red-600 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };
  const getStatusIcon = (s: string) => {
    switch (s) {
      case 'active': return <Target className="h-4 w-4" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'upcoming': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const activeCount = allMissions.filter(m => m.status === 'active').length;
  const upcomingCount = allMissions.filter(m => m.status === 'upcoming').length;
  const completedCount = allMissions.filter(m => m.status === 'completed').length;
  const highPriorityCount = allMissions.filter(m => m.priority === 'high').length;

  // ------------------------------------------------------------------
  // 7. RENDER
  // ------------------------------------------------------------------
  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
      </div>
    );
  }

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
                <p className="text-sm text-gray-400">Your active deployment</p>
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
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-900 text-red-400">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Missions</p>
                  <p className="text-2xl font-bold text-green-400">{activeCount}</p>
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
                  <p className="text-2xl font-bold text-blue-400">{upcomingCount}</p>
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
                  <p className="text-2xl font-bold text-gray-400">{completedCount}</p>
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
                  <p className="text-2xl font-bold text-red-400">{highPriorityCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission + Add Button */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Mission */}
          <div>
            <h2 className="text-xl font-semibold text-green-400 mb-4">Current Mission</h2>
            {mission ? (
              <Card 
                className="bg-[#1a1a1a] border-gray-800 hover:border-green-400 transition-all cursor-pointer"
                onClick={() => {
                  localStorage.setItem('currentMission', JSON.stringify(mission));
                  router.push('/home');
                }}
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
            ) : (
              <div className="text-center py-12 text-gray-500 bg-[#1a1a1a] rounded-lg border border-dashed border-gray-700">
                No active mission. Create one to begin.
              </div>
            )}
          </div>

          {/* Add Mission */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowCreateModal(true)}
              className="group flex flex-col items-center justify-center w-48 h-48 bg-[#1a1a1a] border-2 border-dashed border-gray-600 rounded-xl hover:border-green-400 hover:bg-[#0f1a0f] transition-all"
            >
              <Plus className="h-16 w-16 text-gray-500 group-hover:text-green-400 transition-colors" />
              <span className="mt-3 text-lg font-semibold text-gray-400 group-hover:text-green-400">
                Add Mission
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* Create Mission Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Target className="h-6 w-6" />
                Create New Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateMission} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                      className="bg-[#0a0a0a] border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as any })}>
                      <SelectTrigger className="bg-[#0a0a0a] border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                    rows={3}
                    className="bg-[#0a0a0a] border-gray-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      required
                      className="bg-[#0a0a0a] border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedTeam">Assigned Team</Label>
                    <Input
                      id="assignedTeam"
                      value={form.assignedTeam}
                      onChange={(e) => setForm({ ...form, assignedTeam: e.target.value })}
                      required
                      className="bg-[#0a0a0a] border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      required
                      className="bg-[#0a0a0a] border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                    <Input
                      id="estimatedDuration"
                      value={form.estimatedDuration}
                      onChange={(e) => setForm({ ...form, estimatedDuration: e.target.value })}
                      required
                      placeholder="e.g., 6 hours"
                      className="bg-[#0a0a0a] border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={creating}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Mission'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}