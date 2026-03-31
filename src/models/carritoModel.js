import db from '../config/BD.js';

const Carrito = {
    obtenerPorUsuario: async (id_cliente) => {
        const sql = `
            SELECT c.intid_Carrito, c.vchNo_Serie, c.intCantidad, 
                   p.vchNombre, p.floPrecioUnitario, p.vchImagen
            FROM tbl_carrito c
            INNER JOIN tblproductos p ON c.vchNo_Serie = p.vchNo_Serie
            WHERE c.intid_Cliente = ?`;
        const [rows] = await db.query(sql, [id_cliente]);
        return rows;
    },

    agregar: async (id_cliente, vchNo_Serie, cantidad) => {
        if (!id_cliente || !vchNo_Serie) throw new Error("Datos incompletos para el carrito");

        const [existe] = await db.query(
            'SELECT intid_Carrito, intCantidad FROM tbl_carrito WHERE intid_Cliente = ? AND vchNo_Serie = ?',
            [id_cliente, vchNo_Serie]
        );

        if (existe.length > 0) {
            const nuevaCantidad = existe[0].intCantidad + parseInt(cantidad);
            return await db.query(
                'UPDATE tbl_carrito SET intCantidad = ? WHERE intid_Carrito = ?',
                [nuevaCantidad, existe[0].intid_Carrito]
            );
        } else {
            return await db.query(
                'INSERT INTO tbl_carrito (intid_Cliente, vchNo_Serie, intCantidad) VALUES (?, ?, ?)',
                [id_cliente, vchNo_Serie, cantidad]
            );
        }
    },

  
    eliminar: async (id_carrito, id_cliente) => {
        return await db.query(
            'DELETE FROM tbl_carrito WHERE intid_Carrito = ? AND intid_Cliente = ?',
            [id_carrito, id_cliente]
        );
    },

    vaciar: async (id_cliente) => {
        return await db.query('DELETE FROM tbl_carrito WHERE intid_Cliente = ?', [id_cliente]);
    }
};

export default Carrito;