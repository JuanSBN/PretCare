// scriptpago.js - Versión corregida y simplificada
document.addEventListener('DOMContentLoaded', function() {
    console.log('PetCare AI - Página de pago cargada');
    
    // ===== MODO OSCURO =====
    const modoOscuroToggle = document.getElementById('modoOscuroToggle');
    if (modoOscuroToggle) {
        if (localStorage.getItem('modoOscuro') === 'true') {
            document.body.classList.add('modo-oscuro');
            modoOscuroToggle.checked = true;
        }
        
        modoOscuroToggle.addEventListener('change', function() {
            document.body.classList.toggle('modo-oscuro');
            localStorage.setItem('modoOscuro', document.body.classList.contains('modo-oscuro'));
        });
    }

    // ===== DETECTAR TIPO DE PRODUCTO =====
    const urlParams = new URLSearchParams(window.location.search);
    const producto = urlParams.get('producto');
    const plan = urlParams.get('plan');
    
    if (producto === 'suscripcion' && plan) {
        console.log('Es una suscripción:', plan);
        configurarParaSuscripcion(plan);
    } else {
        console.log('Es una compra de dispositivo');
    }

    // ===== CONFIGURAR FORMULARIOS =====
    const formularioEnvio = document.getElementById('formularioEnvio');
    const formularioTarjeta = document.getElementById('formularioTarjeta');
    
    if (formularioEnvio) {
        console.log('Formulario de envío encontrado');
        formularioEnvio.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulario de envío enviado');
            
            if (validarFormularioEnvio()) {
                console.log('Formulario válido, mostrando tarjeta');
                mostrarFormularioTarjeta();
            } else {
                console.log('Formulario inválido');
            }
        });
    } else {
        console.log('Formulario de envío NO encontrado');
    }
    
    if (formularioTarjeta) {
        formularioTarjeta.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validarFormularioTarjeta()) {
                procesarPagoTarjeta();
            }
        });
    }

    // ===== CONFIGURAR BOTÓN "SUSCRIBIRSE AHORA" ESPECÍFICAMENTE =====
    const btnContinuar = document.querySelector('.btn-continuar');
    if (btnContinuar && btnContinuar.textContent.includes('Suscribirse')) {
        console.log('Botón "Suscribirse Ahora" encontrado');
        
        // Reemplazar el botón para evitar problemas de eventos duplicados
        const nuevoBoton = btnContinuar.cloneNode(true);
        btnContinuar.parentNode.replaceChild(nuevoBoton, btnContinuar);
        
        nuevoBoton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botón Suscribirse Ahora clickeado');
            
            if (validarFormularioEnvio()) {
                console.log('Formulario válido, mostrando tarjeta');
                mostrarFormularioTarjeta();
            }
        });
    }

    // Configurar máscaras de entrada
    configurarMascaras();
});

// ===== CONFIGURACIÓN PARA SUSCRIPCIÓN =====
function configurarParaSuscripcion(plan) {
    console.log('Configurando para suscripción:', plan);
    
    // Ocultar campos de envío
    const camposEnvio = ['direccion', 'ciudad', 'codigoPostal', 'pais', 'instrucciones'];
    camposEnvio.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) {
            elemento.closest('.form-grupo').style.display = 'none';
        }
    });
    
    // Actualizar el resumen para suscripción
    actualizarResumenSuscripcion(plan);
    
    // Cambiar textos para suscripción
    const tituloForm = document.querySelector('#formulario-envio h2');
    if (tituloForm) tituloForm.textContent = 'Información de Suscripción';
    
    const btnContinuar = document.querySelector('.btn-continuar');
    if (btnContinuar) btnContinuar.textContent = 'Suscribirse Ahora';
    
    // Ocultar sección de envío en el resumen
    const infoEnvio = document.getElementById('info-envio');
    if (infoEnvio) infoEnvio.style.display = 'none';
    
    // Actualizar pasos del proceso
    const pasos = document.querySelectorAll('.paso');
    if (pasos.length >= 4) {
        pasos[0].textContent = '1. Plan';
        pasos[1].textContent = '2. Información';
        pasos[2].textContent = '3. Pago';
        pasos[3].textContent = '4. Activación';
    }
}

function actualizarResumenSuscripcion(plan) {
    const precios = {
        'basico': { precio: 9.99, nombre: 'Plan Básico' },
        'premium': { precio: 19.99, nombre: 'Plan Premium' },
        'anual': { precio: 179.99, nombre: 'Plan Anual' }
    };
    
    const planInfo = precios[plan];
    if (!planInfo) return;
    
    // Actualizar resumen
    const productoResumen = document.querySelector('.producto-resumen');
    if (productoResumen) {
        const h3 = productoResumen.querySelector('h3');
        const p = productoResumen.querySelector('p');
        const precio = productoResumen.querySelector('.precio');
        
        if (h3) h3.textContent = planInfo.nombre;
        if (p) p.textContent = 'Suscripción PetCare AI+';
        if (precio) precio.textContent = `$${planInfo.precio}`;
    }
    
    // Actualizar totales
    const filaSubtotal = document.querySelector('.fila-total:nth-child(1)');
    if (filaSubtotal) {
        filaSubtotal.querySelector('span:last-child').textContent = `$${planInfo.precio}`;
    }
    
    const filaEnvio = document.querySelector('.fila-total:nth-child(2)');
    if (filaEnvio) {
        filaEnvio.style.display = 'none';
    }
    
    const filaTotal = document.querySelector('.total');
    if (filaTotal) {
        filaTotal.querySelector('span:last-child').textContent = `$${planInfo.precio}`;
    }
    
    // Cambiar texto del botón de pago si existe
    const btnPagar = document.querySelector('.btn-pagar');
    if (btnPagar) {
        btnPagar.textContent = `Pagar $${planInfo.precio}`;
    }
}

