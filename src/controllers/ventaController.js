document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    // CORRECCIÓN 1: La URL debe coincidir con el prefijo que definimos en index.js
    // Quitamos el doble // y el /admin si tu ruta es /api/ventas
    const API_URL = "https://sistemaventasback.vercel.app/api/ventas";

    if (!id) {
        console.error("No se encontró el ID de la venta en la URL");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error("Error al obtener los datos del servidor");

        const data = await res.json();

        // CORRECCIÓN 2: Validación de datos
        // Usamos cortocircuitos (||) por si el backend devuelve nombres de columnas distintos
        const venta = data.venta;
        const detalle = data.detalle || [];

        if (!venta) {
            alert("No se encontró la información de la venta.");
            return;
        }

        // Llenar datos generales
        document.getElementById("titulo-venta").textContent = `Detalle de la Venta #${id}`;
        document.getElementById("cliente").textContent = venta.vchNombreCliente || venta.nombre_cliente || "N/A";
        document.getElementById("fecha").textContent = venta.dtFechaVenta || venta.Fecha_Venta || "N/A";
        document.getElementById("total-productos").textContent = detalle.length;
        document.getElementById("total").textContent = `$${parseFloat(venta.floTotalVenta || venta.Total_Venta).toFixed(2)}`;

        const tbody = document.getElementById("tabla-detalle");
        tbody.innerHTML = ""; // Limpiar antes de llenar

        // Llenar tabla
        detalle.forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.vchNo_Serie || p.No_Serie}</td>
                <td>${p.vchNombreProducto || p.producto}</td>
                <td>${p.vchDescripcion || p.descripcion || ''}</td>
                <td>$${parseFloat(p.floPrecioUnitario || p.PrecioUnitario).toFixed(2)}</td>
                <td>${p.intCantidad || p.Cantidad}</td>
                <td>$${parseFloat(p.floSubtotal || p.Subtotal).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error en el detalle:", error);
        const tbody = document.getElementById("tabla-detalle");
        if (tbody) tbody.innerHTML = `<tr><td colspan="6">Error al cargar el detalle: ${error.message}</td></tr>`;
    }
});