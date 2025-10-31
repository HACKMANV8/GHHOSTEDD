import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
})

export async function sendTestData(payload: Record<string, any>) {
  // Small helper used by the Node page during hackathon prototyping
  // Currently posts to /api/test - backend to be implemented later
  return api.post('/test', payload)
}

export default api
