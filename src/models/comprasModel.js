import db from "../config/BD.js"

const obtenerCompras = async () => {
    const [rows] = await db.query(`
        SELECT id_Compra, RFC, TotalCompra, Fecha
        FROM tblcompra
        ORDER BY id_Compra DESC
    `)
    return rows
}

const obtenerCompraPorId = async (id) => {
    // 1. Obtenemos los datos generales de la compra
    const [compra] = await db.query(`
        SELECT id_Compra, RFC, TotalCompra, Fecha 
        FROM tblcompra 
        WHERE id_Compra = ?`, [id]);

    // 2. Obtenemos el detalle de los productos
    const [productos] = await db.query(`
        SELECT 
            d.No_Serie,
            p.vchNombre AS producto,
            p.vchDescripcion AS descripcion,
            d.Cantidad,
            d.PrecioCompra,
            (d.Cantidad * d.PrecioCompra) AS subtotal
        FROM tbldetallecompra d
        INNER JOIN tblproductos p ON d.No_Serie = p.vchNo_Serie
        WHERE d.id_Compra = ?
    `, [id]);

    return {
        compra: compra[0] || null,
        detalle: productos || []
    };
}
// Agrega esto a tu comprasModel.js existente
const crearCompra = async (datos) => {
    const { rfc, total, productos } = datos;
    const connection = await db.getConnection(); // Necesitamos la conexión para la transacción

    try {
        await connection.beginTransaction();

        // 1. Insertar la compra (Cabecera)
        const [resultCompra] = await connection.query(
            "INSERT INTO tblcompra (RFC, Fecha, TotalCompra) VALUES (?, NOW(), ?)",
            [rfc, total]
        );
        const id_Compra = resultCompra.insertId;

        // 2. Insertar los productos y actualizar stock
        for (const prod of productos) {
            // Insertar detalle
            await connection.query(
                "INSERT INTO tbldetallecompra (id_Compra, vchNo_Serie, Cantidad, PrecioCompra) VALUES (?, ?, ?, ?)",
                [id_Compra, prod.no_serie, prod.cantidad, prod.precio]
            );

            // Actualizar stock del producto automáticamente
            await connection.query(
                "UPDATE tblproductos SET intStock = intStock + ? WHERE vchNo_Serie = ?",
                [prod.cantidad, prod.no_serie]
            );
        }

        await connection.commit();
        return { success: true, id_Compra };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export { obtenerCompras, obtenerCompraPorId, crearCompra };

