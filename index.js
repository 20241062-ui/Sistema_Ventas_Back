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

app.get('/api/prueba-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS resultado');
        res.json({ 
            estado: "Conexión Exitosa", 
            db: rows[0].resultado === 2 ? "Base de datos respondiendo" : "Error inesperado" 
        });
    } catch (error) {
        res.status(500).json({ 
            estado: "Error de Conexión", 
            detalle: error.message 
        });
    }
});

export default app;