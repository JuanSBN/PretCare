// ===== MODO OSCURO =====
const modoOscuroToggle = document.getElementById('modoOscuroToggle');

// Verificar si hay preferencia de modo oscuro
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('modoOscuro') === 'true') {
        document.body.classList.add('modo-oscuro');
        if (modoOscuroToggle) {
            modoOscuroToggle.checked = true;
        }
    }

    // Configurar el evento para el toggle de modo oscuro
    if (modoOscuroToggle) {
        modoOscuroToggle.addEventListener('change', function() {
            document.body.classList.toggle('modo-oscuro');
            localStorage.setItem('modoOscuro', document.body.classList.contains('modo-oscuro'));
        });
    }

    // Configurar el formulario
    const formularioEnvio = document.getElementById('formularioEnvio');
    if (formularioEnvio) {
        formularioEnvio.addEventListener('submit', manejarEnvioFormulario);
    }

    // Configurar máscaras de entrada
    configurarMascaras();
});

function configurarMascaras() {
    // Máscara para teléfono
    const telefonoInput = document.getElementById('telefono');
    if (telefonoInput) {
        telefonoInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^\d\s\(\)\-\+]/g, '');
        });
    }

    // Máscara para código postal (solo números)
    const codigoPostalInput = document.getElementById('codigoPostal');
    if (codigoPostalInput) {
        codigoPostalInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
        });
    }
}

function manejarEnvioFormulario(e) {
    e.preventDefault();
    
    // Validar todos los campos
    if (!validarFormulario()) {
        return;
    }
    
    // Si todo está correcto, simular procesamiento
    procesarPago();
}

function validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const codigoPostal = document.getElementById('codigoPostal').value.trim();
    const pais = document.getElementById('pais').value;
    
    // Limpiar errores anteriores
    limpiarErrores();
    
    let esValido = true;
    
    // Validación básica de campos obligatorios
    if (!nombre) {
        mostrarErrorCampo('nombre', 'El nombre completo es obligatorio');
        esValido = false;
    }
    
    if (!email) {
        mostrarErrorCampo('email', 'El correo electrónico es obligatorio');
        esValido = false;
    } else if (!validarEmail(email)) {
        mostrarErrorCampo('email', 'Por favor, ingresa un email válido');
        esValido = false;
    }
    
    if (!telefono) {
        mostrarErrorCampo('telefono', 'El teléfono es obligatorio');
        esValido = false;
    } else if (!validarTelefono(telefono)) {
        mostrarErrorCampo('telefono', 'El teléfono debe tener al menos 10 dígitos');
        esValido = false;
    }
    
    if (!direccion) {
        mostrarErrorCampo('direccion', 'La dirección es obligatoria');
        esValido = false;
    }
    
    if (!ciudad) {
        mostrarErrorCampo('ciudad', 'La ciudad es obligatoria');
        esValido = false;
    }
    
    if (!codigoPostal) {
        mostrarErrorCampo('codigoPostal', 'El código postal es obligatorio');
        esValido = false;
    }
    
    if (!pais) {
        mostrarErrorCampo('pais', 'Debes seleccionar un país');
        esValido = false;
    }
    
    return esValido;
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validarTelefono(telefono) {
    // Validar que tenga al menos 10 dígitos
    const digitos = telefono.replace(/\D/g, '');
    return digitos.length >= 10;
}

function mostrarErrorCampo(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    if (!campo) return;
    
    // Crear elemento de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-campo';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.3rem';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${mensaje}`;
    
    // Insertar después del campo
    campo.parentNode.appendChild(errorDiv);
    
    // Resaltar el campo con error
    campo.style.borderColor = '#e74c3c';
    
    // Quitar el error después de 5 segundos
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
        campo.style.borderColor = '';
    }, 5000);
}

function limpiarErrores() {
    // Eliminar todos los mensajes de error
    const errores = document.querySelectorAll('.error-campo');
    errores.forEach(error => error.remove());
    
    // Restaurar bordes de todos los campos
    const campos = document.querySelectorAll('input, select, textarea');
    campos.forEach(campo => {
        campo.style.borderColor = '';
    });
}

function procesarPago() {
    const boton = document.querySelector('.btn-continuar');
    if (!boton) return;
    
    const textoOriginal = boton.textContent;
    
    // Simular procesamiento
    boton.textContent = 'Procesando...';
    boton.disabled = true;
    
    // Mostrar loader
    const loader = document.createElement('div');
    loader.className = 'loader-pago';
    loader.innerHTML = `
        <div style="display: flex; justify-content: center; margin: 1rem 0;">
            <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #ff6f61; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>
    `;
    boton.parentNode.insertBefore(loader, boton);
    
    // Simular delay de red
    setTimeout(() => {
        // Remover loader
        if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
        
        // Mostrar mensaje de éxito
        mostrarMensajeExito('¡Información de envío guardada correctamente! En un sistema real, continuarías a la página de pago con tarjeta.');
        
        // Restaurar botón
        boton.textContent = textoOriginal;
        boton.disabled = false;
        
    }, 2000);
}

function mostrarMensajeExito(mensaje) {
    // Crear elemento de éxito
    const exitoDiv = document.createElement('div');
    exitoDiv.className = 'exito-pago';
    exitoDiv.style.background = '#d4edda';
    exitoDiv.style.color = '#155724';
    exitoDiv.style.padding = '1rem';
    exitoDiv.style.borderRadius = '8px';
    exitoDiv.style.margin = '1rem 0';
    exitoDiv.style.border = '1px solid #c3e6cb';
    exitoDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${mensaje}`;
    
    // Insertar antes del formulario
    const formulario = document.getElementById('formularioEnvio');
    formulario.parentNode.insertBefore(exitoDiv, formulario);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        exitoDiv.style.opacity = '0';
        exitoDiv.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            if (exitoDiv.parentNode) {
                exitoDiv.parentNode.removeChild(exitoDiv);
            }
        }, 500);
    }, 5000);
}

// Añadir estilos para la animación del loader
const estiloLoader = document.createElement('style');
estiloLoader.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(estiloLoader);