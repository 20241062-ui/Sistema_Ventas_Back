import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Carga de variables de entorno al inicio
dotenv.config();

// Importación de configuración de DB y Rutas
import db from './src/config/BD.js';
import authRoutes from './src/routes/authRoutes.js';
import publicRoutes from './src/routes/publicRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import ventaRoutes from './src/routes/ventaRoutes.js';
import comprasRoutes from './src/routes/comprasRoutes.js';
import productoRoutes from './src/routes/productoRoutes.js';

const app = express();

// 1. JERARQUÍA DE SEGURIDAD (CORS)
const corsOptions = {
    origin: ['https://20241062-ui.github.io', 'http://localhost:3000'], // Añadido localhost para tus pruebas locales
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Manejo de pre-flight requests

// 2. JERARQUÍA DE PARSEO
app.use(express.json());

// 3. RUTAS RAÍZ / SALUD DEL SERVIDOR
app.get('/', (req, res) => {
    res.json({ mensaje: "API de Sistema de Ventas funcionando correctamente" });
});

// 4. JERARQUÍA DE RUTAS DE LA API
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/productos', productoRoutes);

// 5. PRUEBA DE CONEXIÓN (Mantenida para diagnóstico)
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

// Para despliegue en Vercel
export default app;