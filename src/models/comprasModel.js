import db from "../config/BD.js";

/**
 * LISTAR TODAS LAS COMPRAS
 */
export const obtenerCompras = async () => {
    const [rows] = await db.query(`
        SELECT id_Compra, RFC, TotalCompra, Fecha
        FROM tblcompra
        ORDER BY id_Compra DESC
    `);
    return rows;
};

/**
 * OBTENER DETALLE DE UNA COMPRA POR ID
 */
export const obtenerCompraPorId = async (id) => {
    try {
        // 1. Cabecera de la compra
        // Asegúrate que las columnas sean id_Compra, RFC, TotalCompra
        const [compra] = await db.query(`
            SELECT id_Compra, RFC, TotalCompra, Fecha 
            FROM tblcompra 
            WHERE id_Compra = ?`, [id]);

        if (compra.length === 0) return { compra: null, detalle: [] };

        // 2. Detalle de la compra
        // Usamos 'tbldetallecompra' (el nombre que me confirmaste)
        const [productos] = await db.query(`
            SELECT 
                d.vchNo_Serie AS No_Serie,
                p.vchNombre AS producto,
                d.intCantidad AS Cantidad,
                d.floPrecioCompra AS PrecioCompra,
                (d.intCantidad * d.floPrecioCompra) AS subtotal
            FROM tbldetallecompra d
            INNER JOIN tblproductos p ON d.vchNo_Serie = p.vchNo_Serie
            WHERE d.id_Compra = ?
        `, [id]);

        return {
            compra: compra[0],
            detalle: productos
        };
    } catch (error) {
        // Esto aparecerá en tus logs de Vercel/Node
        console.error("DETALLE ERROR SQL:", error.message);
        throw error; 
    }
};

/**
 * REGISTRAR NUEVA COMPRA (CON TRANSACCIÓN Y ACTUALIZACIÓN DE STOCK)
 */
export const crearCompra = async (datos) => {
    const { rfc, total, productos } = datos;
    
    // Obtenemos una conexión individual del pool para manejar la transacción
    const connection = await db.getConnection();

    try {
        // Iniciamos la transacción: Si algo falla de aquí en adelante, nada se guarda
        await connection.beginTransaction();

        // 1. Insertar la cabecera de la compra
        const [resultCompra] = await connection.query(
            "INSERT INTO tblcompra (RFC, Fecha, TotalCompra) VALUES (?, NOW(), ?)",
            [rfc, total]
        );
        
        const id_Compra = resultCompra.insertId;

        // 2. Insertar cada producto en el detalle y actualizar su stock
        for (const prod of productos) {
            // Insertar en la tabla de detalles
            // Nota: Verifica que los nombres de columnas coincidan con tu base de datos
            await connection.query(
                "INSERT INTO tbldetallecompra (id_Compra, vchNo_Serie, intCantidad, floPrecioCompra) VALUES (?, ?, ?, ?)",
                [id_Compra, prod.no_serie, prod.cantidad, prod.precio]
            );

            // Actualizar el stock del producto sumando lo comprado
            await connection.query(
                "UPDATE tblproductos SET intStock = intStock + ? WHERE vchNo_Serie = ?",
                [prod.cantidad, prod.no_serie]
            );
        }

        // Si todo salió bien, confirmamos los cambios en la BD
        await connection.commit();
        
        return { success: true, id_Compra };

    } catch (error) {
        // Si hubo un error (ej. se fue el internet o falló un ID), deshacemos todo
        await connection.rollback();
        console.error("Error en la transacción de compra:", error);
        throw error; // Lanzamos el error para que el controlador lo atrape
    } finally {
        // IMPORTANTE: Liberamos la conexión de vuelta al pool para evitar que el servidor se bloquee
        connection.release();
    }
};

export const obtenerProveedoresParaSelect = async () => {
    const [rows] = await db.query(
        "SELECT vchRFC, vchNombre, vchRazon_Social FROM tblproveedor ORDER BY vchNombre ASC"
    );
    return rows;
};

export const obtenerProductosParaSelect = async () => {
    const [rows] = await db.query(
        "SELECT vchNo_Serie, vchNombre FROM tblproductos WHERE Estado = 1 ORDER BY vchNombre ASC"
    );
    return rows;
};