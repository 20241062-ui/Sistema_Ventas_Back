import db from '../config/BD.js';

const Carrito = {
    obtenerPorUsuario: async (id_cliente) => {
        const sql = `
            SELECT c.intid_Carrito, c.vchNo_Serie, c.intCantidad, 
                    p.vchNombre, p.floPrecioUnitario, p.vchImagen
            FROM tblcarrito c
            INNER JOIN tblproductos p ON c.vchNo_Serie = p.vchNo_Serie
            WHERE c.id_Cliente = ?`;
        const [rows] = await db.query(sql, [id_cliente]);
        return rows;
    },

    agregar: async (id_cliente, vchNo_Serie, cantidad) => {
        const [existe] = await db.query(
            'SELECT intid_Carrito, intCantidad FROM tblcarrito WHERE id_Cliente = ? AND vchNo_Serie = ?',
            [id_cliente, vchNo_Serie]
        );

        if (existe.length > 0) {
            const nuevaCantidad = existe[0].intCantidad + parseInt(cantidad);
            return await db.query(
                'UPDATE tblcarrito SET intCantidad = ? WHERE intid_Carrito = ?',
                [nuevaCantidad, existe[0].intid_Carrito]
            );
        } else {
            return await db.query(
                'INSERT INTO tblcarrito (id_Cliente, vchNo_Serie, intCantidad) VALUES (?, ?, ?)',
                [id_cliente, vchNo_Serie, cantidad]
            );
        }
    },

    eliminar: async (id_carrito, id_cliente) => {
        return await db.query(
            'DELETE FROM tblcarrito WHERE intid_Carrito = ? AND id_Cliente = ?',
            [id_carrito, id_cliente]
        );
    }
};

export default Carrito;