import 'dotenv/config';

export const enviarFacturaBrevo = async (datos) => {
    const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
    
    const API_KEY = process.env.BREVO_API_KEY; 

    const filasProductos = datos.productos.map(p => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333;">${p.nombre}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; color: #333;">${p.cantidad}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; color: #333;">$${p.precio.toFixed(2)}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #2c3e50;">$${(p.cantidad * p.precio).toFixed(2)}</td>
        </tr>
    `).join('');

    const emailData = {
        sender: { 
            name: "Comercializadora Doble L", 
            email: "20241062@uthh.edu.mx" 
        },
        to: [{ 
            email: datos.correoProveedor, 
            name: datos.nombreProveedor 
        }],
        subject: `Orden de Compra #${Math.floor(Math.random() * 1000)} - Comercializadora Doble L`,
        htmlContent: `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; margin-top: 20px; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">
                <tr>
                    <td align="center" style="background-color: #2c3e50; padding: 30px 20px;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">ORDEN DE COMPRA</h1>
                        <p style="color: #bdc3c7; margin: 5px 0 0 0;">Comercializadora Doble L</p>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 30px 40px;">
                        <table width="100%">
                            <tr>
                                <td>
                                    <p style="margin: 0; color: #7f8c8d; font-size: 14px;">PROVEEDOR</p>
                                    <p style="margin: 5px 0 20px 0; color: #2c3e50; font-weight: bold; font-size: 16px;">${datos.nombreProveedor}</p>
                                </td>
                                <td style="text-align: right;">
                                    <p style="margin: 0; color: #7f8c8d; font-size: 14px;">FECHA</p>
                                    <p style="margin: 5px 0 20px 0; color: #2c3e50; font-weight: bold; font-size: 16px;">${new Date().toLocaleDateString()}</p>
                                </td>
                            </tr>
                        </table>

                        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-top: 10px;">
                            <thead>
                                <tr style="background-color: #f8f9fa;">
                                    <th style="text-align: left; padding: 12px; color: #7f8c8d; font-size: 13px; border-bottom: 2px solid #2c3e50;">PRODUCTO</th>
                                    <th style="text-align: center; padding: 12px; color: #7f8c8d; font-size: 13px; border-bottom: 2px solid #2c3e50;">CANT.</th>
                                    <th style="text-align: right; padding: 12px; color: #7f8c8d; font-size: 13px; border-bottom: 2px solid #2c3e50;">PRECIO</th>
                                    <th style="text-align: right; padding: 12px; color: #7f8c8d; font-size: 13px; border-bottom: 2px solid #2c3e50;">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filasProductos}
                            </tbody>
                        </table>

                        <table width="100%" style="margin-top: 20px;">
                            <tr>
                                <td style="text-align: right;">
                                    <span style="color: #7f8c8d; font-size: 16px;">Total de la Orden:</span>
                                    <h2 style="margin: 5px 0 0 0; color: #2c3e50; font-size: 28px;">$${datos.total.toFixed(2)} <span style="font-size: 14px; color: #7f8c8d;">MXN</span></h2>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                        <p style="margin: 0; color: #95a5a6; font-size: 12px;">Este es un documento oficial generado automáticamente.</p>
                        <p style="margin: 5px 0 0 0; color: #95a5a6; font-size: 12px;">© 2026 Comercializadora Doble L - Sistema de Gestión de Inventarios.</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
    };

    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'api-key': API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        const result = await response.json();
        if (response.ok) {
            console.log(" ¡Correo Profesional Enviado!");
        } else {
            console.error(" Error en formato:", result);
        }
    } catch (error) {
        console.error(" Error de red:", error);
    }
};