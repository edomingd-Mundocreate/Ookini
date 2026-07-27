// Manejo de pestañas
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        
        const targetTab = btn.getAttribute("data-tab");

        tabBtns.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));

        btn.classList.add("active");
        document.getElementById(targetTab).classList.add("active");
    });
});

// Elementos del DOM para la Reserva
const contadorTotal = document.getElementById("contador-total");
const contadorV60 = document.getElementById("contador-v60");
const contadorKyoto = document.getElementById("contador-kyoto");
const botonReservar = document.getElementById("boton-reservar");

const modalReserva = document.getElementById("modal-reserva");
const formReserva = document.getElementById("form-reserva");
const inputV60 = document.getElementById("cant-v60");
const inputKyoto = document.getElementById("cant-kyoto");
const inputExpreso = document.getElementById("cant-expreso");

// Colección de contenedores de opciones de la carta
const itemsCartaOptions = document.querySelectorAll('.item-carta-opcion');

const btnCancelar = document.getElementById("btn-cancelar");
const mensajeError = document.getElementById("mensaje-error");

const modalConfirmacion = document.getElementById("modal-confirmacion");
const detallesReserva = document.getElementById("detalles-reserva");
const btnCerrarConfirmacion = document.getElementById("btn-cerrar-confirmacion");

// Precios de métodos
const PRECIO_V60 = 55;
const PRECIO_KYOTO = 70;
const PRECIO_EXPRESO = 40;

// Activar/Desactivar input numérico al marcar la casilla
itemsCartaOptions.forEach(container => {
    const chk = container.querySelector('.chk-item');
    const inputNum = container.querySelector('.cant-item');

    chk.addEventListener('change', () => {
        inputNum.disabled = !chk.checked;
        if (chk.checked) {
            inputNum.value = 1;
        } else {
            inputNum.value = 1;
        }
    });
});

// Evento para abrir el modal
botonReservar.addEventListener("click", () => {
    inputV60.value = 0;
    inputKyoto.value = 0;
    inputExpreso.value = 0;
    
    // Resetear casillas e inputs de la carta
    itemsCartaOptions.forEach(container => {
        const chk = container.querySelector('.chk-item');
        const inputNum = container.querySelector('.cant-item');
        chk.checked = false;
        inputNum.disabled = true;
        inputNum.value = 1;
    });

    mensajeError.style.display = "none";
    modalReserva.showModal();
});

btnCancelar.addEventListener("click", () => {
    modalReserva.close();
});

formReserva.addEventListener("submit", (e) => {
    e.preventDefault();

    const cantV60 = parseInt(inputV60.value) || 0;
    const cantKyoto = parseInt(inputKyoto.value) || 0;
    const cantExpreso = parseInt(inputExpreso.value) || 0;

    // Recopilar selección múltiple de la carta
    const seleccionadosCarta = [];
    let costoTotalCarta = 0;

    itemsCartaOptions.forEach(container => {
        const chk = container.querySelector('.chk-item');
        const inputNum = container.querySelector('.cant-item');

        if (chk.checked) {
            const cantidad = parseInt(inputNum.value) || 1;
            const nombre = inputNum.getAttribute('data-nombre');
            const precioUnitario = parseFloat(inputNum.getAttribute('data-precio')) || 0;
            const subtotal = cantidad * precioUnitario;

            costoTotalCarta += subtotal;
            seleccionadosCarta.push({
                nombre: nombre,
                cantidad: cantidad,
                subtotal: subtotal
            });
        }
    });

    let disponiblesV60 = parseInt(contadorV60.textContent);
    let disponiblesKyoto = parseInt(contadorKyoto.textContent);
    const totalLimitadas = cantV60 + cantKyoto;

    // Validación 1: Selección vacía
    if (totalLimitadas === 0 && cantExpreso === 0 && seleccionadosCarta.length === 0) {
        mostrarError("Por favor selecciona al menos una taza o producto de la carta.");
        return;
    }

    // Validación 2: Máximo 2 tazas de especialidad limitada
    if (totalLimitadas > 2) {
        mostrarError("Solo se permiten máximo 2 tazas en total de especialidades limitadas (V60 y Kyoto Drip).");
        return;
    }

    // Validación 3: Disponibilidad individual
    if (cantV60 > disponiblesV60) {
        mostrarError(`Solo quedan ${disponiblesV60} tazas V60 disponibles hoy.`);
        return;
    }

    if (cantKyoto > disponiblesKyoto) {
        mostrarError(`Solo quedan ${disponiblesKyoto} tazas Kyoto drip disponibles hoy.`);
        return;
    }

    // Actualizar contadores
    disponiblesV60 -= cantV60;
    disponiblesKyoto -= cantKyoto;
    contadorV60.textContent = disponiblesV60;
    contadorKyoto.textContent = disponiblesKyoto;
    contadorTotal.textContent = disponiblesV60 + disponiblesKyoto;

    // Cálculo general
    const totalV60 = cantV60 * PRECIO_V60;
    const totalKyoto = cantKyoto * PRECIO_KYOTO;
    const totalExpreso = cantExpreso * PRECIO_EXPRESO;
    const costoTotal = totalV60 + totalKyoto + totalExpreso + costoTotalCarta;

    // Resumen en HTML
    let desgloseHTML = `<p><strong>Resumen de tu pedido:</strong></p><ul>`;

    if (cantV60 > 0) desgloseHTML += `<li>V60: ${cantV60} taza(s) - $${totalV60}</li>`;
    if (cantKyoto > 0) desgloseHTML += `<li>Kyoto drip: ${cantKyoto} taza(s) - $${totalKyoto}</li>`;
    if (cantExpreso > 0) desgloseHTML += `<li>Expreso Japonés: ${cantExpreso} taza(s) - $${totalExpreso}</li>`;

    if (seleccionadosCarta.length > 0) {
        desgloseHTML += `<li><strong>Productos de la carta:</strong><ul>`;
        seleccionadosCarta.forEach(item => {
            desgloseHTML += `<li>${item.nombre} x${item.cantidad} - $${item.subtotal}</li>`;
        });
        desgloseHTML += `</ul></li>`;
    }

    desgloseHTML += `</ul>`;
    if (costoTotal > 0) {
        desgloseHTML += `<p><strong>Total de tu pedido y/o reserva:</strong> $${costoTotal}</p>`;
    }

    detallesReserva.innerHTML = desgloseHTML;
    modalReserva.close();
    modalConfirmacion.showModal();
});

btnCerrarConfirmacion.addEventListener("click", () => {
    modalConfirmacion.close();
});

function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.style.display = "block";
}

function puedeReservarDegustacion(cantidad) {
    return cantidad === 1;
}

function procesarDegustacion(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const comentarios = document.getElementById("comentarios").value;
    const cantidadPersonas = 1;

    const mensajeUI = document.getElementById("mensaje-degustacion");

    if (puedeReservarDegustacion(cantidadPersonas)) {
        mensajeUI.classList.remove("error-hidden");
        mensajeUI.style.color = "#011c57";
        
        let textoExito = `¡Reserva confirmada para ${nombre}! Te enviaremos los detalles de la cata a ${correo}.`;
        if (comentarios.trim() !== "") {
            textoExito += ` Hemos registrado tus observaciones.`;
        }
        mensajeUI.textContent = textoExito;
        
        document.getElementById("form-degustacion").reset();
    } else {
        mensajeUI.classList.remove("error-hidden");
        mensajeUI.style.color = "#8b0000";
        mensajeUI.textContent = "Lo siento, la degustación de variedades está limitada a 1 persona por reserva.";
    }
}