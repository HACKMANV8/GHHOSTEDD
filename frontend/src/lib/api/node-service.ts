import axios from 'axios';

// Backend origin (no trailing slash). Use NEXT_PUBLIC_API_ORIGIN to override in env.
const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:4000';
const BASE_URL = `${API_ORIGIN}/api`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const nodeService = {
  // Start heatmap streaming
  startHeatmap: async () => {
    const response = await axiosInstance.get(`/heatmap`);
    return response.data;
  },

  // Get gas level
  getGasLevel: async () => {
    const response = await axiosInstance.get(`/gaslevel`);
    return response.data;
  },

  // Get location
  getLocation: async () => {
    const response = await axiosInstance.get(`/loc`);
    return response.data;
  }
};