// ===== VALIDACIÓN DE FORMULARIOS =====
function validarFormularioEnvio() {
    console.log('Validando formulario de envío');
    
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono');
    
    // Detectar si es suscripción
    const urlParams = new URLSearchParams(window.location.search);
    const esSuscripcion = urlParams.get('producto') === 'suscripcion';
    
    limpiarErrores();
    
    let esValido = true;
    
    // Validar nombre
    if (!nombre || !nombre.value.trim()) {
        mostrarErrorCampo('nombre', 'El nombre completo es obligatorio');
        esValido = false;
    }
    
    // Validar email
    if (!email || !email.value.trim()) {
        mostrarErrorCampo('email', 'El correo electrónico es obligatorio');
        esValido = false;
    } else if (!validarEmail(email.value)) {
        mostrarErrorCampo('email', 'Por favor, ingresa un email válido');
        esValido = false;
    }
    
    // Validar teléfono (solo si no es suscripción)
    if (!esSuscripcion) {
        if (!telefono || !telefono.value.trim()) {
            mostrarErrorCampo('telefono', 'El teléfono es obligatorio');
            esValido = false;
        } else if (!validarTelefono(telefono.value)) {
            mostrarErrorCampo('telefono', 'El teléfono debe tener al menos 10 dígitos');
            esValido = false;
        }
    }
    
    // Validar campos de envío (solo si no es suscripción)
    if (!esSuscripcion) {
        const camposEnvio = ['direccion', 'ciudad', 'codigoPostal', 'pais'];
        camposEnvio.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (elemento && !elemento.value.trim()) {
                mostrarErrorCampo(campo, `El campo ${campo} es obligatorio`);
                esValido = false;
            }
        });
    }
    
    console.log('Formulario válido:', esValido);
    return esValido;
}

function mostrarFormularioTarjeta() {
    console.log('Mostrando formulario de tarjeta');
    
    // Ocultar formulario de envío
    const formularioEnvio = document.getElementById('formulario-envio');
    if (formularioEnvio) {
        formularioEnvio.style.display = 'none';
    }
    
    // Mostrar formulario de tarjeta
    const formularioTarjeta = document.getElementById('formulario-tarjeta');
    if (formularioTarjeta) {
        formularioTarjeta.style.display = 'block';
    }
    
    // Actualizar pasos del proceso
    const pasoEnvio = document.getElementById('paso-envio');
    const pasoPago = document.getElementById('paso-pago');
    
    if (pasoEnvio) pasoEnvio.classList.remove('activo');
    if (pasoPago) pasoPago.classList.add('activo');
    
    // Desplazar la vista al formulario de tarjeta
    if (formularioTarjeta) {
        formularioTarjeta.scrollIntoView({ behavior: 'smooth' });
    }
    
    console.log('Formulario de tarjeta mostrado');
}

// ===== FUNCIONES DE VALIDACIÓN =====
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validarTelefono(telefono) {
    const digitos = telefono.replace(/\D/g, '');
    return digitos.length >= 10;
}

function mostrarErrorCampo(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    if (!campo) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-campo';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.3rem';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${mensaje}`;
    
    campo.parentNode.appendChild(errorDiv);
    campo.style.borderColor = '#e74c3c';
}

function limpiarErrores() {
    const errores = document.querySelectorAll('.error-campo');
    errores.forEach(error => error.remove());
    
    const campos = document.querySelectorAll('input, select, textarea');
    campos.forEach(campo => {
        campo.style.borderColor = '';
    });
}

// ===== MÁSCARAS DE ENTRADA =====
function configurarMascaras() {
    // Máscara para teléfono
    const telefonoInput = document.getElementById('telefono');
    if (telefonoInput) {
        telefonoInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^\d\s\(\)\-\+]/g, '');
        });
    }

    // Máscara para código postal
    const codigoPostalInput = document.getElementById('codigoPostal');
    if (codigoPostalInput) {
        codigoPostalInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    }
    
    // Máscara para número de tarjeta
    const numeroTarjeta = document.getElementById('numeroTarjeta');
    if (numeroTarjeta) {
        numeroTarjeta.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            this.value = value.substring(0, 19);
        });
    }
    
    // Máscara para fecha de vencimiento
    const fechaVencimiento = document.getElementById('fechaVencimiento');
    if (fechaVencimiento) {
        fechaVencimiento.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value.substring(0, 5);
        });
    }
    
    // Máscara para CVV
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substring(0, 4);
        });
    }
}

// ===== FUNCIONES DE PAGO (simuladas) =====
function validarFormularioTarjeta() {
    // Implementar validación de tarjeta aquí
    return true;
}

function procesarPagoTarjeta() {
    // Simular procesamiento de pago
    alert('¡Pago procesado con éxito!');
}