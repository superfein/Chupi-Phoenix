//$( document ).ready(function() {





  // Cart drawer open/close
  $('#cart-btn').off().click(function(e) {
    if( window.innerWidth > 450 ) { // Desktop only
      lockPageScroll(); // Lock page scroll
    }
    $('#dynamic-cart').addClass('active');
  });


  // Packaging overlays
  // Add luxury
  $('#dynamic-cart').on('click', '.cart-item .packaging-lux.add .packaging-option, .cart-item .packaging-lux.add .info-btn', function(e) {
    $('.overlay.packaging-lux-add').addClass('active');
  });
  // Comp luxury
  $('#dynamic-cart').on('click', '.cart-item .packaging-lux.comp .info-btn', function(e) {
    $('.overlay.packaging-lux-comp').addClass('active');
  });
  // Comp luxury notebook
  $('#dynamic-cart').on('click', '.cart-item.notebook-packaging .packaging-lux.comp .info-btn', function(e) {
    $('.overlay.packaging-lux-comp-notebook').addClass('active');
  });
  // Add min
  $('#dynamic-cart').on('click', '.cart-item .packaging-basic .packaging-option', function(e) {
    $('.overlay.packaging-min-add').addClass('active');
  });


  // Expand order note
  $('#dynamic-cart .drawer-footer .add-note-btn').off().click(function(e) {
    $(this).toggleClass('active');
    $(this).siblings('.notes-wrapper').slideToggle(200).toggleClass('active');
  });


  // Order note progress
  function additionalNoteProgress() {
    //   const containerElement = document.getElementById('additional-notes-progress')
    const containerElements = Array.from(document.querySelectorAll('.additional-notes-progress'));
    containerElements.map(function(containerElement) {
      const progressElement = containerElement.querySelector('.progress-radial__value');
      const radius = progressElement.getAttribute('r');
      const circumference = 2 * Math.PI * radius;
      const textarea = containerElement.parentElement.querySelector('textarea');
      const textareaMaxCharacters = textarea.getAttribute('maxlength');
      let textareaValue = textarea.value;
      let percentageOfMax = textareaValue.length / textareaMaxCharacters;
      let dashOffset = circumference * percentageOfMax;

      textarea.addEventListener('keyup', function() {
        textareaValue = this.value;
        percentageOfMax = textareaValue.length / textareaMaxCharacters;
        dashOffset = circumference * (1 - percentageOfMax);
        progressElement.style.strokeDashoffset = dashOffset;
        if (percentageOfMax === 1) {
          containerElement.classList.add('limit-reached');
          containerElement.classList.add('progress-warning');
        } else if (percentageOfMax > 0.95 && percentageOfMax != 1) {
          containerElement.classList.remove('limit-reached');
          containerElement.classList.add('progress-warning');
        } else if (percentageOfMax > 0.95) {
          containerElement.classList.add('progress-warning');
        } else {
          containerElement.classList.remove('progress-warning');
          containerElement.classList.remove('limit-reached');
        }
      });
    });
  }
  additionalNoteProgress();










//}); // end document.ready
