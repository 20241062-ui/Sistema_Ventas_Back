import { analisisModel } from "../models/analisisModel.js";

export const getSimulacionDinamica = async (req, res) => {
    try {
        const { noSerie } = req.params;
        const datos = await analisisModel.obtenerHistorialParaCalculo(noSerie);

        if (!datos) {
            return res.status(404).json({ error: "No hay datos de ventas suficientes para este producto." });
        }

        const S_actual = datos.stock_actual;
        const S_inicial = datos.stock_inicial_estimado;
        const t = (datos.dias_venta / 7) || 1; 

        const K = Math.log(S_actual / S_inicial) / t;

        const tPedido = Math.log(10 / S_inicial) / K;
        const tAgotamiento = Math.log(1 / S_inicial) / K;

        res.json({
            nombre: datos.vchNombre,
            stockActual: S_actual,
            stockInicial: S_inicial,
            k: K.toFixed(6),
            semanasTranscurridas: t.toFixed(2),
            resultados: {
                semanasPedido: tPedido > 0 ? tPedido.toFixed(4) : "Stock ya bajo",
                semanasAgotamiento: tAgotamiento.toFixed(4)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};