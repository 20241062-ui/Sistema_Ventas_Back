const probarBrevo = async () => {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'api-key': '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',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sender: { name: "Prueba", email: "20241062@uthh.edu.mx" },
            to: [{ email: "20241062@uthh.edu.mx" }], // Envíatelo a ti mismo
            subject: "Prueba de API de Terceros",
            htmlContent: "<h1>¡Funciona!</h1><p>La API de Brevo está lista.</p>"
        })
    });
    const data = await res.json();
    console.log(data);
};
probarBrevo();