import db from '../config/BD.js';

const Producto = {
    /**
     * Obtener estadísticas generales (Activos, Inactivos, Total)
     * Utiliza las funciones almacenadas de la base de datos.
     */
    obtenerEstadisticas: async () => {
        const [totalP] = await db.query('SELECT fn_contar_productos_por_estado(-1) AS total');
        const [activos] = await db.query('SELECT fn_contar_productos_por_estado(1) AS activos');
        const [inactivos] = await db.query('SELECT fn_contar_productos_por_estado(0) AS inactivos');

        return {
            total: totalP[0]?.total || 0,
            activos: activos[0]?.activos || 0,
            inactivos: inactivos[0]?.inactivos || 0
        };
    },

    /**
     * Obtener productos con paginación y búsqueda.
     * @param {string} buscar - Término de búsqueda.
     * @param {number} offset - Punto de inicio.
     * @param {number} limite - Cantidad por página.
     * @param {boolean} esAdmin - Si es true usa SP, si es false usa Query simple (activos).
     */
    obtenerTodos: async (buscar, offset, limite, esAdmin = false) => {
        let productos;
        let totalFiltrados;

        if (esAdmin) {
            // El administrador usa los procedimientos almacenados
            const [resultProd] = await db.query('CALL sp_obtener_productos(?, ?, ?)', [buscar, offset, limite]);
            const [resultTotal] = await db.query('CALL sp_contar_productos(?)', [buscar]);
            
            productos = resultProd[0]; // Los SP devuelven un array anidado
            totalFiltrados = resultTotal[0][0]?.total || 0;
        } else {
            // Parte pública: Solo activos (Estado 1)
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
            totalFiltrados = totalRows[0]?.total || 0;
        }
        
        // Obtenemos las estadísticas generales llamando a nuestra propia función interna
        const stats = await Producto.obtenerEstadisticas();

        return {
            productos,
            totalFiltrados,
            stats
        };
    },

    /**
     * Obtener detalle de un producto por No_Serie
     */
    obtenerPorId: async (id) => {
        const sql = `SELECT p.*, m.vchNombre AS Marca 
                    FROM tblproductos p 
                    INNER JOIN tblmarcas m ON p.intid_Marca = m.intid_Marca 
                    WHERE p.vchNo_Serie = ?`;
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    },

    /**
     * Crear un nuevo producto (Estado inicial: 1)
     */
    crear: async (datos) => {
        const { vchNo_Serie, vchNombre, vchDescripcion, floPrecioUnitario, floPrecioCompra, intStock, intid_Categoria, intid_Marca, vchImagen } = datos;
        const sql = `INSERT INTO tblproductos (vchNo_Serie, vchNombre, vchDescripcion, floPrecioUnitario, floPrecioCompra, intStock, intid_Categoria, intid_Marca, vchImagen, Estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;
        return await db.query(sql, [vchNo_Serie, vchNombre, vchDescripcion, floPrecioUnitario, floPrecioCompra, intStock, intid_Categoria, intid_Marca, vchImagen]);
    },

    /**
     * Actualizar datos y ejecutar SP de precio (Auditoría)
     */
    actualizar: async (id, datos, usuario) => {
        const { intid_Marca, intid_Categoria, vchNombre, vchDescripcion, vchImagen, intStock, floPrecioCompra, floPrecioUnitario } = datos;
        
        // 1. Actualización de datos básicos
        await db.query(`UPDATE tblproductos SET intid_Marca=?, intid_Categoria=?, vchNombre=?, vchDescripcion=?, vchImagen=?, intStock=?, floPrecioCompra=? WHERE vchNo_Serie=?`, 
            [intid_Marca, intid_Categoria, vchNombre, vchDescripcion, vchImagen, intStock, floPrecioCompra, id]);
        
        // 2. Llamada al procedimiento de precios que registra el cambio
        return await db.query('CALL sp_actualizar_precio(?, ?, ?, ?)', [id, floPrecioUnitario, usuario.nombre, usuario.rol]);
    },

    /**
     * Cambiar estado (Activar/Desactivar) con auditoría
     */
    cambiarEstado: async (id, estado, usuario) => { 
        await db.query('SET @usuario_sistema = ?, @rol_usuario = ?', [usuario.nombre, usuario.rol]);
        return await db.query('UPDATE tblproductos SET Estado = ? WHERE vchNo_Serie = ?', [estado, id]);
    },

    /**
     * Baja Lógica (Marcar como Estado 0)
     * Reemplaza al DELETE físico para mantener integridad referencial.
     */
    eliminar: async (id, usuario) => {
        await db.query('SET @usuario_sistema = ?, @rol_usuario = ?', [usuario.nombre, usuario.rol]);
        return await db.query('UPDATE tblproductos SET Estado = 0 WHERE vchNo_Serie = ?', [id]);
    }
};

export default Producto;