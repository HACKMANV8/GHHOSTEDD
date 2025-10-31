import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const nodeService = {
  // Start heatmap streaming
  startHeatmap: async () => {
    const response = await axios.get(`${BASE_URL}/heatmap`);
    return response.data;
  },

  // Get gas level
  getGasLevel: async () => {
    const response = await axios.get(`${BASE_URL}/gaslevel`);
    return response.data;
  },

  // Get location
  getLocation: async () => {
    const response = await axios.get(`${BASE_URL}/loc`);
    return response.data;
  }
};