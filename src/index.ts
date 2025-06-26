import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usuarioRoutes from './codigos/routes/usuarioRoutes';
import juegoRoutes from './codigos/routes/juegoRoutes';
import path from 'path';

dotenv.config();

const app = express();
const rutaImagenes = path.join(process.cwd(), 'imagenes');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/juegos', juegoRoutes);
app.use('/static', express.static(rutaImagenes));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
