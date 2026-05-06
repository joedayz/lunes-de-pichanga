/**
 * Punto de entrada mínimo del API (Express).
 * Puerto por defecto 4000 para no chocar con la plataforma `agentes` (3000).
 */
import cors from 'cors';
import express from 'express';
import router from './api/routes/una-aplicacin-web.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
