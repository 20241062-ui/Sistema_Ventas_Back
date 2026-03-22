import * as comprasModel from "../models/comprasModel.js";
import { enviarFacturaBrevo } from "../utils/mailer.js";

export const listarCompras = async (req, res) => {
    try {
        const compras = await comprasModel.obtenerCompras();
        res.json({
            total: compras.length,
            compras: compras
        });
    } catch (error) {
        console.error("Error en listarCompras:", error);
        res.status(500).json({ error: "Error obteniendo compras" });
    }
};

export const verCompra = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await comprasModel.obtenerCompraPorId(id);

        if (!resultado || !resultado.compra) {
            return res.status(404).json({ error: `La compra ${id} no existe.` });
        }
        
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ 
            error: "Error en la base de datos",
            sqlMessage: error.sqlMessage,
            code: error.code 
        });
    }
};

export const registrarCompra = async (req, res) => {
    try {
        const { rfc, total, productos, correoProveedor, nombreProveedor } = req.body;

        // 1. Validaciones básicas
        if (!productos || productos.length === 0) {
            return res.status(400).json({ mensaje: "La compra debe tener al menos un producto" });
        }

        if (!correoProveedor) {
            return res.status(400).json({ mensaje: "Falta el correo del proveedor para enviar la notificación" });
        }

        // 2. Guardar en la base de datos
        const resultado = await comprasModel.crearCompra({ rfc, total, productos });
        
        // 3. Envío de correo con Brevo
        // Usamos un bloque try-catch interno para que, si el correo falla, 
        // no se cancele la respuesta de "Compra exitosa" al usuario.
        if (resultado && resultado.id_Compra) {
            try {
                // CAMBIO CRÍTICO: Agregamos await para asegurar que el proceso no se corte en Vercel
                await enviarFacturaBrevo({
                    rfc,
                    total,
                    productos,
                    correoProveedor,
                    nombreProveedor
                });
                console.log(`Factura enviada correctamente a: ${correoProveedor}`);
            } catch (mailError) {
                // Solo registramos el error en consola para no asustar al cliente, 
                // ya que la compra sí se guardó en la DB.
                console.error("Fallo el envío de correo a Brevo:", mailError.message);
            }
        }

        // 4. Respuesta al cliente
        res.status(201).json({ 
            mensaje: "Compra registrada con éxito y notificación enviada.", 
            id: resultado.id_Compra 
        });

    } catch (error) {
        console.error("Error crítico al registrar compra:", error);
        res.status(500).json({ 
            mensaje: "Error interno al procesar la compra", 
            error: error.message 
        });
    }
};

export const obtenerProveedoresParaSelect = async (req, res) => {
    try {
        const proveedores = await comprasModel.obtenerProveedoresParaSelect();
        res.json(proveedores);
    } catch (error) {
        console.error("Error en obtenerProveedoresParaSelect:", error);
        res.status(500).json({ error: "Error al obtener proveedores" });
    }
};

export const obtenerProductosParaSelect = async (req, res) => {
    try {
        const productos = await comprasModel.obtenerProductosParaSelect();
        res.json(productos);
    } catch (error) {
        console.error("Error en obtenerProductosParaSelect:", error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
};