import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:4000';

export default defineConfig({
  plugins: [react()],
  root: '.',
  server: { port: 5173 },
  define: {
    // El componente generado usa CRA-style; compat sin reescribir el archivo del agente.
    'process.env.REACT_APP_API_URL': JSON.stringify(apiUrl),
  },
});
