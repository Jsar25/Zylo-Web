document.addEventListener("DOMContentLoaded", function () {

    // === SELECCIÓN DE ELEMENTOS ===
    const formVuelos = document.getElementById("formVuelos");
    const modalContacto = document.getElementById("modalContacto");

    const email = document.getElementById("modalEmail");
    const phone = document.getElementById("modalPhone");

    const btnGuardar = document.getElementById("guardarModal");
    const btnCancelar = document.getElementById("cancelarModal");

    const errorEmail = document.getElementById("errorEmail");
    const errorPhone = document.getElementById("errorPhone");

    const resultadoBusqueda = document.getElementById("resultadoBusqueda");

    // === FUNCIONES DE VALIDACIÓN ===
    function validarEmail(valor) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(valor);
    }

    function validarTelefono(valor) {
        const regexTelefono = /^[0-9]{10}$/;
        return regexTelefono.test(valor);
    }


    // === FUNCIONES DE MENSAJES ===
    function mostrarError(input, errorElement, mensaje) {
        errorElement.textContent = mensaje;
        input.classList.add("input-error");
        input.classList.remove("input-ok");
    }

    function limpiarError(input, errorElement) {
        errorElement.textContent = "";
        input.classList.remove("input-error");
        input.classList.add("input-ok");
    }

    function actualizarBotonGuardar() {
        const emailOk = validarEmail(email.value.trim());
        const phoneOk = validarTelefono(phone.value.trim());

        btnGuardar.disabled = !(emailOk && phoneOk);
    }


    // === VALIDACIÓN EN TIEMPO REAL ===
    email.addEventListener("input", function () {
        if (!validarEmail(email.value.trim())) {
            mostrarError(email, errorEmail, "Correo inválido. Ej: usuario@gmail.com");
        } else {
            limpiarError(email, errorEmail);
        }
        actualizarBotonGuardar();
    });

    phone.addEventListener("input", function () {
        if (!validarTelefono(phone.value.trim())) {
            mostrarError(phone, errorPhone, "Teléfono inválido. Debe tener 10 dígitos numéricos.");
        } else {
            limpiarError(phone, errorPhone);
        }
        actualizarBotonGuardar();
    });


    // === ESTADOS DEL DOM ===
    function mostrarEstadoInicial() {
        resultadoBusqueda.classList.remove("buscando", "resultado");
        resultadoBusqueda.classList.add("inicial");
        resultadoBusqueda.textContent = "Ingresa los datos y realiza tu búsqueda.";
    }

    function mostrarEstadoBuscando(destino) {
        resultadoBusqueda.classList.remove("inicial", "resultado");
        resultadoBusqueda.classList.add("buscando");
        resultadoBusqueda.textContent = `Buscando información de ${destino}...`;
    }

    function mostrarResultado(destino) {
        resultadoBusqueda.classList.remove("inicial", "buscando");
        resultadoBusqueda.classList.add("resultado");

        resultadoBusqueda.innerHTML = `
            <div class="card-resultado">
                <h3>Resultado de búsqueda</h3>
                <p><strong>Destino:</strong> ${destino}</p>
                <p>Hemos encontrado opciones disponibles para tu viaje.</p>
            </div>
        `;
    }


    // === SUBMIT FORM PRINCIPAL ===
    formVuelos.addEventListener("submit", function (event) {
        event.preventDefault();

        modalContacto.style.display = "flex";
        btnGuardar.disabled = true;

        email.value = "";
        phone.value = "";

        errorEmail.textContent = "";
        errorPhone.textContent = "";

        email.classList.remove("input-error", "input-ok");
        phone.classList.remove("input-error", "input-ok");
    });


    // === GUARDAR DATOS DEL MODAL ===
    btnGuardar.addEventListener("click", function () {

        const emailOk = validarEmail(email.value.trim());
        const phoneOk = validarTelefono(phone.value.trim());

        if (!emailOk) {
            mostrarError(email, errorEmail, "Correo inválido. Ej: usuario@gmail.com");
        }

        if (!phoneOk) {
            mostrarError(phone, errorPhone, "Teléfono inválido. Debe tener 10 dígitos.");
        }

        if (emailOk && phoneOk) {
            modalContacto.style.display = "none";

            const destino = document.querySelector("#destino").value;

            mostrarEstadoBuscando(destino);

            setTimeout(() => {
                mostrarResultado(destino);
            }, 2000);

            formVuelos.reset();
        }
    });


    // === CANCELAR MODAL ===
    btnCancelar.addEventListener("click", function () {
        modalContacto.style.display = "none";
    });


    // === ESTADO INICIAL ===
    mostrarEstadoInicial();

});

// === VALIDACIÓN CONTACTO ===
const emailContacto = document.getElementById("emailContacto");
const errorEmailContacto = document.getElementById("errorEmailContacto");

if (emailContacto) {
    emailContacto.addEventListener("input", function () {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexEmail.test(emailContacto.value.trim())) {
            errorEmailContacto.textContent = "Correo inválido. Ej: usuario@gmail.com";
            emailContacto.classList.add("input-error");
            emailContacto.classList.remove("input-ok");
        } else {
            errorEmailContacto.textContent = "";
            emailContacto.classList.remove("input-error");
            emailContacto.classList.add("input-ok");
        }
    });
}
