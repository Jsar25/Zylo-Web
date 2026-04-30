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

    const formContacto = document.getElementById("formContacto");
    const nombreContacto = document.getElementById("nombreContacto");
    const emailContacto = document.getElementById("emailContacto");
    const celularContacto = document.getElementById("celularContacto");
    const fechaContacto = document.getElementById("fechaContacto");
    const mensajeContacto = document.getElementById("mensajeContacto");
    const errorNombreContacto = document.getElementById("errorNombreContacto");
    const errorEmailContacto = document.getElementById("errorEmailContacto");
    const errorCelularContacto = document.getElementById("errorCelularContacto");
    const errorFechaContacto = document.getElementById("errorFechaContacto");
    const errorMensajeContacto = document.getElementById("errorMensajeContacto");
    const btnEnviarContacto = document.getElementById("btnEnviarContacto");
    const modalExito = document.getElementById("modalExito");
    const cerrarModalExito = document.getElementById("cerrarModalExito");


    // === FUNCIONES DE RENDERIZADO ===
    function actualizarVisibilidadRegreso() {
        if (!tipoVuelo || !fechaRegreso) return;
        if (tipoVuelo.value === "ida") {
            fechaRegreso.classList.remove("modal-active"); // Se usa en vez de style
            fechaRegreso.setAttribute("disabled", "true");
            fechaRegreso.value = "";
        } else {
            fechaRegreso.classList.add("modal-active");
            fechaRegreso.removeAttribute("disabled");
        }
    }

    function mostrarError(input, errorElement, mensaje) {
        if(errorElement) errorElement.textContent = mensaje;
        if(input) {
            input.classList.add("input-error");
            input.classList.remove("input-ok");
        }
    }

    function limpiarError(input, errorElement) {
        if(errorElement) errorElement.textContent = "";
        if(input) {
            input.classList.remove("input-error");
            input.classList.add("input-ok");
        }
    }

    function mostrarEstadoInicial() {
        if(!resultadoBusqueda) return;
        resultadoBusqueda.classList.remove("buscando", "resultado");
        resultadoBusqueda.classList.add("inicial");
        resultadoBusqueda.textContent = "Ingresa los datos y realiza tu búsqueda.";
    }

    function mostrarEstadoBuscando(destino) {
        if(!resultadoBusqueda) return;
        resultadoBusqueda.classList.remove("inicial", "resultado");
        resultadoBusqueda.classList.add("buscando");
        resultadoBusqueda.textContent = `Buscando información de ${destino}...`;
    }

    function mostrarResultado(destino) {
        if(!resultadoBusqueda) return;
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

    function actualizarBotonGuardar() {
        if (!email || !phone || !btnGuardar) return;
        const emailOk = validarEmail(email.value.trim());
        const phoneOk = validarTelefono(phone.value.trim());
        btnGuardar.disabled = !(emailOk && phoneOk);
    }

    function validarCamposContacto() {
        let esValido = true;
        
        const campos = [
            { el: nombreContacto, errEl: errorNombreContacto, regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/, msg: "Mínimo 3 letras." },
            { el: emailContacto, errEl: errorEmailContacto, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: "Correo inválido. Ej: usuario@gmail.com" },
            { el: celularContacto, errEl: errorCelularContacto, regex: /^[0-9]{10}$/, msg: "El celular debe coincidir con formato 09XXXXXXXX (10 dígitos)" },
            { el: fechaContacto, errEl: errorFechaContacto, regex: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, msg: "Formato inválido. Ejemplo: 15/08/2026" },
            { el: mensajeContacto, errEl: errorMensajeContacto, regex: /^.{10,}$/, msg: "Mínimo 10 caracteres." }
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

        if (btnEnviarContacto) {
            btnEnviarContacto.disabled = !esValido;
        }

        return esValido;
    }


    // === ESCUCHADORES DE EVENTOS ===

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

    if (btnSwap) {
        btnSwap.addEventListener("click", function () {
            const temp = origen.value;
            origen.value = destinoInput.value;
            destinoInput.value = temp;
        });
    }

    if (tipoVuelo) {
        tipoVuelo.addEventListener("change", actualizarVisibilidadRegreso);
        actualizarVisibilidadRegreso();
    }

    if (email) {
        email.addEventListener("input", function () {
            if (!validarEmail(email.value.trim())) {
                mostrarError(email, errorEmail, "Correo inválido. Ej: usuario@gmail.com");
            } else {
                limpiarError(email, errorEmail);
            }
            actualizarBotonGuardar();
        });
    }

    if (phone) {
        phone.addEventListener("input", function () {
            if (!validarTelefono(phone.value.trim())) {
                mostrarError(phone, errorPhone, "Teléfono inválido. Debe tener 10 dígitos numéricos.");
            } else {
                limpiarError(phone, errorPhone);
            }
            actualizarBotonGuardar();
        });
    }

    if (formVuelos) {
        formVuelos.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!validarFechasViaje()) {
                return;
            }

            modalContacto.classList.add("modal-active");
            btnGuardar.disabled = true;

            email.value = "";
            phone.value = "";

            errorEmail.textContent = "";
            errorPhone.textContent = "";

            email.classList.remove("input-error", "input-ok");
            phone.classList.remove("input-error", "input-ok");
        });
    }

    if (btnGuardar) {
        btnGuardar.addEventListener("click", function () {
            const emailOk = validarEmail(email.value.trim());
            const phoneOk = validarTelefono(phone.value.trim());

            if (!emailOk) mostrarError(email, errorEmail, "Correo inválido. Ej: usuario@gmail.com");
            if (!phoneOk) mostrarError(phone, errorPhone, "Teléfono inválido. Debe tener 10 dígitos.");

            if (emailOk && phoneOk) {
                modalContacto.classList.remove("modal-active");

                // Recopilar datos JSON usando querySelector en destino como pide la rúbrica
                const destino = document.querySelector("#destino").value;
                const datosVuelo = {
                    origen: document.querySelector("#origen").value.trim(),
                    destino: destino.trim(),
                    fechaSalida: document.getElementById("fechaSalida").value,
                    fechaRegreso: document.getElementById("fechaRegreso") ? document.getElementById("fechaRegreso").value : null,
                    tipoVuelo: document.getElementById("tipoVuelo") ? document.getElementById("tipoVuelo").value : "redondo",
                    contacto: {
                        email: email.value.trim(),
                        telefono: phone.value.trim()
                    }
                };
                console.log("JSON a enviar al servidor:", JSON.stringify(datosVuelo, null, 2));

                mostrarEstadoBuscando(destino);

                setTimeout(() => {
                    mostrarResultado(destino);
                }, 2000);

                formVuelos.reset();
            }
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener("click", function () {
            modalContacto.classList.remove("modal-active");
            
            const destino = document.querySelector("#destino").value;
            const datosVuelo = {
                origen: document.querySelector("#origen").value.trim(),
                destino: destino.trim(),
                fechaSalida: document.getElementById("fechaSalida").value,
                fechaRegreso: document.getElementById("fechaRegreso") ? document.getElementById("fechaRegreso").value : null,
                tipoVuelo: document.getElementById("tipoVuelo") ? document.getElementById("tipoVuelo").value : "redondo",
                contacto: "Cancelado"
            };
            console.log("JSON a enviar al servidor (sin contacto):", JSON.stringify(datosVuelo, null, 2));

            mostrarEstadoBuscando(destino);

            setTimeout(() => {
                mostrarResultado(destino);
            }, 2000);

            formVuelos.reset();
        });
    }

    // Eventos Contacto
    if (formContacto) {
        const aplicarError = function(input, errorElement, regex, msg) {
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
                validarCamposContacto();
            });
        };

        aplicarError(nombreContacto, errorNombreContacto, /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/, "Mínimo 3 letras.");
        aplicarError(emailContacto, errorEmailContacto, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Correo inválido. Ej: usuario@gmail.com");
        aplicarError(celularContacto, errorCelularContacto, /^[0-9]{10}$/, "10 dígitos requeridos.");
        aplicarError(fechaContacto, errorFechaContacto, /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, "Formato inválido.");
        aplicarError(mensajeContacto, errorMensajeContacto, /^.{10,}$/, "El mensaje debe tener al menos 10 caracteres.");

        formContacto.addEventListener("submit", function(event) {
            event.preventDefault(); // Evitar recargar la página

            if (validarCamposContacto()) {
                const datosContacto = {
                    nombre: nombreContacto.value.trim(),
                    email: emailContacto.value.trim(),
                    celular: celularContacto.value.trim(),
                    fecha: fechaContacto.value.trim(),
                    destino: document.getElementById("destinoContacto") ? document.getElementById("destinoContacto").value : "",
                    mensaje: mensajeContacto.value.trim()
                };
                
                console.log("JSON a enviar al servidor (Contacto):", JSON.stringify(datosContacto, null, 2));
                
                if (modalExito) {
                    modalExito.classList.add("modal-active");
                }
                formContacto.reset();
                [nombreContacto, emailContacto, celularContacto, fechaContacto, mensajeContacto].forEach(input => {
                    if (input) input.classList.remove("input-error", "input-ok");
                });
            }
        });

        if (cerrarModalExito) {
            cerrarModalExito.addEventListener("click", function() {
                modalExito.classList.remove("modal-active");
            });
        }
    }

    // Inicializar la vista por defecto
    mostrarEstadoInicial();
});
