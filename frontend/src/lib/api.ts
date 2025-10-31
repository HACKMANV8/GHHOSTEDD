// src/lib/api.ts
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Send cookies with every request
axios.defaults.withCredentials = true;

// ---------- NODE SERVICE (unchanged) ----------
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

// ---------- AUTH SERVICE ----------
export const authService = {
  // ── SIGNUP ──
  signup: async (email: string, password: string, name: string) => {
    const { data } = await axios.post(`${BASE_URL}/auth/register`, {
      email,
      password,
      name,
    });
    return data;
  },

  // ── LOGIN ──
  login: async (email: string, password: string) => {
    const { data } = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
    return data; // expect { token: "...", user: {...} }
  },

  // ── LOGOUT ──
  logout: async () => {
    await axios.post(`${BASE_URL}/auth/logout`);
  },

  // ── GET CURRENT USER ──
  getCurrentUser: async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/auth/me`);
      return data;
    } catch {
      return null;
    }
  },

  // ── VERIFY TOKEN (optional) ──
  verifyToken: async () => {
    try {
      await axios.get(`${BASE_URL}/auth/verify`);
      return true;
    } catch {
      return false;
    }
  },
};