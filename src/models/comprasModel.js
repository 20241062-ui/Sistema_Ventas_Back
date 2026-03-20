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


export const crearCompra = async (datos) => {
    const { rfc, total, productos } = datos;
    
    // Obtenemos una conexión individual del pool para manejar la transacción
    const connection = await db.getConnection();

    try {
        // Iniciamos la transacción
        await connection.beginTransaction();

        // 1. Insertar la cabecera de la compra
        // Nota: Asegúrate que la tabla se llame 'tblcompra' y las columnas 'RFC', 'Fecha', 'TotalCompra'
        const [resultCompra] = await connection.query(
            "INSERT INTO tblcompra (RFC, Fecha, TotalCompra) VALUES (?, NOW(), ?)",
            [rfc, total]
        );
        
        const id_Compra = resultCompra.insertId;

        // 2. Insertar cada producto en el detalle y actualizar su stock
        for (const prod of productos) {
            // INSERT EN DETALLE (Ajustado a tus nombres de columnas reales)
            await connection.query(
                `INSERT INTO tbldetallecompra 
                (id_Compra, Cantidad, PrecioCompra, PrecioVenta, FechaGarantia, No_Serie) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    id_Compra, 
                    prod.cantidad, 
                    prod.precio, 
                    (prod.precio * 1.25), // Calculamos un precio de venta sugerido (25% de ganancia)
                    '2027-03-19',         // Fecha de garantía (1 año a partir de hoy)
                    prod.no_serie         // El ID del producto que viene del front
                ]
            );

            // ACTUALIZAR STOCK
            // Nota: Verifica si en tblproductos la columna es 'vchNo_Serie' o 'No_Serie'
            await connection.query(
                "UPDATE tblproductos SET intStock = intStock + ? WHERE vchNo_Serie = ?",
                [prod.cantidad, prod.no_serie]
            );
        }

        // Si todo salió bien, confirmamos los cambios
        await connection.commit();
        
        // Retornamos el id_Compra para que el controlador pueda usarlo en el correo
        return { success: true, id_Compra: id_Compra };

    } catch (error) {
        // Si hubo un error, deshacemos todo para no dejar datos a medias
        await connection.rollback();
        console.error(" Error en la transacción de compra:", error);
        throw error; 
    } finally {
        // Liberamos la conexión de vuelta al pool
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