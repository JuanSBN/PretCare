// ===== NAVEGACIÓN Y SCROLL =====
const header = document.getElementById('header');
const menuToggle = document.querySelector('.mobile-toggle');
const menu = document.querySelector('.menu');
const menuItems = document.querySelectorAll('.menu a');

// Efecto de header al hacer scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Menú móvil
menuToggle.addEventListener('click', () => {
  menu.classList.toggle('active');
  const icon = menuToggle.querySelector('i');
  
  // Cambiar icono
  if (menu.classList.contains('active')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-times');
    // Ocultar botones de navegación cuando el menú está abierto
    document.querySelector('.nav-buttons').style.display = 'none';
  } else {
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
    // Mostrar botones de navegación cuando el menú está cerrado
    document.querySelector('.nav-buttons').style.display = 'flex';
  }
});

// Asegurarse de que los botones de navegación se muestren al cargar la página
window.addEventListener('load', () => {
  if (window.innerWidth <= 768) {
    document.querySelector('.nav-buttons').style.display = 'flex';
  }
});

// Cerrar menú al hacer clic en un enlace
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    menu.classList.remove('active');
    menuToggle.querySelector('i').classList.add('fa-bars');
    menuToggle.querySelector('i').classList.remove('fa-times');
  });
});

// Scroll suave para enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// ===== MODO OSCURO =====
const modoOscuroToggle = document.getElementById('modoOscuroToggle');
const petImg = document.getElementById('petImg');
const footerPet = document.getElementById('footerPet');

// Cargar preferencia de modo oscuro desde localStorage
if (localStorage.getItem('modoOscuro') === 'true') {
  document.body.classList.add('modo-oscuro');
  modoOscuroToggle.checked = true;
  petImg.src = 'img/mascota-sleep.png';
  footerPet.src = 'img/mascota-sleep.png';
}

// Cambiar modo oscuro
modoOscuroToggle.addEventListener('change', () => {
  document.body.classList.toggle('modo-oscuro');
  localStorage.setItem('modoOscuro', document.body.classList.contains('modo-oscuro'));
  
  if (modoOscuroToggle.checked) {
    petImg.src = 'img/mascota-sleep.png';
    footerPet.src = 'img/mascota-sleep.png';
  } else {
    petImg.src = 'img/mascota-awake.png';
    footerPet.src = 'img/mascota-awake.png';
  }
});

// ===== MASCOTA INTERACTIVA =====
const mascotaPrincipal = document.getElementById('pet');
const petImage = document.getElementById('petImg');
let isHappy = false;
let petTimeout;

// Interacción con la mascota
pet.addEventListener('click', () => {
  if (!isHappy) {
    // Animación de felicidad
    petImage.style.transform = 'scale(1.2) rotate(10deg)';
    petImage.style.transition = 'all 0.3s ease';
    
    petImage.src = 'img/mascota-happy.png';
    
    isHappy = true;
    
    // Restaurar después de 2 segundos
    clearTimeout(petTimeout);
    petTimeout = setTimeout(() => {
      petImage.style.transform = '';
      // petImage.src = modoOscuroToggle.checked ? 'img/mascota-sleep.png' : 'img/mascota-awake.png';
      isHappy = false;
    }, 2000);
  }
});

// Efecto hover persistente para la mascota del footer
footerPet.addEventListener('mouseover', () => {
  footerPet.style.animation = 'mover-cola 0.5s infinite alternate';
});

footerPet.addEventListener('mouseout', () => {
  footerPet.style.animation = '';
});

// ===== CARRUSEL DE TESTIMONIOS =====
const carruselInner = document.querySelector('.carrusel-inner');
const testimonios = document.querySelectorAll('.testimonio');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const indicatorsContainer = document.querySelector('.carrusel-indicators');
let currentIndex = 0;

// Crear indicadores
testimonios.forEach((_, index) => {
  const indicator = document.createElement('div');
  indicator.classList.add('indicator');
  if (index === 0) indicator.classList.add('active');
  indicator.addEventListener('click', () => goToTestimonio(index));
  indicatorsContainer.appendChild(indicator);
});

const indicators = document.querySelectorAll('.indicator');

// Función para mover el carrusel
function goToTestimonio(index) {
  currentIndex = index;
  carruselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
  
  // Actualizar indicadores
  indicators.forEach((indicator, i) => {
    indicator.classList.toggle('active', i === currentIndex);
  });
}

