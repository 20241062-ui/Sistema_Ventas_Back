import { analisisModel } from "../models/analisisModel.js";

export const getSimulacionStock = async (req, res) => {
    try {
        const producto = await analisisModel.obtenerDatosSimulacion('IPH15-001');
        
        if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

        const C = 15; // Stock inicial (t=0)
        const K = -0.223143; // Constante de decaimiento
        
        // Fórmulas de la Memoria de Cálculo
        const tPedido = Math.log(10 / C) / K;      // Tiempo para 10 unidades
        const tAgotamiento = Math.log(1 / C) / K;  // Tiempo para 1 unidad (agotamiento)

        res.json({
            nombre: producto.vchNombre,
            stockActual: producto.intStock,
            k: K,
            C: C,
            resultados: {
                semanasPedido: tPedido.toFixed(4),
                semanasAgotamiento: tAgotamiento.toFixed(4)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};