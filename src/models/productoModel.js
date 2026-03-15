import db from '../config/BD.js';

const Producto = {
    /**
     * Obtener productos con paginación y estadísticas.
     * @param {string} buscar - Término de búsqueda.
     * @param {number} offset - Punto de inicio para paginación.
     * @param {number} limite - Cantidad de registros por página.
     * @param {boolean} esAdmin - Si es true, muestra todo; si es false, solo activos (Estado 1).
     */
    obtenerTodos: async (buscar, offset, limite, esAdmin = false) => {
        let productos;
        let totalFiltrados;

        if (esAdmin) {
            // El administrador sigue usando los procedimientos almacenados para ver todo
            const [resultProd] = await db.query('CALL sp_obtener_productos(?, ?, ?)', [buscar, offset, limite]);
            const [resultTotal] = await db.query('CALL sp_contar_productos(?)', [buscar]);
            productos = resultProd[0];
            totalFiltrados = resultTotal[0][0].total;
        } else {
            // Para la parte pública, filtramos directamente por Estado = 1 (Activos)
            const sqlPublico = `
                SELECT p.*, m.vchNombre AS Marca, c.vchNombre AS Categoria
                FROM tblproductos p
                LEFT JOIN tblmarcas m ON p.intid_Marca = m.intid_Marca
                LEFT JOIN tblcategoria c ON p.intid_Categoria = c.intid_Categoria
                WHERE p.Estado = 1 
                AND (p.vchNombre LIKE CONCAT('%', ?, '%') OR p.vchNo_Serie LIKE CONCAT('%', ?, '%'))
                ORDER BY p.vchNombre ASC
                LIMIT ? OFFSET ?`;
            
            const sqlTotalPublico = `
                SELECT COUNT(*) AS total 
                FROM tblproductos 
                WHERE Estado = 1 
                AND (vchNombre LIKE CONCAT('%', ?, '%') OR vchNo_Serie LIKE CONCAT('%', ?, '%'))`;

            const [rows] = await db.query(sqlPublico, [buscar, buscar, limite, offset]);
            const [totalRows] = await db.query(sqlTotalPublico, [buscar, buscar]);
            
            productos = rows;
            totalFiltrados = totalRows[0].total;
        }
        
        // Stats generales (estos se mantienen para el dashboard)
        const [totalP] = await db.query('SELECT fn_contar_productos_por_estado(-1) AS total');
        const [activos] = await db.query('SELECT fn_contar_productos_por_estado(1) AS activos');
        const [inactivos] = await db.query('SELECT fn_contar_productos_por_estado(0) AS inactivos');

        return {
            productos: productos,
            totalFiltrados: totalFiltrados,
            stats: {
                total: totalP[0].total,
                activos: activos[0].activos,
                inactivos: inactivos[0].inactivos
            }
        };
    },

    obtenerPorId: async (id) => {
        const sql = `SELECT p.*, m.vchNombre AS Marca 
                    FROM tblproductos p 
                    INNER JOIN tblmarcas m ON p.intid_Marca = m.intid_Marca 
                    WHERE p.vchNo_Serie = ?`;
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    },

    crear: async (datos) => {
        const { vchNo_Serie, vchNombre, vchDescripcion, floPrecioUnitario, floPrecioCompra, intStock, intid_Categoria, intid_Marca, vchImagen } = datos;
        const sql = `INSERT INTO tblproductos (vchNo_Serie, vchNombre, vchDescripcion, floPrecioUnitario, floPrecioCompra, intStock, intid_Categoria, intid_Marca, vchImagen, Estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;
        return await db.query(sql, [vchNo_Serie, vchNombre, vchDescripcion, floPrecioUnitario, floPrecioCompra, intStock, intid_Categoria, intid_Marca, vchImagen]);
    },

    actualizar: async (id, datos, usuario) => {
        const { intid_Marca, intid_Categoria, vchNombre, vchDescripcion, vchImagen, intStock, floPrecioCompra, floPrecioUnitario } = datos;
        
        await db.query(`UPDATE tblproductos SET intid_Marca=?, intid_Categoria=?, vchNombre=?, vchDescripcion=?, vchImagen=?, intStock=?, floPrecioCompra=? WHERE vchNo_Serie=?`, 
            [intid_Marca, intid_Categoria, vchNombre, vchDescripcion, vchImagen, intStock, floPrecioCompra, id]);
        
        return await db.query('CALL sp_actualizar_precio(?, ?, ?, ?)', [id, floPrecioUnitario, usuario.nombre, usuario.rol]);
    },

    cambiarEstado: async (id, estado, usuario) => { 
        await db.query('SET @usuario_sistema = ?, @rol_usuario = ?', [usuario.nombre, usuario.rol]);
        return await db.query('UPDATE tblproductos SET Estado = ? WHERE vchNo_Serie = ?', [estado, id]);
    },

    eliminar: async (id) => {
        return await db.query('DELETE FROM tblproductos WHERE vchNo_Serie = ?', [id]);
    }
};

export default Producto;