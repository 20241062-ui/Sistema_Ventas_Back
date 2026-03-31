import db from '../config/BD.js';

const Carrito = {
    // Obtener todos los productos del carrito de un usuario específico
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

    // Agregar producto o actualizar cantidad si ya existe
    agregar: async (id_cliente, vchNo_Serie, cantidad) => {
        // Verificar si el producto ya está en el carrito de ese cliente
        const [existe] = await db.query(
            'SELECT intid_Carrito, intCantidad FROM tbl_carrito WHERE intid_Cliente = ? AND vchNo_Serie = ?',
            [id_cliente, vchNo_Serie]
        );

        if (existe.length > 0) {
            // Si existe, sumamos la cantidad
            const nuevaCantidad = existe[0].intCantidad + parseInt(cantidad);
            return await db.query(
                'UPDATE tbl_carrito SET intCantidad = ? WHERE intid_Carrito = ?',
                [nuevaCantidad, existe[0].intid_Carrito]
            );
        } else {
            // Si no existe, lo insertamos
            return await db.query(
                'INSERT INTO tbl_carrito (intid_Cliente, vchNo_Serie, intCantidad) VALUES (?, ?, ?)',
                [id_cliente, vchNo_Serie, cantidad]
            );
        }
    },

    // Eliminar un item específico por su ID de carrito
    eliminar: async (id_carrito, id_cliente) => {
        return await db.query(
            'DELETE FROM tbl_carrito WHERE intid_Carrito = ? AND intid_Cliente = ?',
            [id_carrito, id_cliente]
        );
    },

    // Limpiar todo el carrito (útil después de una compra)
    vaciar: async (id_cliente) => {
        return await db.query('DELETE FROM tbl_carrito WHERE intid_Cliente = ?', [id_cliente]);
    }
};

export default Carrito;