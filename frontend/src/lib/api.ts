// src/lib/api.ts
import axios from 'axios';

// ---------------------------------------------------------------
// 1. BASE URL
// ---------------------------------------------------------------
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ---------------------------------------------------------------
// 2. AXIOS CONFIG
// ---------------------------------------------------------------
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

if (process.env.NODE_ENV === 'development') {
  axios.interceptors.request.use((config) => {
    console.log('[API]', config.method?.toUpperCase(), config.url);
    return config;
  });
}

// ---------------------------------------------------------------
// 3. NODE SERVICE
// ---------------------------------------------------------------
export const nodeService = {
  startHeatmap: async () => {
    const { data } = await axios.get(`${BASE_URL}/heatmap`);
    return data;
  },
  getGasLevel: async () => {
    const { data } = await axios.get(`${BASE_URL}/gaslevel`);
    return data;
  },
  getLocation: async () => {
    const { data } = await axios.get(`${BASE_URL}/loc`);
    return data;
  },
};

// ---------------------------------------------------------------
// 4. AUTH SERVICE – FULLY RESTORED
// ---------------------------------------------------------------
export const authService = {
  signup: async (email: string, password: string, name: string) => {
    const { data } = await axios.post(`${BASE_URL}/auth/register`, {
      email,
      password,
      name,
    });
    return data;
  },

  login: async (username: string, password: string) => {
    const { data } = await axios.post(`${BASE_URL}/auth/login`, {
      username,
      password,
    });
    return data;
  },

  logout: async () => {
    await axios.post(`${BASE_URL}/auth/logout`);
  },

  getCurrentUser: async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/auth/me`);
      return data;
    } catch {
      return null;
    }
  },

  verifyToken: async () => {
    try {
      await axios.get(`${BASE_URL}/auth/verify`);
      return true;
    } catch {
      return false;
    }
  },
};

// ---------------------------------------------------------------
// 5. MISSION SERVICE – MATCHES MONGOOSE SCHEMA
// ---------------------------------------------------------------
export interface MissionBackend {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  nodes: string[];
  createdBy: string;
  createdAt: string;
}

export interface MissionFrontend {
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

// Map backend → frontend
const mapToFrontend = (m: MissionBackend): MissionFrontend => ({
  id: m._id,
  title: m.name,
  description: m.description || '',
  status: 'upcoming' as const,
  priority: 'medium' as const,
  location: m.location || '',
  assignedTeam: m.nodes.join(', '),
  startDate: new Date(m.createdAt).toISOString().split('T')[0],
  estimatedDuration: 'N/A',
});

export const missionService = {
  getMyMissions: async (): Promise<MissionFrontend[]> => {
    const { data } = await axios.get<MissionBackend[]>(`${BASE_URL}/missions`);
    return data.map(mapToFrontend);
  },

  createMission: async (mission: {
    title: string;
    description?: string;
    location?: string;
    assignedTeam: string;
    startDate: string;
    estimatedDuration: string;
  }) => {
    const payload = {
      name: mission.title,
      description: mission.description,
      location: mission.location,
      nodes: mission.assignedTeam.split(',').map(s => s.trim()).filter(Boolean),
    };

    const { data } = await axios.post<MissionBackend>(`${BASE_URL}/missions`, payload);
    return mapToFrontend(data);
  },
};