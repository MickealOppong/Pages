import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// CHANGE THIS: 
// const API = axios.create({ baseURL: 'http://localhost:3000' });

