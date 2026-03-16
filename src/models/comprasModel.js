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

export { obtenerCompras, obtenerCompraPorId }