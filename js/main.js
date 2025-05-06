/**
 * Espresso SAT - Main JavaScript file
 * Handles smooth scrolling, navbar functionality, and form validation
 * Uses jQuery for DOM manipulation and event handling
 */

$(document).ready(function () {

  // ========== SMOOTH SCROLLING ==========

  // Handle navigation link clicks
  $('a[href^="#"]').on('click', function (e) {
    e.preventDefault();

    // Get the target element ID
    const targetId = $(this).attr('href');

    // Skip if it's just "#" (href="#")
    if (targetId === '#') return;

    if ($(targetId).length) {
      // Calculate position with offset for fixed navbar
      const navbarHeight = 70;
      const targetPosition = $(targetId).offset().top - navbarHeight;

      // Smooth scroll to target
      $('html, body').animate({
        scrollTop: targetPosition
      }, 600, 'easeInOutQuad');

      // Close mobile menu if open
      if ($('.navbar-collapse').hasClass('show')) {
        $('.navbar-toggler').click();
      }
    }
  });

  // ========== NAVBAR ACTIVE STATE ==========

  // Function to set active class on navbar based on scroll position
  function setActiveNavItem() {
    const scrollPosition = $(window).scrollTop();

    // Check each section's position
    $('section').each(function () {
      const sectionTop = $(this).offset().top - 100;
      const sectionHeight = $(this).outerHeight();
      const sectionId = $(this).attr('id');

      // If current scroll position is within this section
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all links
        $('.nav-link').removeClass('active');

        // Add active class to corresponding nav link
        $(`.nav-link[href="#${sectionId}"]`).addClass('active');
      }
    });

    // Add shadow to navbar when scrolled
    if (scrollPosition > 50) {
      $('#mainNav').addClass('shadow-sm');
    } else {
      $('#mainNav').removeClass('shadow-sm');
    }
  }

  // Set active nav item on load and scroll
  setActiveNavItem();
  $(window).on('scroll', setActiveNavItem);

  // ========== FORM VALIDATION ==========

  // Initialize EmailJS
  (function () {
    emailjs.init("-UGKzggu6-B941uI7"); // Replace with your actual EmailJS public key
  })();

  // Handle form submission
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();

    // Get form values
    const nombre = $('#nombre').val();
    const apellidos = $('#apellidos').val() || '';
    const email = $('#email').val();
    const telefono = $('#telefono').val();
    const mensaje = $('#mensaje').val();
    const legal = $('#legal').prop('checked');

    // Basic validation
    let isValid = true;

    if (!nombre || !email || !telefono || !mensaje || !legal) {
      isValid = false;
      alert('Por favor, complete todos los campos obligatorios.');
    } else if (!validateEmail(email)) {
      isValid = false;
      alert('Por favor, introduzca un email válido.');
    } else if (!validatePhone(telefono)) {
      isValid = false;
      alert('Por favor, introduzca un número de teléfono válido.');
    }

    // If valid, send email via EmailJS
    if (isValid) {
      // Show loading indicator
      const submitBtn = $(this).find('button[type="submit"]');
      const originalText = submitBtn.text();
      submitBtn.prop('disabled', true).text('Enviando...');

      // Prepare template parameters to match the template variables in the image
      const templateParams = {
        title: 'Contact Us: ' + nombre + ' ' + apellidos, // For {{title}} in subject
        name: nombre + ' ' + apellidos,                   // For {{name}} in From Name
        email: email,                                     // For {{email}} in Reply To
        telefono: telefono,                               // Keep this parameter
        message: mensaje                                  // Keep this parameter
      };

      // Send email using your service and template IDs
      emailjs.send('service_iy3ldt4', 'template_p44qcuj', templateParams)
        .then(function (response) {
          // Success message
          alert('¡Gracias por contactar con Espresso SAT! Nos pondremos en contacto contigo lo antes posible.');
          $('#contactForm')[0].reset();
          submitBtn.prop('disabled', false).text(originalText);
        }, function (error) {
          // Error message
          alert('Ha ocurrido un error al enviar el mensaje. Por favor, inténtelo de nuevo más tarde.');
          console.error('Error:', error);
          submitBtn.prop('disabled', false).text(originalText);
        });
    }
  });


  // Email validation helper function
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // Phone validation helper function
  function validatePhone(phone) {
    const re = /^[0-9\s\+\-\(\)]{9,15}$/;
    return re.test(String(phone));
  }

  // ========== ANIMATION ON SCROLL ==========

  // Add animation to elements when they come into view
  function animateOnScroll() {
    $('.card, .service-box').each(function () {
      const elementPosition = $(this).offset().top;
      const windowHeight = $(window).height();
      const scrollPosition = $(window).scrollTop();

      if (elementPosition < windowHeight + scrollPosition - 50) {
        $(this).addClass('visible');
      }
    });
  }

  // Initialize animations
  $('.card, .service-box').addClass('slide-up');

  // Call on scroll and on load
  $(window).on('scroll', animateOnScroll);
  $(window).on('load', animateOnScroll);

  // ========== ADDITIONAL ENHANCEMENTS ==========

  // Add jQuery easing plugin for smoother animations (if not already included)
  // This is a lightweight implementation if you don't want to include the full plugin
  $.extend($.easing, {
    easeInOutQuad: function (x, t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t + b;
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
  });

  // Initialize tooltips if needed
  $('[data-bs-toggle="tooltip"]').tooltip();

  // Preload hero background image for smoother page load
  const heroImage = new Image();
  heroImage.src = '../images/reparar cafetera bar.png';
});