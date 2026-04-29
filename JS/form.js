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


    const fechaSalida = document.getElementById("fechaSalida");
    const fechaRegreso = document.getElementById("fechaRegreso");
    const tipoVuelo = document.getElementById("tipoVuelo");
    const origen = document.getElementById("origen");
    const destinoInput = document.getElementById("destino");

    const resultadoBusqueda = document.getElementById("resultadoBusqueda");
    const btnSwap = document.querySelector(".swap");

    if (btnSwap) {
        btnSwap.addEventListener("click", function () {
            const temp = origen.value;
            origen.value = destinoInput.value;
            destinoInput.value = temp;
        });
    }

    function actualizarVisibilidadRegreso() {
        if (!tipoVuelo || !fechaRegreso) return;
        if (tipoVuelo.value === "ida") {
            fechaRegreso.style.display = "none";
            fechaRegreso.value = "";
        } else {
            fechaRegreso.style.display = "inline-block";
        }
    }

    if (tipoVuelo) {
        tipoVuelo.addEventListener("change", actualizarVisibilidadRegreso);
        actualizarVisibilidadRegreso();
    }

    // === FUNCIONES DE VALIDACIÓN ===
    function validarEmail(valor) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(valor);
    }

    function validarTelefono(valor) {
        const regexTelefono = /^[0-9]{10}$/;
        return regexTelefono.test(valor);
    }

    function validarFechasViaje() {
        let esValido = true;
        
        const inputsAValidar = [origen, destinoInput, fechaSalida];
        if (tipoVuelo && tipoVuelo.value !== "ida") {
            inputsAValidar.push(fechaRegreso);
        }

        [origen, destinoInput, fechaSalida, fechaRegreso].forEach(input => {
             if(input) input.classList.remove("input-error");
        });
        
        inputsAValidar.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add("input-error");
                esValido = false;
            }
        });

        return esValido;
    }

    // Remover error rojo al escribir
    [origen, destinoInput, fechaSalida, fechaRegreso, tipoVuelo].forEach(input => {
        if (input) {
            input.addEventListener("input", function() {
                this.classList.remove("input-error");
            });
            input.addEventListener("change", function() {
                this.classList.remove("input-error");
            });
        }
    });


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
                <button type="button" id="btnNuevaBusqueda" style="margin-top: 15px; width: auto; padding: 10px 20px;">Nueva Búsqueda</button>
            </div>
        `;
        
        document.getElementById("btnNuevaBusqueda").addEventListener("click", function() {
            mostrarEstadoInicial();
        });
    }


    // === SUBMIT FORM PRINCIPAL ===
    if (formVuelos) {
        formVuelos.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!validarFechasViaje()) {
                return;
            }

            modalContacto.style.display = "flex";
            btnGuardar.disabled = true;

            email.value = "";
            phone.value = "";

            errorEmail.textContent = "";
            errorPhone.textContent = "";

            email.classList.remove("input-error", "input-ok");
            phone.classList.remove("input-error", "input-ok");
        });
    }


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
// === VALIDACIÓN CONTACTO ===
const formContacto = document.getElementById("formContacto");
const nombreContacto = document.getElementById("nombreContacto");
const emailContacto = document.getElementById("emailContacto");
const mensajeContacto = document.getElementById("mensajeContacto");

const errorNombreContacto = document.getElementById("errorNombreContacto");
const errorEmailContacto = document.getElementById("errorEmailContacto");
const errorMensajeContacto = document.getElementById("errorMensajeContacto");

const modalExito = document.getElementById("modalExito");
const cerrarModalExito = document.getElementById("cerrarModalExito");

if (formContacto) {

    function aplicarError(input, errorElement, regex, msg) {
        if (!input) return;
        input.addEventListener("input", function() {
            const val = input.value.trim();
            if(val.length === 0) {
                if (errorElement) errorElement.textContent = "Este campo es requerido.";
                input.classList.add("input-error");
                input.classList.remove("input-ok");
            } else if (!regex.test(val)) {
                if (errorElement) errorElement.textContent = msg;
                input.classList.add("input-error");
                input.classList.remove("input-ok");
            } else {
                if (errorElement) errorElement.textContent = "";
                input.classList.remove("input-error");
                input.classList.add("input-ok");
            }
        });
    }

    aplicarError(nombreContacto, errorNombreContacto, /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras permitidas.");
    aplicarError(emailContacto, errorEmailContacto, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Correo inválido. Ej: usuario@gmail.com");
    aplicarError(mensajeContacto, errorMensajeContacto, /^.{10,}$/, "El mensaje debe tener al menos 10 caracteres.");

    function validarCamposContacto() {
        let esValido = true;
        
        const campos = [
            { el: nombreContacto, errEl: errorNombreContacto, regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, msg: "Solo letras permitidas." },
            { el: emailContacto, errEl: errorEmailContacto, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: "Correo inválido. Ej: usuario@gmail.com" },
            { el: mensajeContacto, errEl: errorMensajeContacto, regex: /^.{10,}$/, msg: "El mensaje debe tener al menos 10 caracteres." }
        ];

        campos.forEach(campo => {
            if (!campo.el) return;
            const val = campo.el.value.trim();
            if (val.length === 0) {
                if (campo.errEl) campo.errEl.textContent = "Este campo es requerido.";
                campo.el.classList.add("input-error");
                esValido = false;
            } else if (!campo.regex.test(val)) {
                if (campo.errEl) campo.errEl.textContent = campo.msg;
                campo.el.classList.add("input-error");
                esValido = false;
            }
        });

        return esValido;
    }

    formContacto.addEventListener("submit", function(event) {
        event.preventDefault(); // Evitar recargar la página

        if (validarCamposContacto()) {
            // Mostrar modal de éxito
            if (modalExito) {
                modalExito.style.display = "flex";
            }
            formContacto.reset();
            [nombreContacto, emailContacto, mensajeContacto].forEach(input => {
                if (input) input.classList.remove("input-error", "input-ok");
            });
        }
    });

    if (cerrarModalExito) {
        cerrarModalExito.addEventListener("click", function() {
            modalExito.style.display = "none";
        });
    }
}
