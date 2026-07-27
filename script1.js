function calcularPrecio(precioUnitario, cantidad) {
    const total = precioUnitario * cantidad; 
    return total;
}

//function puedeReservar(cantidad) {
//  return cantidad <=2;
//}
function puedeReservar(tazasDisponibles) {
    return tazasDisponibles > 0;
}
//const botonReservar = document.querySelector("#botón-reservar");

//    botonReservar.addEventListener("click", function () {
//        console.log("El usuario hizo clic");
//    });

const botonReservar = document.querySelector("#boton-reservar");
const botonReservar = document.querySelector("#contador-tazas");

botonReservar.addEventListener("click", function () {
   const tazasActuales = Number(contadorTazas.textContent);

   if (puedeReservar (tazasActuales)) {
    contadorTazas.textContent = tazasActuales - 1;
   } else {
     botonReservar.textContent = "No hay cupo";
     botonReservar.disabled = true;
   }
    });


