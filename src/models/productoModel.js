import db from '../config/BD.js';

const Producto = {
    // Obtener todos con paginación y stats
    obtenerTodos: async (buscar, offset, limite) => {
        const [productos] = await db.query('CALL sp_obtener_productos(?, ?, ?)', [buscar, offset, limite]);
        const [total] = await db.query('CALL sp_contar_productos(?)', [buscar]);
        
        const [totalP] = await db.query('SELECT fn_contar_productos_por_estado(-1) AS total');
        const [activos] = await db.query('SELECT fn_contar_productos_por_estado(1) AS activos');
        const [inactivos] = await db.query('SELECT fn_contar_productos_por_estado(0) AS inactivos');

        return {
            productos: productos[0],
            totalFiltrados: total[0][0].total,
            stats: {
                total: totalP[0].total,
                activos: activos[0].activos,
                inactivos: inactivos[0].inactivos
            }
        };
    },

    // Migrado de productoDetalle.php
    obtenerPorId: async (id) => {
        const sql = `SELECT p.*, m.vchNombre AS Marca 
                    FROM tblproductos p 
                    INNER JOIN tblmarcas m ON p.intid_Marca = m.intid_Marca 
                    WHERE p.vchNo_Serie = ?`;
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    },

    // Migrado de producto_nuevo.php (Lógica SQL)
    crear: async (datos) => {
        const { vchNo_Serie, vchNombre, vchDescripcion, floPrecioUnitario, floPrecioCompra, intStock, intid_Categoria, intid_Marca, vchImagen } = datos;
        const sql = `INSERT INTO tblproductos (vchNo_Serie, vchNombre, vchDescripcion, floPrecioUnitario, floPrecioCompra, intStock, intid_Categoria, intid_Marca, vchImagen, Estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;
        return await db.query(sql, [vchNo_Serie, vchNombre, vchDescripcion, floPrecioUnitario, floPrecioCompra, intStock, intid_Categoria, intid_Marca, vchImagen]);
    },

    // Migrado de producto_actualizar.php
    actualizar: async (id, datos, usuario) => {
        const { intid_Marca, intid_Categoria, vchNombre, vchDescripcion, vchImagen, intStock, floPrecioCompra, floPrecioUnitario } = datos;
        
        await db.query(`UPDATE tblproductos SET intid_Marca=?, intid_Categoria=?, vchNombre=?, vchDescripcion=?, vchImagen=?, intStock=?, floPrecioCompra=? WHERE vchNo_Serie=?`, 
            [intid_Marca, intid_Categoria, vchNombre, vchDescripcion, vchImagen, intStock, floPrecioCompra, id]);
        
        // Ejecución del procedimiento almacenado de auditoría/precios
        return await db.query('CALL sp_actualizar_precio(?, ?, ?, ?)', [id, floPrecioUnitario, usuario.nombre, usuario.rol]);
    },

    // Migrado de producto_baja.php
    cambiarEstado: async (id, estado, usuario) => { 
        await db.query('SET @usuario_sistema = ?, @rol_usuario = ?', [usuario.nombre, usuario.rol]);
        return await db.query('UPDATE tblproductos SET Estado = ? WHERE vchNo_Serie = ?', [estado, id]);
    },

    eliminar: async (id) => {
        return await db.query('DELETE FROM tblproductos WHERE vchNo_Serie = ?', [id]);
    }
};

export default Producto;