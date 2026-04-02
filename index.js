import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import db from './src/config/BD.js';
import authRoutes from './src/routes/authRoutes.js';
import publicRoutes from './src/routes/publicRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import ventaRoutes from './src/routes/ventaRoutes.js';
import comprasRoutes from './src/routes/comprasRoutes.js';
import productoRoutes from './src/routes/productoRoutes.js';
import proveedoresRoutes from './src/routes/proveedoresRoutes.js';
import sucursalRoutes from './src/routes/sucursalRoutes.js';
import informacionRoutes from './src/routes/informacionRoutes.js';
import clienteRoutes from './src/routes/clienteRoutes.js';
import faqRoutes from './src/routes/faqRoutes.js';
import contactoRoutes from './src/routes/contactoRoutes.js';
import usuarioRoutes from './src/routes/adminusuarioRoutes.js';
import analisisRoutes from './src/routes/analisisRoutes.js';
import carritoRoutes from './src/routes/carritoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';

const app = express();

const corsOptions = {
    origin: ['https://20241062-ui.github.io', 'http://localhost:3000'], 
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensaje: "API de Sistema de Ventas funcionando correctamente" });
});

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/sucursales', sucursalRoutes);
app.use('/api/informacion', informacionRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/analisis', analisisRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/usuarios', usuarioRoutes);

export default app;