import db from '../config/BD.js';

export const pedidoModel = {
    crear: async (intid_Cliente, floTotal, items) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [pedido] = await conn.query(
                "INSERT INTO tblpedido (intid_Cliente, floTotal) VALUES (?, ?)",
                [intid_Cliente, floTotal]
            );
            const pedidoId = pedido.insertId;

            for (const item of items) {
                await conn.query(
                    "INSERT INTO tbldetalle_pedido (intid_Pedido, vchNo_Serie, intCantidad, floPrecioVenta) VALUES (?, ?, ?, ?)",
                    [pedidoId, item.id, item.cantidad, item.precio]
                );
            }

            await conn.commit();
            return pedidoId;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
};