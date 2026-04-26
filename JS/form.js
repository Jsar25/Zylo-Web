// Variables para funciones del boton swap
const origen = document.getElementById("origen");
const destino = document.getElementById("destino");
const swapBtn = document.querySelector(".swap");


//Función para el boton swap
console.log(swapBtn);
swapBtn.addEventListener("click", () => {
  const temp = origen.value;
  origen.value = destino.value;
  destino.value = temp;
});


// Variables para el tipo de vuelo
const tipoVuelo = document.getElementById("tipoVuelo");
const fechaRegreso = document.getElementById("fechaRegreso");

//Función para el tipo vuelo ida
fechaRegreso.style.display = "none";

tipoVuelo.addEventListener("change", () => {
  if (tipoVuelo.value === "idaVuelta") {
    fechaRegreso.style.display = "block";
  } else {
    fechaRegreso.style.display = "none";
    fechaRegreso.value = "";
  }
});






document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("formVuelos");
  const modal = document.getElementById("modalContacto");

  const email = document.getElementById("modalEmail");
  const phone = document.getElementById("modalPhone");

  const btnCancelar = document.getElementById("cancelarModal");
  const btnGuardar = document.getElementById("guardarModal");

  // DEBUG 
  console.log("modal:", modal);

  if (!modal) {
    console.error("El modal NO existe en el DOM");
    return;
  }

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    modal.style.display = "flex";
  });

  btnCancelar.addEventListener("click", () => {
    modal.style.display = "none";
  });

  btnGuardar.addEventListener("click", () => {

    if (email.value.trim() === "" || phone.value.trim() === "") {
      console.log("Usuario no ingresó datos");
    }

    modal.style.display = "none";
    form.submit();
  });





  // Lógica para enviar a una API
  btnGuardar.addEventListener("click", () => {

    const data = {
      tipoVuelo: document.getElementById("tipoVuelo").value,
      origen: document.getElementById("origen").value,
      destino: document.getElementById("destino").value,
      fechaSalida: document.getElementById("fechaSalida").value,
      fechaRegreso: document.getElementById("fechaRegreso").value,
      pasajeros: document.getElementById("pasajeros").value,
      contacto: {
        email: email.value,
        telefono: phone.value
      }
    };

    console.log("JSON enviado:", data);

    modal.style.display = "none";
    form.requestSubmit();
  });



});