// Event listeners para botones
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + testimonios.length) % testimonios.length;
  goToTestimonio(currentIndex);
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % testimonios.length;
  goToTestimonio(currentIndex);
});

// Auto-play del carrusel
let carruselInterval = setInterval(() => {
  currentIndex = (currentIndex + 1) % testimonios.length;
  goToTestimonio(currentIndex);
}, 5000);

// Pausar auto-play al interactuar
carruselInner.addEventListener('mouseenter', () => {
  clearInterval(carruselInterval);
});

carruselInner.addEventListener('mouseleave', () => {
  carruselInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % testimonios.length;
    goToTestimonio(currentIndex);
  }, 5000);
});

// ===== ANIMACIONES AL SCROLL =====
const animatedElements = document.querySelectorAll('.animate-on-scroll');

function checkScroll() {
  animatedElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementTop < windowHeight - 100) {
      element.classList.add('visible');
    }
  });
}

// Verificar al cargar y al hacer scroll
window.addEventListener('load', checkScroll);
window.addEventListener('scroll', checkScroll);

// ===== FORMULARIO DE CONTACTO =====
const formContacto = document.getElementById('formContacto');
const formMessage = document.querySelector('.form-message');

formContacto.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Simular envío exitoso
  formMessage.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
  formMessage.classList.add('success');
  formMessage.style.display = 'block';
  
  // Limpiar formulario
  formContacto.reset();
  
  // Ocultar mensaje después de 5 segundos
  setTimeout(() => {
    formMessage.style.display = 'none';
    formMessage.classList.remove('success');
  }, 5000);
});

// ===== BOTÓN CTA =====
const ctaButton = document.querySelector('.cta-boton');

ctaButton.addEventListener('click', () => {
  // Scroll suave a la sección de contacto
  document.querySelector('#contacto').scrollIntoView({
    behavior: 'smooth'
  });
});

// ===== EFECTO DE MÁQUINA DE ESCRIBIR =====
const heroTitle = document.querySelector('.hero-titulo');
const heroSubtitle = document.querySelector('.hero-subtitulo');
const originalTitle = heroTitle.textContent;
const originalSubtitle = heroSubtitle.textContent;
let titleIndex = 0;
let subtitleIndex = 0;

function typeWriterTitle() {
  if (titleIndex < originalTitle.length) {
    heroTitle.textContent = originalTitle.substring(0, titleIndex + 1);
    titleIndex++;
    setTimeout(typeWriterTitle, 100);
  } else {
    // Iniciar escritura del subtítulo cuando el título termine
    setTimeout(typeWriterSubtitle, 300);
  }
}

function typeWriterSubtitle() {
  if (subtitleIndex < originalSubtitle.length) {
    heroSubtitle.textContent = originalSubtitle.substring(0, subtitleIndex + 1);
    subtitleIndex++;
    setTimeout(typeWriterSubtitle, 50);
  }
}

// Iniciar efecto
setTimeout(typeWriterTitle, 1000);

// ===== INTERACCIONES PRODUCTO =====
// Efectos para los puntos interactivos del producto
document.querySelectorAll('.punto').forEach(punto => {
  punto.addEventListener('click', () => {
    punto.querySelector('.punto-dot').style.animation = 'none';
    setTimeout(() => {
      punto.querySelector('.punto-dot').style.animation = 'pulse 2s infinite';
    }, 10);
  });
});

// ===== SUSCRIPCIÓN =====
// Funcionalidad para botones de planes
document.querySelectorAll('.btn-plan').forEach(btn => {
  btn.addEventListener('click', function() {
    const plan = this.closest('.plan').querySelector('h3').textContent;
    // Aquí iría la lógica de redirección o modal de pago
    console.log(`Plan seleccionado: ${plan}`);
    
    // Efecto visual de selección
    this.textContent = '¡Seleccionado!';
    this.style.background = 'var(--accent)';
    
    setTimeout(() => {
      this.textContent = 'Elegir Plan';
      this.style.background = '';
    }, 2000);
  });
});

// ===== BOTÓN COMPRAR =====
document.querySelector('.btn-comprar').addEventListener('click', function() {
  // Simular proceso de compra
  this.textContent = 'Procesando...';
  this.disabled = true;
  
  setTimeout(() => {
    // Aquí iría la redirección a la página de pago
    alert('¡Gracias por tu interés! Serás redirigido a la página de pago.');
    this.textContent = 'Comprar Ahora';
    this.disabled = false;
  }, 1500);
});