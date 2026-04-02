import db from "../config/BD.js";

export const obtenerCompras = async (busqueda = "") => {
    const filtro = `%${busqueda}%`;
    
    const [rows] = await db.query(`
        SELECT id_Compra, RFC, TotalCompra, Fecha
        FROM tblcompra
        WHERE CAST(id_Compra AS CHAR) LIKE ? 
            OR RFC LIKE ?
        ORDER BY id_Compra DESC
    `, [filtro, filtro]);
    
    return rows;
};


export const obtenerCompraPorId = async (id) => {
    try {
        const [compra] = await db.query(`
            SELECT id_Compra, RFC, TotalCompra, Fecha 
            FROM tblcompra 
            WHERE id_Compra = ?`, [id]);

        if (compra.length === 0) return { compra: null, detalle: [] };

        const [productos] = await db.query(`
            SELECT 
                d.No_Serie AS No_Serie,
                p.vchNombre AS producto,
                d.Cantidad AS Cantidad,
                d.floPrecioCompra AS PrecioCompra,
                (d.intCantidad * d.floPrecioCompra) AS subtotal
            FROM tbldetallecompra d
            INNER JOIN tblproductos p ON d.No_Serie = p.vchNo_Serie
            WHERE d.id_Compra = ?
        `, [id]);

        return {
            compra: compra[0],
            detalle: productos
        };
    } catch (error) {
        console.error("DETALLE ERROR SQL:", error.message);
        throw error; 
    }
};


export const crearCompra = async (datos) => {
    const { rfc, total, productos } = datos;
    
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [resultCompra] = await connection.query(
            "INSERT INTO tblcompra (RFC, Fecha, TotalCompra) VALUES (?, NOW(), ?)",
            [rfc, total]
        );
        
        const id_Compra = resultCompra.insertId;

        for (const prod of productos) {
            await connection.query(
                `INSERT INTO tbldetallecompra 
                (id_Compra, Cantidad, PrecioCompra, PrecioVenta, FechaGarantia, No_Serie) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    id_Compra, 
                    prod.cantidad, 
                    prod.precio, 
                    (prod.precio * 1.25),
                    '2027-03-19',         
                    prod.no_serie         
                ]
            );

            await connection.query(
                "UPDATE tblproductos SET intStock = intStock + ? WHERE vchNo_Serie = ?",
                [prod.cantidad, prod.no_serie]
            );
        }

        await connection.commit();
        
        return { success: true, id_Compra: id_Compra };

    } catch (error) {
        await connection.rollback();
        console.error(" Error en la transacción de compra:", error);
        throw error; 
    } finally {
        connection.release();
    }
};

export const obtenerProveedoresParaSelect = async () => {
    const [rows] = await db.query(
        "SELECT vchRFC, vchNombre, vchRazon_Social, vchCorreo FROM tblproveedores ORDER BY vchNombre ASC"
    );
    return rows;
};

export const obtenerProductosParaSelect = async () => {
    const [rows] = await db.query(
        "SELECT vchNo_Serie, vchNombre FROM tblproductos WHERE Estado = 1 ORDER BY vchNombre ASC"
    );
    return rows;
};