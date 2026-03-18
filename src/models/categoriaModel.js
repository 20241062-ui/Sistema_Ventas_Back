import db from '../config/BD.js';

const Categoria = {
    // Listar todas las categorías activas (con buscador)
    obtenerTodas: async (busqueda = "") => {
        const sql = `
            SELECT * FROM tblcategoria 
            WHERE Estado = 1 
            AND (intid_Categoria LIKE ? OR vchNombre LIKE ?)
            ORDER BY intid_Categoria ASC`;
        const params = [`%${busqueda}%`, `%${busqueda}%` ];
        const [rows] = await db.query(sql, params);
        return rows;
    },

    // Obtener una sola categoría por ID
    obtenerPorId: async (id) => {
        const [rows] = await db.query("SELECT * FROM tblcategoria WHERE intid_Categoria = ?", [id]);
        return rows[0];
    },

    // Insertar nueva categoría
    crear: async (nombre) => {
        return await db.query("INSERT INTO tblcategoria (vchNombre, Estado) VALUES (?, 1)", [nombre]);
    },

    // Actualizar nombre
    actualizar: async (id, nombre) => {
        return await db.query("UPDATE tblcategoria SET vchNombre = ? WHERE intid_Categoria = ?", [nombre, id]);
    },

    // Baja Lógica
    eliminarLogico: async (id) => {
        return await db.query("UPDATE tblcategoria SET Estado = 0 WHERE intid_Categoria = ?", [id]);
    }
};

export default Categoria;