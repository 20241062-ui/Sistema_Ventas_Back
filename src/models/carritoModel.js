import db from '../config/BD.js';

export const carritoModel = {
    agregar: async (id_Cliente, vchNo_Serie) => {
        // Verificar si ya existe para sumar cantidad o insertar nuevo
        const [existe] = await db.query("SELECT * FROM tblcarrito WHERE id_Cliente = ? AND vchNo_Serie = ?", [id_Cliente, vchNo_Serie]);
        
        if (existe.length > 0) {
            return await db.query("UPDATE tblcarrito SET intCantidad = intCantidad + 1 WHERE id_Cliente = ? AND vchNo_Serie = ?", [id_Cliente, vchNo_Serie]);
        }
        return await db.query("INSERT INTO tblcarrito (id_Cliente, vchNo_Serie) VALUES (?, ?)", [id_Cliente, vchNo_Serie]);
    },

    obtenerPorCliente: async (id_Cliente) => {
        const sql = `
            SELECT c.*, p.vchNombre, p.floPrecioUnitario, p.vchImagen 
            FROM tblcarrito c
            JOIN tblproductos p ON c.vchNo_Serie = p.vchNo_Serie
            WHERE c.id_Cliente = ?`;
        const [rows] = await db.query(sql, [id_Cliente]);
        return rows;
    },
    
    eliminar: async (id_Carrito) => {
        return await db.query("DELETE FROM tblcarrito WHERE intid_Carrito = ?", [id_Carrito]);
    }
};