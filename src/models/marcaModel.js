import db from '../config/BD.js';

const Marca = {
    // Listar todas las marcas activas
    obtenerTodas: async (busqueda = "") => {
        const sql = `
            SELECT * FROM tblmarcas 
            WHERE Estado = 1 
            AND (intid_Marca LIKE ? OR vchNombre LIKE ?)
            ORDER BY intid_Marca ASC`;
        const params = [`%${busqueda}%`, `%${busqueda}%` ];
        const [rows] = await db.query(sql, params);
        return rows;
    },

    // Obtener una sola marca por ID (para editar)
    obtenerPorId: async (id) => {
        const [rows] = await db.query("SELECT * FROM tblmarcas WHERE intid_Marca = ?", [id]);
        return rows[0];
    },

    // Insertar nueva marca
    crear: async (nombre) => {
        return await db.query("INSERT INTO tblmarcas (vchNombre, Estado) VALUES (?, 1)", [nombre]);
    },

    // Actualizar nombre
    actualizar: async (id, nombre) => {
        return await db.query("UPDATE tblmarcas SET vchNombre = ? WHERE intid_Marca = ?", [nombre, id]);
    },

    // Baja Lógica (Cambiar Estado a 0)
    eliminarLogico: async (id) => {
        return await db.query("UPDATE tblmarcas SET Estado = 0 WHERE intid_Marca = ?", [id]);
    }
};

export default Marca;