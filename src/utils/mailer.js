export const enviarFacturaBrevo = async (datos) => {
    const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
    // Tu API Key de Brevo
    const API_KEY = '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'; 

    // Mapeo de los productos que vienen del carrito (Frontend)
    const filasProductos = datos.productos.map(p => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${p.nombre}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${p.cantidad}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${p.precio.toFixed(2)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${(p.cantidad * p.precio).toFixed(2)}</td>
        </tr>
    `).join('');

    const emailData = {
        // IMPORTANTE: Este email DEBE ser el que verificaste en Brevo (Senders & IP)
        sender: { name: "Comercializadora Doble L", email: "20241062@uthh.edu.mx" }, 
        to: [{ email: datos.correoProveedor, name: datos.nombreProveedor }],
        subject: `Orden de Compra - Comercializadora Doble L`,
        htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                <div style="background-color: #2c3e50; color: white; padding: 10px; text-align: center;">
                    <h2 style="margin: 0;">Orden de Compra</h2>
                </div>
                <div style="padding: 20px 0;">
                    <p><b>Proveedor:</b> ${datos.nombreProveedor}</p>
                    <p><b>RFC:</b> ${datos.rfc}</p>
                    <p><b>Fecha:</b> ${new Date().toLocaleDateString()}</p>
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr style="background-color: #f8f9fa;">
                            <th style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd;">Producto</th>
                            <th style="text-align: center; padding: 10px; border-bottom: 2px solid #ddd;">Cant.</th>
                            <th style="text-align: right; padding: 10px; border-bottom: 2px solid #ddd;">Precio</th>
                            <th style="text-align: right; padding: 10px; border-bottom: 2px solid #ddd;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>${filasProductos}</tbody>
                </table>
                <div style="text-align: right; margin-top: 20px;">
                    <h3 style="color: #2c3e50;">Total Compra: $${datos.total.toFixed(2)} MXN</h3>
                </div>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="font-size: 12px; color: #7f8c8d; text-align: center;">
                    Este es un comprobante automático generado por el Sistema Administrativo de Comercializadora Doble L.
                </p>
            </div>
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
            console.log("✅ API de Terceros (Brevo): Correo enviado exitosamente a", datos.correoProveedor);
        } else {
            console.error("❌ API de Terceros (Brevo) rechazó la petición:", result);
        }
    } catch (error) {
        console.error("⚠️ Error de conexión con la API de Brevo:", error);
    }
};