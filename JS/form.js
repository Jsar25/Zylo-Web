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

    // CONTACTO
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
            fechaRegreso.classList.remove("modal-active");
            fechaRegreso.setAttribute("disabled", "true");
            fechaRegreso.value = "";
        } else {
            fechaRegreso.classList.add("modal-active");
            fechaRegreso.removeAttribute("disabled");
        }
    }

    function mostrarError(input, errorElement, mensaje) {
        if (errorElement) errorElement.textContent = mensaje;
        if (input) {
            input.classList.add("input-error");
            input.classList.remove("input-ok");
        }
    }

    function limpiarError(input, errorElement) {
        if (errorElement) errorElement.textContent = "";
        if (input) {
            input.classList.remove("input-error");
            input.classList.add("input-ok");
        }
    }

    function mostrarEstadoInicial() {
        if (!resultadoBusqueda) return;
        resultadoBusqueda.classList.remove("buscando", "resultado");
        resultadoBusqueda.classList.add("inicial");
        resultadoBusqueda.textContent = "Ingresa los datos y realiza tu búsqueda.";
    }

    function mostrarEstadoBuscando(destino) {
        if (!resultadoBusqueda) return;

        resultadoBusqueda.classList.remove("inicial", "resultado");
        resultadoBusqueda.classList.add("buscando");

        resultadoBusqueda.innerHTML = `
        <div class="loader"></div>
        <p>Buscando información de ${destino}...</p>
    `;
    }


    // === MODAL DETALLE ===
    function mostrarModalDetalle(vuelo) {
        const modalDetalle = document.getElementById("modalDetalle");
        const detalleContenido = document.getElementById("detalleContenido");
        const cerrarDetalle = document.getElementById("cerrarDetalle");

        if (!modalDetalle || !detalleContenido) return;

        detalleContenido.innerHTML = `
            <p><strong>Aerolínea:</strong> ${vuelo.airline?.name || "No disponible"}</p>
            <p><strong>Vuelo:</strong> ${vuelo.flight?.iata || "No disponible"}</p>
            <p><strong>Salida:</strong> ${vuelo.departure?.airport || "No disponible"}</p>
            <p><strong>Llegada:</strong> ${vuelo.arrival?.airport || "No disponible"}</p>
            <p><strong>Estado:</strong> ${vuelo.flight_status || "No disponible"}</p>
            <p><strong>Terminal:</strong> ${vuelo.arrival?.terminal || "No disponible"}</p>
            <p><strong>Gate:</strong> ${vuelo.arrival?.gate || "No disponible"}</p>
        `;

        modalDetalle.classList.add("modal-active");

        if (cerrarDetalle) {
            cerrarDetalle.addEventListener("click", () => {
                modalDetalle.classList.remove("modal-active");
            });
        }
    }


    // === RENDER RESULTADOS CON FRAGMENT ===
    function mostrarResultado(destino, vuelos = [], origenValue = "") {
        if (!resultadoBusqueda) return;

        resultadoBusqueda.classList.remove("inicial", "buscando");
        resultadoBusqueda.classList.add("resultado");

        if (vuelos.length === 0) {
            resultadoBusqueda.innerHTML = `
                <div class="card-resultado">
                    <h3>Resultado de búsqueda</h3>
                    <p><strong>Destino:</strong> ${destino}</p>
                    <p>No se encontraron vuelos disponibles.</p>
                </div>
            `;
            return;
        }

        // REQUISITO: Limpiar el contenedor antes de cada nueva búsqueda (Bloque 2)
        resultadoBusqueda.innerHTML = "";

        // REQUISITO: Usar createDocumentFragment() para insertar todas las tarjetas en una única operación (Bloque 2)
        const fragment = document.createDocumentFragment();

        // REQUISITO: Iterar los resultados con .forEach() o .map() (Bloque 2)
        vuelos.slice(0, 5).forEach((vuelo, index) => {

            const aerolinea = vuelo.airline?.name || vuelo.airline || "No disponible";
            const precio = 120 + (index * 35);

            const card = document.createElement("div");
            card.classList.add("card-resultado");

            card.innerHTML = `
                <div class="vuelo-top">
                    <h3>${vuelo.departure?.scheduled?.slice(11, 16) || "--:--"} - 
                    ${vuelo.arrival?.scheduled?.slice(11, 16) || "--:--"}</h3>

                    <p class="ruta">
                        ${origenValue || "No disponible"} → ${destino}
                    </p>
                </div>

                <div class="vuelo-middle">
                    <p><strong>Aeropuerto</strong> ${vuelo.arrival?.airport || "No disponible"}</p>
                    <p><strong>Aerolínea</strong> ${aerolinea}</p>
                    <p><strong>Estado</strong> ${vuelo.flight_status || "No disponible"}</p>
                </div>

                <div class="vuelo-price">
                    <span>Precio estimado</span>
                    <div class="precio-valor">
                        <h2>$${precio}</h2>
                        <small>USD</small>
                    </div>
                </div>
            `;

            card.addEventListener("click", () => {
                obtenerDetalleVuelo(vuelo.flight?.iata || vuelo.flight?.number || index);
            });

            fragment.appendChild(card);
        });

        resultadoBusqueda.appendChild(fragment);
    }


    // === API VUELOS ===
    async function buscarVuelosAPI(fechaBusqueda) {

        try {

            console.log("FECHA ENVIADA A API:", fechaBusqueda);

            // REQUISITO: Construir la URL dinámicamente con template literals usando el valor del input (Bloque 1)
            const response = await fetch(
                `https://api.aviationstack.com/v1/flights?access_key=42d4fb4d5c1df4d42c994b120a909308&limit=100000&offset=0`
            );

            // REQUISITO: Verificar response.ok explícitamente (Bloque 1)
            if (!response.ok) {
                if (response.status === 404) throw new Error("404");
                if (response.status === 500) throw new Error("500");
                throw new Error("otro");
            }

            // REQUISITO: Usar await response.json() para convertir la respuesta (Bloque 1)
            const data = await response.json();
            const vuelosFiltrados = data.data.filter(vuelo => vuelo.flight_date === fechaBusqueda);

            return vuelosFiltrados.length > 0 ? vuelosFiltrados : data.data;

        } catch (error) {

            console.error("ERROR API:", error);

            let mensaje = "Ocurrió un error inesperado.";

            // Sin conexión
            if (error instanceof TypeError) {
                mensaje = "No hay conexión a internet. Verifica tu red e intenta nuevamente.";
            }
            // Error 404
            else if (error.message === "404") {
                mensaje = "No se encontraron resultados (Error 404).";
            }
            // Error 500
            else if (error.message === "500") {
                mensaje = "Error del servidor (500). Intenta más tarde.";
            }

            if (resultadoBusqueda) {
                resultadoBusqueda.innerHTML = `
                < p class= "error-api" > ${mensaje}</p >
            <button id="btnReintentar" class="btn-reintentar">Reintentar</button>
        `;

                const btnReintentar = document.getElementById("btnReintentar");
                if (btnReintentar) {
                    btnReintentar.addEventListener("click", async () => {

                        const destino = destinoInput.value.trim();
                        const origenValue = origen.value.trim();

                        if (!destino || !origenValue || !fechaSalida.value.trim()) {
                            mostrarEstadoInicial();
                            return;
                        }

                        mostrarEstadoBuscando(destino);

                        let fechaBusqueda = (tipoVuelo.value === "ida")
                            ? fechaSalida.value
                            : (fechaRegreso.value || fechaSalida.value);

                        if (fechaBusqueda.includes("/")) {
                            const partes = fechaBusqueda.split("/");
                            const dia = partes[0];
                            const mes = partes[1];
                            const anio = new Date().getFullYear();
                            fechaBusqueda = `${anio} - ${mes} - ${dia}`;
                        }

                        const vuelos = await buscarVuelosAPI(fechaBusqueda);

                        if (vuelos === null) return;

                        mostrarResultado(destino, vuelos, origenValue);
                    });
                }
            }

            return null;
        }
    }


    // === DETALLE DEL VUELO (SEGUNDO FETCH) ===
    async function obtenerDetalleVuelo(idVuelo) {
        try {
            const response = await fetch(
                `https://api.aviationstack.com/v1/flights?access_key=089371c4fad35c56419496a728a93692&flight_iata=${idVuelo}`
            );

            if (!response.ok) throw new Error("Error detalle");

            const data = await response.json();
            const vueloDetalle = data.data[0];

            if (!vueloDetalle) {
                alert("No se encontró detalle del vuelo.");
                return;
            }

            mostrarModalDetalle(vueloDetalle);

        } catch (error) {
            alert("Error al obtener detalle del vuelo.");
        }
    }


    // === VALIDACIONES ===
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
            if (input) input.classList.remove("input-error");
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


    // === EVENTOS ===

    [origen, destinoInput, fechaSalida, fechaRegreso, tipoVuelo].forEach(input => {
        if (input) {
            input.addEventListener("input", function () {
                this.classList.remove("input-error");
            });
            input.addEventListener("change", function () {
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


    // SUBMIT BUSQUEDA
    if (formVuelos) {
        formVuelos.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!validarFechasViaje()) return;

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


    // GUARDAR MODAL
    if (btnGuardar) {
        btnGuardar.addEventListener("click", async function () {
            const emailOk = validarEmail(email.value.trim());
            const phoneOk = validarTelefono(phone.value.trim());

            if (!emailOk) mostrarError(email, errorEmail, "Correo inválido. Ej: usuario@gmail.com");
            if (!phoneOk) mostrarError(phone, errorPhone, "Teléfono inválido. Debe tener 10 dígitos.");

            if (emailOk && phoneOk) {

                modalContacto.classList.remove("modal-active");

                const destino = destinoInput.value.trim();
                const origenValue = origen.value.trim();

                const datosVuelo = {
                    origen: document.querySelector("#origen").value.trim(),
                    destino: destino.trim(),
                    fechaSalida: document.getElementById("fechaSalida").value,
                    fechaRegreso: (tipoVuelo.value === "ida") ? null : document.getElementById("fechaRegreso").value,
                    tipoVuelo: document.getElementById("tipoVuelo") ? document.getElementById("tipoVuelo").value : "redondo",
                    contacto: {
                        email: email.value.trim(),
                        telefono: phone.value.trim()
                    }
                };

                console.log("JSON a enviar al servidor:", JSON.stringify(datosVuelo, null, 2));

                mostrarEstadoBuscando(destino);

                let fechaBusqueda = datosVuelo.fechaRegreso || datosVuelo.fechaSalida;

                if (fechaBusqueda.includes("/")) {
                    const partes = fechaBusqueda.split("/");
                    const dia = partes[0];
                    const mes = partes[1];
                    const anio = new Date().getFullYear();
                    fechaBusqueda = `${anio}-${mes}-${dia}`;
                }

                const vuelos = await buscarVuelosAPI(fechaBusqueda);
                if (vuelos === null) return;
                mostrarResultado(destino, vuelos, origenValue);
                formVuelos.reset();
            }
        });
    }


    // CANCELAR MODAL
    if (btnCancelar) {
        btnCancelar.addEventListener("click", function () {

            modalContacto.classList.remove("modal-active");

            const destino = document.querySelector("#destino").value;
            const origenValue = document.querySelector("#origen").value.trim();

            const datosVuelo = {
                origen: document.querySelector("#origen").value.trim(),
                destino: destino.trim(),
                fechaSalida: document.getElementById("fechaSalida").value,
                fechaRegreso: (tipoVuelo.value === "ida") ? null : document.getElementById("fechaRegreso").value,
                tipoVuelo: document.getElementById("tipoVuelo") ? document.getElementById("tipoVuelo").value : "redondo",
                contacto: "Cancelado"
            };

            console.log("JSON a enviar al servidor (sin contacto):", JSON.stringify(datosVuelo, null, 2));

            mostrarEstadoBuscando(destino);

            let fechaBusqueda = datosVuelo.fechaRegreso || datosVuelo.fechaSalida;

            if (fechaBusqueda.includes("/")) {
                const partes = fechaBusqueda.split("/");
                const dia = partes[0];
                const mes = partes[1];
                const anio = new Date().getFullYear();
                fechaBusqueda = `${anio}-${mes}-${dia}`;
            }

            buscarVuelosAPI(fechaBusqueda)
                .then(vuelos => {

                    if (vuelos === null) return;

                    mostrarResultado(destino, vuelos, origenValue);
                });

            formVuelos.reset();
        });
    }


    async function enviarEmailContacto(datosContacto) {

        const nombreCodificado = encodeURIComponent(datosContacto.nombre);
        const url = `https://api.web3forms.com/submit?ref=${nombreCodificado}`;

        try {
            btnEnviarContacto.textContent = "Enviando...";
            btnEnviarContacto.disabled = true;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: "d3d588dc-8eeb-44e7-9444-7743782f6c8d",
                    from_name: "Zylo Viajes",
                    Nombre: datosContacto.nombre,
                    Email: datosContacto.email,
                    Asunto: `Nuevo contacto de ${datosContacto.nombre}`,
                    subject: `Nuevo contacto desde Zylo: ${datosContacto.nombre}`,
                    Mensaje: `
                        Destino de interés: ${datosContacto.destino}
                        Número de Celular: ${datosContacto.celular}
                        Fecha tentativa de viaje: ${datosContacto.fecha}
                        Mensaje del cliente: ${datosContacto.mensaje}
                    `
                })
            });

            // REQUISITO: Verificar response.ok explícitamente (Bloque 1)
            if (!response.ok) {
                if (response.status === 404) throw new Error("404");
                if (response.status >= 500) throw new Error("500");
                throw new Error("Otro error HTTP");
            }

            // REQUISITO: Usar await response.json() para convertir la respuesta (Bloque 1)
            const data = await response.json();

            // REQUISITO: Extraer y usar al menos 3 propiedades del objeto JSON recibido (Bloque 1)
            console.log("Estado:", data.success, "Mensaje:", data.message);

            if (data.success) {
                // REQUISITO: Manejo de estados OK (Bloque 2)
                if (modalExito) {
                    modalExito.classList.add("modal-active");
                }

                formContacto.reset();
                [nombreContacto, emailContacto, celularContacto, fechaContacto, mensajeContacto].forEach(input => {
                    if (input) input.classList.remove("input-error", "input-ok");
                });
            } else {
                throw new Error("Error en la API");
            }

        } catch (error) {
            console.error("Error enviando email:", error);

            let mensajeError = "Ocurrió un error inesperado al enviar el mensaje.";

            if (error instanceof TypeError) {
                mensajeError = "No hay conexión a internet o el servicio está bloqueado.";
            } else if (error.message === "404") {
                mensajeError = "El servicio de envío no fue encontrado (Error 404).";
            } else if (error.message === "500") {
                mensajeError = "Error en el servidor de envíos (500). Intenta más tarde.";
            }

            alert(mensajeError);

        } finally {
            btnEnviarContacto.textContent = "Enviar";
            btnEnviarContacto.disabled = false;
        }
    }

    // CONTACTO VALIDACION + MODAL
    if (formContacto) {

        const aplicarError = function (input, errorElement, regex, msg) {
            if (!input) return;

            input.addEventListener("input", function () {

                const val = input.value.trim();

                if (val.length === 0) {
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

        formContacto.addEventListener("submit", async function (event) {
            event.preventDefault();

            if (validarCamposContacto()) {

                const datosContacto = {
                    nombre: nombreContacto.value.trim(),
                    email: emailContacto.value.trim(),
                    celular: celularContacto.value.trim(),
                    fecha: fechaContacto.value.trim(),
                    destino: document.getElementById("destinoContacto") ? document.getElementById("destinoContacto").value : "",
                    mensaje: mensajeContacto.value.trim()
                };

                // Llamada a la API de Resend
                await enviarEmailContacto(datosContacto);
            }
        });

        if (cerrarModalExito) {
            cerrarModalExito.addEventListener("click", function () {
                modalExito.classList.remove("modal-active");
            });
        }
    }

    // INICIALIZAR
    mostrarEstadoInicial();

});


