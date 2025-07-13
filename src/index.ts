import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';


// Importaciones de rutas
import usuarioRoutes from './routes/usuarioRoutes';
import juegoRoutes from './routes/juegoRoutes';
import carritoRoutes from './routes/carritoRoutes';
import noticiaRoutes from './routes/noticiaRoutes';
import listausersRoutes from './routes/listauserRoutes';
import estadisticasRoutes from './routes/estadisticasRoutes';


dotenv.config();
const app = express();
const rutaImagenes = path.join(process.cwd(), 'imagenes');


app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// ====================================================================

// Rutas de la API 
// ====================================================================
app.use('/api/usuarios', usuarioRoutes); 
app.use('/api/juegos', juegoRoutes);
app.use('/api/noticia', noticiaRoutes);
app.use('/static', express.static(rutaImagenes));
app.use('/api/carrito', carritoRoutes);
app.use('/api/admin/users', listausersRoutes); 
app.use('/api/admin', (req, res) => {
    res.status(200).json({ message: 'Ruta de administración' });
});
app.use('/api/estadisticas', estadisticasRoutes);

// Inicialización del servidor
const PORT = process.env.PORT || 3001; 
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

