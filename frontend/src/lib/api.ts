import axios from 'axios';

// ---------------------------------------------------------------
// 1. BASE URL
// ---------------------------------------------------------------
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ---------------------------------------------------------------
// 2. AXIOS CONFIG
// ---------------------------------------------------------------
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// ---------------------------------------------------------------
// 3. TOKEN MANAGEMENT
// ---------------------------------------------------------------
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Restore token on app load
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('authToken');
  if (saved) setAuthToken(saved);
}

// ---------------------------------------------------------------
// 4. INTERFACES
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

const mapToFrontend = (m: MissionBackend): MissionFrontend => {
  const createdAtDate = new Date(m.createdAt);
  const startDate = isNaN(createdAtDate.getTime()) 
    ? new Date().toISOString().split('T')[0]  // fallback
    : createdAtDate.toISOString().split('T')[0];

  return {
    id: m._id,
    title: m.name,
    description: m.description || '',
    status: 'upcoming' as const,
    priority: 'medium' as const,
    location: m.location || '',
    assignedTeam: m.nodes.join(', '),
    startDate,
    estimatedDuration: 'N/A',
  };
};

// ---------------------------------------------------------------
// 5. AUTH SERVICE – WITH signup RESTORED
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

    if (data.token) {
      setAuthToken(data.token);
      localStorage.setItem('authToken', data.token);
    }

    return data;
  },

  logout: async () => {
    try {
      await axios.post(`${BASE_URL}/auth/logout`);
    } catch (err) {
      console.warn('Logout failed on backend');
    }
    setAuthToken(null);
    localStorage.removeItem('authToken');
  },
};

// ---------------------------------------------------------------
// 6. MISSION SERVICE
// ---------------------------------------------------------------
export const missionService = {
  getMyMissions: async (): Promise<MissionFrontend[]> => {
  try {
    const { data } = await axios.get<any>(`${BASE_URL}/missions`);
    console.log('Raw /missions response:', data);

    const missions = Array.isArray(data) ? data : data.missions || [];
    return missions.map(mapToFrontend);
  } catch (err: any) {
    console.error('getMyMissions error:', err.response?.data || err.message);
    throw err;
  }
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

  // 💡 NEW: Function to delete a mission by ID
  deleteMission: async (id: string) => {
    // This sends a DELETE request to /api/missions/:id
    await axios.delete(`${BASE_URL}/missions/${id}`);
    // No data is returned, status 204 or 200 is expected for success
  },
};

// ---------------------------------------------------------------
// 7. NODE SERVICE (optional)
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
