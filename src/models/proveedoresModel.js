import db from '../config/BD.js';

export const proveedoresModel = {
    obtenerTodos: async (busqueda = "") => {
        
        let sql = "SELECT * FROM tblproveedor"; 
        let params = [];

        if (busqueda) {
            sql += ` WHERE (vchNombre LIKE ? OR vchRFC LIKE ? OR vchRazon_Social LIKE ?)`;
            params = [`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`];
        }

        sql += " ORDER BY vchNombre ASC";
        const [rows] = await db.query(sql, params);
        return rows;
    },

    obtenerPorRFC: async (rfc) => {
        const [rows] = await db.query("SELECT * FROM tblproveedor WHERE vchRFC = ?", [rfc]);
        return rows[0];
    },

    crear: async (datos) => {
        const { vchRFC, vchNombre, vchApellido_Paterno, vchApellido_Materno, vchColonia, intNo_ExteriorInterior, vchCodigo_Postal, vchCalle, vchTelefono, vchCorreo, vchRazon_Social } = datos;
        const sql = `INSERT INTO tblproveedor 
            (vchRFC, vchNombre, vchApellido_Paterno, vchApellido_Materno, vchColonia, intNo_ExteriorInterior, vchCodigo_Postal, vchCalle, vchTelefono, vchCorreo, vchRazon_Social, intEstado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;
        return await db.query(sql, [vchRFC, vchNombre, vchApellido_Paterno, vchApellido_Materno, vchColonia, intNo_ExteriorInterior, vchCodigo_Postal, vchCalle, vchTelefono, vchCorreo, vchRazon_Social]);
    },

    actualizar: async (rfc, datos) => {
        const { vchNombre, vchApellido_Paterno, vchApellido_Materno, vchColonia, intNo_ExteriorInterior, vchCodigo_Postal, vchCalle, vchTelefono, vchCorreo, vchRazon_Social } = datos;
        const sql = `UPDATE tblproveedor SET 
            vchNombre=?, vchApellido_Paterno=?, vchApellido_Materno=?, vchColonia=?, intNo_ExteriorInterior=?, 
            vchCodigo_Postal=?, vchCalle=?, vchTelefono=?, vchCorreo=?, vchRazon_Social=? 
            WHERE vchRFC=?`;
        return await db.query(sql, [vchNombre, vchApellido_Paterno, vchApellido_Materno, vchColonia, intNo_ExteriorInterior, vchCodigo_Postal, vchCalle, vchTelefono, vchCorreo, vchRazon_Social, rfc]);
    },

    cambiarEstado: async (rfc, nuevoEstado) => {
        return await db.query("UPDATE tblproveedor SET intEstado = ? WHERE vchRFC = ?", [nuevoEstado, rfc]);
    }
};