import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import usuarioRoutes from './routes/usuarioRoutes';
import juegoRoutes from './routes/juegoRoutes';
import carritoRoutes from './routes/carritoRoutes';
import noticiaRoutes from './routes/noticiaRoutes';
import listauserRoutes from './routes/listauserRoutes';

dotenv.config();

const app = express();
const rutaImagenes = path.join(process.cwd(), 'imagenes');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use((req: any, res, next) => {
  // SIMULA ROL DE ADMIN - Lo agregue en la BD para que funcione
  req.user = { id: 3, rol: 'ADMIN' }; 
  next();
});

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/juegos', juegoRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/noticia', noticiaRoutes);
app.use('/api/listauser', listauserRoutes);
app.use('/static', express.static(rutaImagenes));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});