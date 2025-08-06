import axios from 'axios'

// API サーバのポートに合わせて
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? 'http://localhost:8787/api/posts',
  headers: { 'Content-Type': 'application/json' },
})
