//$( document ).ready(function() {




  const productId = $('#product-top').attr('data-product-id');
  const firstVariantId = $('#product-top').attr('data-first-variant-id');
  var selectionVariantId = $('#product-top').attr('data-selected-variant-id');
  var customisationProperties = {};









  // Sticky Gallery and CTA
  // function stickyGalleryAndCta() {
  //
  //   var productTopPaddingTop = parseInt($('#product-top').css('padding-top')); // Distance from top of document to top of gallery
  //   var productInfoWidth = $('#product-info').outerWidth();
  //   var productGalleryWidth = $('#product-gallery').outerWidth();
  //   var productInfoPosBottom = $('#product-info').offset().top + $('#product-info').outerHeight();
  //   var productGalleryPosTop = $('#product-gallery .inner').offset().top;
  //   var productGalleryPosBottom = $('#product-gallery .inner').offset().top + $('#product-gallery .inner').outerHeight();
	//   var scrolled = $(window).scrollTop();
  //
  //   if( window.innerWidth > desktopBreakPoint ) { // Desktop only
  //
  //     // CTA
  //     $('#product-cta .inner').css('width', productInfoWidth); // Set CTA width to fit parent
  // 		if( scrolled + window.innerHeight >= productInfoPosBottom ) { // If past parent position
  //       $('#product-cta .inner').addClass('unfixed');
  // 		} else {
  //       $('#product-cta .inner').removeClass('unfixed');
  //     }
  //
  //     // Gallery
  //     $('#product-gallery .inner').css('width', productGalleryWidth); // Set Gallery width to fit parent
  //     if( (productInfoPosBottom - scrolled) <= (productGalleryPosBottom - scrolled) ) { // If bottom of info section is less than bottom of gallery
  //       $('#product-gallery .inner').addClass('unfixed');
  // 		}
  //     if ((productGalleryPosTop - scrolled) > productTopPaddingTop){ // If top of gallery is past fixed top position
  //       $('#product-gallery .inner').removeClass('unfixed');
  //     }
  //
  //   }
  //   else { // Mobile only - remove any desktop size and position modification
  //     $('#product-cta .inner').css('width', '').removeClass('unfixed');
  //     $('#product-gallery .inner').css('width', '').removeClass('unfixed');
  //   }
  //
	// }
  // if ($('#product-gallery').length) { // only run on Product page
  //   stickyGalleryAndCta();
  // 	$(window).scroll ( function() {	stickyGalleryAndCta(); });
  // 	$(window).resize ( function() {	stickyGalleryAndCta(); });
  // }





  //-------------- Gallery -------------- //

  // Slick Slider - set parameters (Ref: http://kenwheeler.github.io/slick/)
  var slickSliderSettings = {
    adaptiveHeight: true,
    mobileFirst: true,
		//autoplay: true,
		autoplaySpeed: 10000,
		cssEase: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)', // $ease_out_quint
		dots: true,
		arrows: true,
    nextArrow: '<button class="slick-next slick-arrow" aria-label="Next" type="button"></button>', // remove text from button
    prevArrow: '<button class="slick-prev slick-arrow" aria-label="Previous" type="button"></button>', // remove text from button
		draggable: true,
		swipe: true,
    swipeToSlide: true,
    touchThreshold: 200,
    //verticalSwiping: true,
    touchMove: true,
		infinite: true,
		pauseOnFocus: true,
		pauseOnDotsHover: true,
		slidesToShow: 1,
		speed: 300,
		waitForAnimate: true,
		responsive: [ // More swipe-friendly on mobile
	    // {
	    //   breakpoint: 1199,
	    //   settings: {
	    //     cssEase: 'ease',
			// 		speed: 300
	    //   }
	    // },
			{
	      breakpoint: 992, // desktop
	      settings: {
	        dots: false,
          arrows: false,
					speed: 400,
          fade: true
          //slickFilter: '.video-slide'
	      }
	    }
		]
  };
	if( $('.slider').length ) {
	  $('.slider').slick(slickSliderSettings);
    $('.slider').removeClass('loading'); // Show slider after fully loaded
    //$('.slick-slide').bind('touchstart', function(){ console.log('touchstart'); });
	}


  // Resize thumbnails
  function resizeThumbnails() {
    var thumbnailsContainerHeight = $('#product-gallery .gallery-thumbnails').outerHeight();
    var thumbnailCount = $('#product-gallery .gallery-thumbnails .gallery-thumbnail').length;
    var thumbnailMargin = parseInt($('#product-gallery .gallery-thumbnails .gallery-thumbnail').css('margin-bottom'));
    var newThumbnailHeight = ((thumbnailsContainerHeight + thumbnailMargin) / thumbnailCount) - thumbnailMargin;
    $('#product-gallery .gallery-thumbnails .gallery-thumbnail').css({
      'height': newThumbnailHeight,
      'width': newThumbnailHeight
    });
    // if thumbnail are smaller than 50px remove video label
    if (newThumbnailHeight < 50) {
      $('#product-gallery .gallery-thumbnails .video-thumbnail').addClass('small');
    } else {
      $('#product-gallery .gallery-thumbnails .video-thumbnail').removeClass('small');
    }
    $('#product-gallery .gallery-thumbnails').removeClass('loading');
  }
  resizeThumbnails();
  $(window).resize(function() {
    resizeThumbnails();
  });


  // Gallery slider video dots
  $('#product-gallery .gallery-thumbnails .gallery-thumbnail').each( function(i) {
    if ($(this).hasClass('video-thumbnail')) {
      $('#product-gallery .display-box .slider').find('.slick-dots').children().eq(i).children('button').addClass('video-dot');
    }
  });


  // Change gallery on thumbnail select
  $('#product-gallery .gallery-thumbnail').off().click( function(e) {
    $('#product-gallery .slider').slick('slickGoTo',$(this).index());
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
  });


  // Activate thumbnail on gallery slider change
  $('#product-gallery .slider').on('afterChange', function() {
    var currentSlide = $('.slick-current').attr('data-slick-index');
    $('#product-gallery .gallery-thumbnail').removeClass('active');
    $('#product-gallery .gallery-thumbnail').eq(currentSlide).addClass('active');
  });


  // Play videos after slider is changed
  var currentSlide = '';
  // After slider change
  $('#product-gallery .slider').on('afterChange', function() {
    currentSlide = $('#product-gallery .slider').find('.slick-active');
    if (currentSlide.children('video').length > 0) {
      var video = currentSlide.children('video');
      video[0].play(); // Play video object
    }
  });


  // Image pinch zoom - https://interactjs.io/
  /*
  if( $('.slider').length ) {

    // Init on current slide
    makeInteractable('.slick-current');

    // Set initial XY coordinates of interactable element
    var activeItemX = 0;
    var activeItemY = 0;

    function dragMoveListener (event) {

      event.target.classList.add('gesture-active');

      var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      activeItemX = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      activeItemY = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
      // translate the element
      target.style.webkitTransform =
      target.style.transform = 'translate(' + activeItemX + 'px, ' + activeItemY + 'px)';
      // update the posiion attributes
      target.setAttribute('data-x', activeItemX);
      target.setAttribute('data-y', activeItemY);

    } // end dragMoveListener()

    function makeInteractable(event) {

      var body = document.body;
      var angleScale = 1;

      interact('.slick-current').gesturable({

        onstart: function (event) {
          // Prevent (touch) scrolling while gesturing
          body.addEventListener("touchmove", function(e){ e.preventDefault(); });
        },

        onmove: function (event) {

          // Make active on move
          event.target.classList.add('gesture-active');
          // Define new scale
          var currentScale = event.scale * angleScale;
          // Restrict scale
          if (currentScale > 4) { currentScale = 4; } // Not greater than 4x default size
          else if (currentScale < 1) { currentScale = 1; } // Not smaller than default size
          // Set inner scalable element
          var scaleElement = null;
          for (var i = 0; i < event.target.childNodes.length; i++) {
            if (event.target.childNodes[i].classList.contains('gesture-scalable')) {
              scaleElement = event.target.childNodes[i]; // inner image
              break;
            }
          }
          // Apply scale changes
          scaleElement.style.webkitTransform = scaleElement.style.transform = 'scale(' + currentScale + ')';
          // Call drag function
          dragMoveListener(event);

        },

        onend: function (event) {

          // Remove active class
          event.target.classList.remove('gesture-active');
          // Reset position of outer parent
          var target = event.target;
          target.style.webkitTransform = target.style.transform = 'translateX(0) translateY(0)';
          target.setAttribute('data-x', '0');
          target.setAttribute('data-y', '0');
          // Reset position of inner scalable image
          scaleElement = event.target.childNodes[i];
          scaleElement.style.webkitTransform = scaleElement.style.transform = 'scale(1)';
          // Allow normal touch events after gesturing
          body.addEventListener("touchmove", function(e){ e.returnValue = true; });

        }

      }); // end gesturable()

    } // end makeInteractable()

  } // end if .slider
  */










  //-------------- Finance Options -------------- //

  // Open finance options tooltip
  $('.finance-options .finance-options-trigger').click(function(){
    $(this).siblings('.finance-options-tooltip').toggleClass('active');
  });
  // Close Finance options tooltip on click away
  $(document).on('click', function(e) {
    var financeOptionsTrigger = $('.finance-options .finance-options-trigger');
    var financeOptionsTooltip = $('.finance-options .finance-options-tooltip');
    // If the target of the click isn't the container nor a descendant of the container
    if (!financeOptionsTrigger.is(e.target) && financeOptionsTrigger.has(e.target).length === 0) {
      financeOptionsTooltip.removeClass('active');
    }
  });










  //-------------- Adjust variant price dropdown width based on selection -------------- //

  // See: https://stackoverflow.com/questions/20091481/auto-resizing-the-select-element-according-to-selected-options-width
  function variantPriceWidth(currentSelect) {
  	var tempSelect = $('#temp-product-price-select');
  	var tempOption = tempSelect.children('option');
  	tempOption.html('').html(currentSelect.children('option:selected').text());
  	currentSelect.width(tempSelect.width());
  }
  if ( $('#product-price-select').length ) {
  	var currentSelect = $('#product-price-select');
    var defaultAddButtonText = $('#product-cta #add-to-bag').children('span').text();
  	variantPriceWidth(currentSelect); // Call on load
  	currentSelect.change(function(){ // Call on change
      variantPriceWidth(currentSelect);
      $('#product-info .customise-field').removeClass('error').children('.error-message').remove(); // Remove any existing required-field errors
      $('#product-info .customise-field').addClass('complete'); // Mark as complete
  	});
  }









  //-------------- Wishlist -------------- //

function wishlistState() {
  // Toggle active state
  // $('.wishlist-add').toggleClass('active');
  // // Change 'Add' text
  // $('#product-cta').find('.wishlist-add').children('span').each( function() {
  //   var ctaWishlistButton = $(this);
  //   var ctaWishlistText = ctaWishlistButton.text();
  //   //wishlistAddedText = text.replace("Add", "Added");
  //   if ($(this).closest('.wishlist-add').hasClass('active')) {
  //     ctaWishlistButton.text(ctaWishlistText.replace('Add', 'Added'));
  //   } else {
  //     ctaWishlistButton.text(ctaWishlistText.replace('Added', 'Add'));
  //   }
  // });
}

// Toggle Wishlist buttons
$('.wishlist-add').on().click( function() {
  //wishlistState(); // Change frontend Wishlist state
  //$(this).toggleClass('active');
  $('#product-cta').find('.wishlist-add').children('span').each( function() {
    var ctaWishlistButton = $(this);
    var ctaWishlistText = ctaWishlistButton.text();
    //wishlistAddedText = text.replace("Add", "Added");
    if ($(this).closest('.wishlist-add').hasClass('active')) {
      ctaWishlistButton.text(ctaWishlistText.replace('Add', 'Added'));
    } else {
      ctaWishlistButton.text(ctaWishlistText.replace('Added', 'Add'));
    }
  });
});











//-------------- Share -------------- //

// Open Share list
$('.share').off().click( function() {
  $(this).find('ul').toggleClass('active');
});

// Close Share list on click away
$(document).on('click', function(e) {
  var socialButton = $('.share');
  var socialList = $('.share ul.share-list');
  // If the target of the click isn't the container nor a descendant of the container
  if (!socialButton.is(e.target) && socialButton.has(e.target).length === 0) {
    socialList.removeClass('active');
  }
});












  //-------------- Add to Bag -------------- //

  const addToBagButton = $('#add-to-bag');
  var addToBadButtonDefaultText = addToBagButton.text();


  // Required customisation check
  function requiredCustomisationCheck() {
    //console.log('check');
    if ( $('.customise-section').length == $('.customise-section.complete').length ) {
      addToBagButton.addClass('btn-solid'); // Button style
      addToBagButton.text(addToBadButtonDefaultText); // Return button to default text
    }
    else {
      addToBagButton.removeClass('btn-solid'); // Button style
      $('.customise-section').each( function() {
        if ( !$(this).hasClass('complete') ) { // If this field is not complete
          var requiredText = $(this).attr('data-required-text');
          addToBagButton.text(requiredText); // Change CTA button text
          return false;
        }
      });
    }
  }
  requiredCustomisationCheck(); // Call on load


  // Click Add-to-bag
  addToBagButton.click(function(e) {
    // Check if all customise sections are complete
    if ( $('.customise-section').length == $('.customise-section.complete').length ) {
      //console.log('allow!');

      // Disable add-to-bag button
      addToBagButton.addClass('disabled');

      // AJAX cart update
      console.log(selectionVariantId);
      console.log(customisationProperties);
      $.post(
        "/cart/add.js", {
          "quantity": 1,
          "id": selectionVariantId,
          "properties": customisationProperties
        },
        function(data){},
        dataType="json"
      ).done(function(){

        // Added feedback

        //console.log('cart done');
        setTimeout(function() { // delay to allow add-to-bag button confirmation
          // Reset cusomisation
          $('.customise-section').each( function() {
            var thisCustomiseSection = $(this);
            var thisDropdownButton = thisCustomiseSection.find('.dropdown-btn');
            thisCustomiseSection.removeClass('complete').attr('data-customise-selection', ''); // Reset customise selection
            thisDropdownButton.removeClass('prepend-image').children('img').remove(); // Remove any child image
            thisDropdownButton.text(thisDropdownButton.attr('data-default-text')); // Reset dropdown button text
            $('#product-top').attr('data-selected-variant-id', $('#product-top').attr('data-first-variant-id'));
            requiredCustomisationCheck(); // Run required customisation check
          });
          // Enable add-to-bag
          addToBagButton.removeClass('disabled');
        }, openOnAddToBagDelay); // Delay defined in dynamic-cart.js

      });

    }
    else {

      //console.log('prevent!');
      e.stopPropagation(); // Prevent submit

      $('.customise-section').each( function() {
        // If this incomplete required field exists
        if ( !$(this).hasClass('complete') ) {
          e.stopPropagation(); // Prevent submit
          // For general customisation, open dropdown panel
          if ($(this).children('.dropdown-panel').length) {
            $(this).children('.dropdown-panel').addClass('active');
          }
          // For Initials, focus on first blank initial
          if ($(this).hasClass('customise-initials')) {
            $('.customise-initials .initials-selection').each( function() { // across each selection...
              $(this).find('span.initial-blank-faded').eq(0).addClass('active'); // Activate first blank item
            });
            $('.customise-initials .initials-selection .pointer').addClass('active'); // Show pointer (Desktop only)
            var activeSelectionPosLeft = $('.customise-initials .initials-selection .pointer').siblings('span.active').position().left;
            $('.customise-initials .initials-selection .pointer').css('left', activeSelectionPosLeft + 'px'); // Move pointer to active selection item
          }
          // For Coordinates, focus on first blank input
          if ($(this).hasClass('customise-coordinates')) {
            $('form.coordinates-form').find('.form-field').each(function() {
              if ($(this).find('input').val() === '') { // if blank
                $(this).find('input').focus();
                return false;
              }
            });
          }
          return false; // Break each
        }
      }); // end each loop

    }

  }); // end click Add-to-bag











  //-------------- Product Customisation -------------- //

  // Open product customise panel
  $('.customise-section .dropdown-btn').off().click( function() {
    // $('.customise-section').not($(this).closest('.customise-section')).find('.dropdown-panel').removeClass('active'); // Close any other open customisation panels
    $('.customise-section').find('.dropdown-panel').removeClass('active'); // Close any other open customisation panels
    $(this).siblings('.dropdown-panel').toggleClass('active'); // Open selected customisation panel
  });


  // Close product customise panel with close button (mobile)
  $('.customise-section .dropdown-panel .close-btn').off().click( function() {
    $(this).closest('.dropdown-panel').removeClass('active');
    deactivateInitialsSelection(); // Deactivate any initials
  });


  // Close product customise panel by clicking outside of panel (Desktop)
  $('html').click(function(e) {
    if( (window.innerWidth > desktopBreakPoint) ) { // Desktop only
      if( !e.target.closest('.customise-section') ) {
        $('.dropdown-panel').removeClass('active');
        deactivateInitialsSelection(); // Deactivate any initials
      }
    }
  });


  // Customisation - Ring size
  $('.customise-ring-size .ring-size-option').off().click( function() {
    $(this).closest('.dropdown-panel').toggleClass('active');
  });
  // Open Bespoke ringsize option
  $('.customise-ring-size .ring-size-bespoke > a').off().click( function() {
    $(this).siblings('.inner').addClass('active');
  });
  // Enable Bespoke ringsize Done button after input
  $('.customise-ring-size .ring-size-bespoke').find('textarea').on("change keyup paste", function() {
    var minTextareaChars = 1;
    if($(this).val().length >= minTextareaChars) {
      $(this).siblings('.btn').removeClass('disabled');
    } else {
      $(this).siblings('.btn').addClass('disabled');
    }
  });
  // Apply bespoke ringsize option
  $('.customise-ring-size .ring-size-bespoke').find('.btn').off().click( function() {
    var bespokeRingsizeText = $(this).siblings('textarea').val();
    $(this).closest('.customise-section').find('.dropdown-btn').text(bespokeRingsizeText); // Apply text
    $(this).closest('.dropdown-panel').toggleClass('active'); // Close panel
    $(this).closest('.customise-section').addClass('complete').attr('data-customise-selection', bespokeRingsizeText); // Mark as complete and append selection
    requiredCustomisationCheck(); // Run required customisation check
  });



  // Customisation - Birthstone
  $('.customise-birthstone .birthstone-option').off().click( function() {
    $(this).closest('.dropdown-panel').toggleClass('active');
  });



  // Customisation - Starsign
  $('.customise-starsign .starsign-option').off().click( function() {
    $(this).closest('.dropdown-panel').toggleClass('active');
  });



  // Customisation - Coordinates
  $('.customise-coordinates .switch').off().click( function() {
    $(this).toggleClass('switched');

    let options = $(this).attr('data-options').split('-');
    const hiddenInput = $(this).parent().children('input[type="hidden"]');
    for (let i in options){
      if(hiddenInput.val() != options[i]){
        $(hiddenInput).val(options[i]);
        break;
      }
    }

    $('.customise-coordinates').attr('data-customise-selection', createCoordinateString()); // Write coordinates data
    //updatePreview();
  });

  const getInputs = function() {
      const form = document.querySelector('form.coordinates-form');
      let obj = {
        ns: {
          degrees: 0,
          minutes: 0,
          seconds: 0,
          direction: ''
        },
        ew: {
          degrees: 0,
          minutes: 0,
          seconds: 0,
          direction: ''
        }
      };
      // Get North South Values
      obj.ns.degrees = form.querySelector('.northSouth .degrees').value;
      obj.ns.minutes = form.querySelector('.northSouth .minutes').value;
      obj.ns.seconds = form.querySelector('.northSouth .seconds').value;
      obj.ns.direction = form.querySelector('input.northSouthValue').value;
      // Set East West Values
      obj.ew.degrees = form.querySelector('.eastWest .degrees').value;
      obj.ew.minutes = form.querySelector('.eastWest .minutes').value;
      obj.ew.seconds = form.querySelector('.eastWest .seconds').value;
      obj.ew.direction = form.querySelector('input.eastWestValue').value;
      return obj
    }

    function checkInputType(input){
      if (input.classList.contains('degrees')){
        return 'degrees';
      } else if (input.classList.contains('minutes')) {
        return 'minutes';
      } else if (input.classList.contains('seconds')) {
        return 'seconds';
      } else {
        console.log("input is not degrees, minutes or seconds")
      }
    }

    function validateNumbers(input) {
      const value = input.value;
      const numberTest = /[^0-9]/;
      const split = value.split(numberTest);
      const replace = value.replace(numberTest, '');
      input.value = replace;
    }

    function getMaxDeg(input) {
      const value = input.value;
      const isNS = input.id.includes('ns');
      if (isNS) {
        return 90
      } else {
        return 180
      }
    }

    function keepLength(input) {
      if (input.id !== 'ew-degrees') {
        if (input.value.length > 2) {
          if (input.value.charAt(0) == '0'){
            input.value = input.value.slice(1, 3)
          } else {
            input.value = input.value.slice(0, 2);
          }
          createError(input, "You can only use two numbers here");
        }
      } else {
        if (input.value.length > 3) {
          input.value = input.value.slice(0, 3);
          createError(input, "You can only use three numbers here");
        }
      }
    }

    function handlePoles(input){
      if (!input.classList.contains('degrees')){
        const degreesInput = input.parentElement.parentElement.querySelector('.degrees')
        if (degreesInput.value == getMaxDeg(degreesInput) && input.value > 0){
          createError(input, "When the degrees are set to " + getMaxDeg(degreesInput) + "°, the minutes and seconds have to be 0");
          input.value = 0;
        }
      }
    }

    function addZeros(value) {
      if (value < 1) {
        return '00'
      } else if (value < 10) {
        if (value.toString().charAt(0) === '0'){
          return value;
        } else {
          return '0' + value;
        }
      } else {
        return value;
      }
    }

    function degreesAddZeros(value) {
      if (value === ''){
        return '0';
      } else {
        return value;
      }
    }

    function createError(input, message) {
      const parentGroup = input.parentElement;
      const errorComponent = document.createElement("div");
      const errorMsg = document.createTextNode(message);
      errorComponent.classList.add('error');
      errorComponent.appendChild(errorMsg);
      errorComponent.addEventListener('click', function(){
        this.remove();
      });
      parentGroup.appendChild(errorComponent);
      setTimeout ( function() {
          errorComponent.classList.add('active');
      }, 10);

    }

    function giveWarningClass(input){
      input.classList.add('warning');
    }

    function clearWarningClass(input){
      input.classList.remove('warning');
    }

    function clearErrors(){
      const allErrors = Array.from(document.querySelectorAll('.form-group .error'));
      for (let i in allErrors){
        allErrors[i].classList.remove('active');
        setTimeout ( function() {
            allErrors[i].remove(); // Remove after transition-out time
        }, 200);
      }
    }

    function validateDegs(input) {
      let inputValue = input.value;
      if (inputValue < 0) {
        input.value = 0;
      } else if (inputValue > getMaxDeg(input)) {
        input.value = getMaxDeg(input);
        createError(input, "This has a maximum of " + getMaxDeg(input));
      }
      if (inputValue.toString().length === 3 && inputValue.toString().charAt(0) === '0' && inputValue.toString().charAt(1) === '0'){
        let newValue = inputValue.slice(1, 3);
        input.value = newValue;
      } else if (inputValue.toString().length === 3 && inputValue.toString().charAt(0) === '0') {
        let newValue = inputValue.slice(1, 3);
        input.value = newValue;
      }
    }

    function validateDegreesMinutes(input){
      let inputValue = input.value;
      let inputType = input.classList[0];
      if (inputValue < 0) {
        input.value = 0;
      } else if (inputValue > 59) {
        input.value = 59;
        createError(input, "The maximum is 59 " + inputType)
      }
    }

    function validate(input){
      validateNumbers(input);
      keepLength(input);
      if (checkInputType(input) === 'degrees'){
        validateDegs(input);
      } else {
        validateDegreesMinutes(input);
      }
    }

    function createCoordinateString(){
      const inputValues = getInputs();
      const northSouthPart = degreesAddZeros(inputValues.ns.degrees) + '°' + addZeros(inputValues.ns.minutes) + "'" + addZeros(inputValues.ns.seconds) + '"' + inputValues.ns.direction.toUpperCase();
      const eastWestPart = degreesAddZeros(inputValues.ew.degrees) + '°' + addZeros(inputValues.ew.minutes) + "'" + addZeros(inputValues.ew.seconds) + '"' + inputValues.ew.direction.toUpperCase();
      return northSouthPart + ' / ' + eastWestPart;
    }

    // function updatePreview() {
      // const previewWrap = document.querySelector('.coordinates-preview .preview');
      // const previewNs = previewWrap.querySelector('.ns');
      // const previewEw = previewWrap.querySelector('.ew');
      // const inputValues = getInputs();
      // previewNs.textContent = degreesAddZeros(inputValues.ns.degrees) + '°' + addZeros(inputValues.ns.minutes) + "'" + addZeros(inputValues.ns.seconds) + '"' + inputValues.ns.direction.toUpperCase();
      // previewEw.textContent = degreesAddZeros(inputValues.ew.degrees) + '°' + addZeros(inputValues.ew.minutes) + "'" + addZeros(inputValues.ew.seconds) + '"' + inputValues.ew.direction.toUpperCase();
    // }

    // $('form.coordinates-form input').click(function() {
    //   clearErrors();
    // });

    function checkCoordinatesCompletion() {
      var coordinatesComplete = false;
      $('form.coordinates-form').find('.form-field').each(function() {
        if ($(this).find('input').val() === '') { // if blank
          $('.customise-coordinates').removeClass('complete'); // Unmark as complete
          coordinatesComplete = false;
          return false;
        } else {
          coordinatesComplete = true;
        }
      });
      if (coordinatesComplete == true) {
        $('.customise-coordinates').addClass('complete'); // Mark as complete
        $('.customise-coordinates').attr('data-customise-selection', createCoordinateString()); // Write coordinates data
      }
      requiredCustomisationCheck(); // Run required customisation check
      // Update selection variant ID
      selectionVariantId = $('#product-top').attr('data-selected-variant-id');
      // Update customisation properties (property items to match those detail note keys in dynamic-cart.js)
      customisationProperties.Coordinates = $('.customise-coordinates').attr('data-customise-selection');
    }

    $('form.coordinates-form input').keydown(function() {
      validate(this);
      clearErrors();
    });

    $('form.coordinates-form input').keyup(function(){
      validate(this);
      handlePoles(this);
      //updatePreview();
      checkCoordinatesCompletion(); // Check for completion
    });

    // Remove error messages by clicking away
    $('html').click(function(e) {
      if( e.target !== $('.error') ) {
        clearErrors();
      }
    });



  // Customisation - Initials
  // Click initial selection item
  $('.customise-initials .initials-selection span').off().click( function() {
    var indexOfThis = $(this).parent().children().index(this); // Get index of clicked
    $('.customise-initials .initials-selection span').removeClass('active'); // Deactivate all across each selection
    $('.customise-initials .initials-selection').each( function() { // across each selection...
      $(this).find('span').eq(indexOfThis).attr('class', 'initial-blank-faded active'); // Reset classes to blank and active
    });
    $('.customise-section').not($(this).closest('.customise-section')).find('.dropdown-panel').removeClass('active'); // Close any other open customisation panels
    $(this).closest('.customise-section').children('.dropdown-panel').addClass('active'); // Open selection panel
    $('.customise-initials .dropdown-panel .dropdown-panel-footer .btn').addClass('disabled'); // Disable confirm button (Mobile only)
    $(this).siblings('.pointer').addClass('active'); // Show pointer (Desktop only)
    var activeSelectionPosLeft = $('.customise-initials .initials-selection .pointer').siblings('span.active').position().left;
    $('.customise-initials .initials-selection .pointer').css('left', activeSelectionPosLeft + 'px'); // Move pointer to active selection item
    $('.customise-initials').removeClass('complete'); // Unmark as complete
    $('.customise-initials').attr('data-customise-selection', ''); // Clear selection data
    requiredCustomisationCheck(); // Run required customisation check
  });

  // Select character
  $('.customise-initials .dropdown-panel .initials-options a').off().click( function() {
    var selectedCharacter = $(this).attr('data-initial');
    var selectedCharacterClass = $(this).attr('class');
    var currentInput = '';
    var activeSelectionPosLeft = 0;
    // Replace blank class with selected initial and active, append character to title attr.
    $('.customise-initials .initials-selection span.active').attr('class', 'active ' + selectedCharacterClass).attr('title', selectedCharacter);

    // If more blanks exist, focus on the next
    if ($('.customise-initials .initials-selection').children('.initial-blank-faded').length > 0) {
      //console.log('initials if');
      // If the next is blank, focus on this
      if ($('.customise-initials .initials-selection span.active').next('.initial-blank-faded').length > 0) {
        //console.log('initials next');
        $('.customise-initials .initials-selection').each( function() {
          currentInput = $(this).find('span.active');
          currentInput.next('.initial-blank-faded').addClass('active');
          currentInput.removeClass('active');
        });
        activeSelectionPosLeft = $('.customise-initials .initials-selection .pointer').siblings('span.active').position().left;
        $('.customise-initials .initials-selection .pointer').css('left', activeSelectionPosLeft + 'px'); // Move pointer to active selection item
      }
      // Else loop back, find the next blank, and focus
      else {
        //console.log('initials loop back');
        $('.customise-initials .initials-selection').each( function() {
          currentInput = $(this).find('span.active');
          currentInput.siblings('span.initial-blank-faded').eq(0).addClass('active'); // Activate first blank item
          currentInput.removeClass('active');
        });
        activeSelectionPosLeft = $('.customise-initials .initials-selection .pointer').siblings('span.active').position().left;
        $('.customise-initials .initials-selection .pointer').css('left', activeSelectionPosLeft + 'px'); // Move pointer to active selection item
      }

    }
    // When all selections are complete
    else {
      //console.log('initials else');
      $('.customise-initials .dropdown-panel .dropdown-panel-footer .btn').removeClass('disabled'); // Enable confirm button (Mobile only)
      if( window.innerWidth > desktopBreakPoint ) { // Close panel on Desktop only
        deactivateInitialsSelection();
        $('.customise-initials .dropdown-panel').removeClass('active');
      }
      $('.customise-initials').addClass('complete'); // Mark as complete
      // Write selection data
      var initialsCompleteSelection = '';
      var initialsCount = $('.customise-initials .initials-selection').eq(0).find('span').length;
      $('.customise-initials .initials-selection').eq(0).find('span').each(function(i) { // only read from one initials selection
        if ($(this).index() == initialsCount-1) { // if last in loop, no comma and space
          initialsCompleteSelection += $(this).attr('title');
        } else {
          initialsCompleteSelection += $(this).attr('title') + ", ";
        }
      });
      $('.customise-initials').attr('data-customise-selection', initialsCompleteSelection);
      requiredCustomisationCheck(); // Run required customisation check

      // Update selection variant ID
      selectionVariantId = $('#product-top').attr('data-selected-variant-id');
      // Update customisation properties (property items to match those detail note keys in dynamic-cart.js)
      customisationProperties.Initials = $('.customise-initials').attr('data-customise-selection');
    }

  }); // End select character

  // Apply selected initials on Mobile
  $('.customise-initials .dropdown-panel .dropdown-panel-footer .btn').off().click( function() {
    $('.customise-initials .dropdown-panel').removeClass('active');
  });

  // Deactivate any initial selection items
  function deactivateInitialsSelection() {
    $('.customise-initials .initials-selection span, .customise-initials .initials-selection .pointer').removeClass('active');
  }

  // Change disc count
  $('.customise-initials .change-disc .dropdown-panel ul li a').off().click( function() {
    var thisDiscSelection = $(this);
    discCountSelection = thisDiscSelection.parents('li').attr('data-disc-count');
    var productHandle = $('#product-top').attr('data-product-handle');

    // AJAX call
    ajaxCall('GET', window.location.protocol + '//' + window.location.hostname + '/products/' + productHandle + '.json', function(data) {

      var parsedResponse = JSON.parse(data); // Parses the AJAX data
      // Loop through product variants
      var productVariants = parsedResponse.product.variants;
      $.each(productVariants, function(key, val) {
        if (val.title == discCountSelection) {
          window.location.href = '/products/' + productHandle + '?variant=' + val.id;
        }
      }); // end variants loop

    }); // end ajaxCall()

  }); // end Change disc count



  // Customisation - general selection (ring-size. birthstone, starsign, zodiac)
  $('.customise-section .dropdown-panel .dropdown-option').off().click( function() {

    var thisCustomiseSection = $(this).closest('.customise-section');
    var thisDropdownButton = thisCustomiseSection.find('.dropdown-btn');
    var thisDropdownPanel = thisCustomiseSection.find('.dropdown-panel');
    var selectionTitle = $(this).clone().children().remove().end().text(); // Direct text content only, not additional child content
    var selectionImage = '';

    // Append images to selection
    if($(this).children('img').length) {
      selectionImage = '<img src="' + $(this).children('img').attr('src') + '" />';
      thisDropdownButton.addClass('prepend-image');
    } else {
      thisDropdownButton.removeClass('prepend-image');
    }
    // For ringsize, clear and hide bespoke size textarea
    if($(this).hasClass('ring-size-option')) {
      $(this).closest('.dropdown-panel').find('.ring-size-bespoke').children('.inner').removeClass('active').find('textarea').val('');
    }

    thisDropdownPanel.removeClass('active'); // Close overlay
    $('body').css('overflow', ''); // Allow scrolling main content (blocked on mobile)
    thisDropdownButton.text(selectionTitle); // Apply selection text
    $(selectionImage).prependTo(thisDropdownButton);
    thisCustomiseSection.addClass('complete').attr('data-customise-selection', selectionTitle); // Mark as complete and append selection
    requiredCustomisationCheck(); // Run required customisation check

    // Update selection variant ID
    if ($(this).attr('data-variant-id')) {
      selectionVariantId = $(this).attr('data-variant-id');
      $('#product-top').attr('data-selected-variant-id', selectionVariantId);
    }
    // Update customisation properties (property items to match those detail note keys in dynamic-cart.js)
           if (thisCustomiseSection.hasClass('customise-ring-size')) {
      customisationProperties.Size = thisCustomiseSection.attr('data-customise-selection');
    } else if (thisCustomiseSection.hasClass('customise-birthstone')) {
      customisationProperties.Birthstone = thisCustomiseSection.attr('data-customise-selection');
    } else if (thisCustomiseSection.hasClass('customise-starsign') && !thisCustomiseSection.hasClass('customise-zodiac')) {
      customisationProperties.Starsign = thisCustomiseSection.attr('data-customise-selection');
    } else if (thisCustomiseSection.hasClass('customise-zodiac')) {
      customisationProperties.Zodiac = thisCustomiseSection.attr('data-customise-selection');
    }
    // Coordinates and Initials handled separately

    // Append variant ID
  });









  // Open guide
  $('.customise-section .guide-btn').off().click( function() {
    if( window.innerWidth > 450 ) { // Desktop only
      lockPageScroll(); // Lock page scroll
    }
    $(this).closest('.customise-section').find('.product-guide-drawer').addClass('active');
  });



  // Open Share list
  $('.share').off().click( function() {
    $(this).find('ul').toggleClass('active');
  });



  // Open Hint drawer
  $('.send-hint').off().click( function() {
    if( window.innerWidth > 450 ) { // Desktop only
      lockPageScroll(); // Lock page scroll
    }
    $('#hint-drawer').addClass('active');
  });





  // Drop a Hint name fill
  function dahNameFill() {

    var recipientNameInput = $('#hint-form #hint-recipient-name');
    var senderNameInput = $('#hint-form #hint-sender-name');
    var additionalTextInput = $('#hint-form #hint-sender-extra');
    var recipientNameSpace = $('#hint-message #hint-message-recipient-name');
    var senderNameSpace = $('#hint-message #hint-message-sender-name');
    var additionalTextNameSpaceEl = $('#hint-message .additional-text');
    var additionalTextNameSpace = $('#hint-message #hint-message-additional');

    // Recipient name fill
    recipientNameInput.keyup(function(e) {
      recipientNameSpace.text(recipientNameInput.val());
    });
    // Sender name fill
    senderNameInput.keyup(function(e) {
      senderNameSpace.text(senderNameInput.val());
    });
    // Additional text fill
    additionalTextInput.keyup(function(e) {
      if (additionalTextInput.val()){
        additionalTextNameSpaceEl.addClass('active');
        additionalTextNameSpace.text(additionalTextInput.val());
      } else {
        additionalTextNameSpaceEl.removeClass('active');
        additionalTextNameSpace.text('');
      }
    });

  }
  dahNameFill();





  // Customer stories section
  $('.customer-photo').off().click( function() {
    var thisPhotoIndex = $('.customer-photo').index(this); // get index of current
    // Give index attribute to parent (controls style of children)
    $(this).parent('.customer-photos').attr('data-active-index', (thisPhotoIndex+1));
    // Make current quote active
    $(this).parent('.grid-item').siblings('.grid-item').children('.customer-quote').removeClass('active').eq(thisPhotoIndex).addClass('active');
  });




  // Press section
  function pressSectionAdjust() {
    // Set min height of quotes container
    var minHeight = -1;
    $('.press-quotes').find('.press-quote').each(function() {
     minHeight = minHeight > $(this).height() ? minHeight : $(this).height();
    });
    $('.press-quotes').find('.press-quotes').css('min-height', minHeight);

    // Position underline
    var currentPressLogo = $('.press-quotes').find('.press-logo.current');
    $('.press-quotes').find('.underline').css({
      'width' : parseInt(currentPressLogo.innerWidth()),
      'left' : parseInt(currentPressLogo.position().left)
    });
  }
  if( $('.press-quotes').length ) {
    pressSectionAdjust();
    $(window).resize(function() { pressSectionAdjust(); }); // on resize
	}

  // Change quote when a logo is selected
  $('.press-quotes').find('.press-logo').click( function() {
    currentPressLogo = $(this);
    // Assign current class
    $('.press-quotes').find('.press-logo').removeClass('current');
    $(this).addClass('current');
    // Move underline
    var thisLogoIndex = $('.press-logo').index(this);
    $(this).siblings('.underline').css({
      'width' : parseInt($('.press-quotes').find('.press-logo.current').innerWidth()),
      'left' : parseInt($('.press-quotes').find('.press-logo.current').position().left)
    });
    // Show matching quote
    $('.press-quotes').find('.press-quote').removeClass('active');
    $('.press-quotes').find('.press-quote').eq(thisLogoIndex).addClass('active');
  });







  // Product FAQs open/close
  $('.faq-section .question').off().click(function(e) {
    e.preventDefault();
    var thisQuestion = $(this);
    $('.faq-section .question').not(thisQuestion).removeClass('active').siblings('.answer').slideUp(mobileMenuSlideTime); // close all
    thisQuestion.toggleClass('active').siblings('.answer').slideToggle(mobileMenuSlideTime); // open this
  });







  // Four Cs section
  function fourCsSectionAdjust() {
    // Set min height of desription container
    var minHeight = -1;
    $('.four-cs-section').find('.descriptions .description').each(function() {
     minHeight = minHeight > $(this).height() ? minHeight : $(this).height();
    });
    $('.four-cs-section').find('.descriptions').css('min-height', minHeight);

    // Position underline
    var currentFourC = $('.four-cs-section').find('.options a.current');
    $('.four-cs-section').find('.options .underline').css({
      'width' : parseInt(currentFourC.innerWidth()),
      'left' : parseInt(currentFourC.position().left)
    });
  }
  if( $('.four-cs-section').length ) {
    fourCsSectionAdjust();
    $(window).resize(function() { fourCsSectionAdjust(); }); // on resize
	}

  // Change description when a Four Cs option is selected
  $('.four-cs-section').find('.options a').click( function() {
    currentFourC = $(this);
    // Assign current class
    $('.four-cs-section').find('.options a').removeClass('current');
    $(this).addClass('current');
    // Move underline
    var thisFourCIndex = $('.options a').index(this);
    $(this).siblings('.underline').css({
      'width' : parseInt($('.four-cs-section').find('.options a.current').innerWidth()),
      'left' : parseInt($('.four-cs-section').find('.options a.current').position().left)
    });
    // Show matching quote
    $('.four-cs-section').find('.descriptions .description').removeClass('active');
    $('.four-cs-section').find('.descriptions .description').eq(thisFourCIndex).addClass('active');
  });






  // Ring pairing section
  function ringPairing() {

    const collection = 'rings'; // Collection to search for pairing rings (used in AJAX call)

    // Get array of pairing ring titles from image alt attributes
    var pairingRingTitlesArray = [];
    $('#hvp-pairing .grid .grid-item').not('.main').each( function() {
      pairingRingTitlesArray.push($(this).find('img').attr('alt'));
    });
    //console.log(pairingRingTitlesArray);

    // Loop through all products in collection, if match to pairing ring title, get and apply link
	  function productPairingCallback(data) {

	    var parsedResponse = JSON.parse(data); // Parses the AJAX data

	    for (i = 0; i < parsedResponse.products.length; i++) { // Loop through products
	      var dataProductTitle = parsedResponse.products[i].title;
	      var dataProductUrl = window.location.protocol + '//' + window.location.hostname + '/products/' + parsedResponse.products[i].handle;
        if ($.inArray(dataProductTitle, pairingRingTitlesArray) != -1) {
          // Apply link to data attribute of matching item
          var matchingItem = $('#hvp-pairing .grid .grid-item').find("img[alt='" + dataProductTitle + "']").parent('.grid-item');
          matchingItem.attr('data-pairing-link', dataProductUrl);
        }
	    } // end loop through products

      // If first pairing item has link, enable link button
      if ($('#hvp-pairing .grid .grid-item.main').attr('data-pairing-link') !== '') {
        $('#hvp-pairing .grid .grid-item.main .btn').attr('href', $('#hvp-pairing .grid .grid-item.main').attr('data-pairing-link'));
        $('#hvp-pairing .grid .grid-item.main .btn').addClass('active');
      }

	  } // end productPairingCallback()

    // AJAX calls to ALL products on load
    for (i = 0; i < totalProductPages; i++) {
      var page = i+1;
      ajaxCall('GET', window.location.protocol + '//' + window.location.hostname + '/collections/' + collection + '/products.json' + '?limit=' + ajaxMaxItems + '&page=' + page, productPairingCallback);
    }

    $('#hvp-pairing .grid .grid-item').click( function() {
      var thisParingRing = $(this);
      if (!$(this).hasClass('main')) { // does not apply to main view box
        $('#hvp-pairing .grid .grid-item').removeClass('active');
        thisParingRing.addClass('active');
        $('#hvp-pairing .grid .grid-item.main').children('img').attr('src', thisParingRing.find('img').attr('src')); // Change main image
        $('#hvp-pairing .grid .grid-item.main h3').text(thisParingRing.find('img').attr('alt')); // Change main title
        $('#hvp-pairing .grid .grid-item.main .btn').attr('href', thisParingRing.attr('data-pairing-link')); // Change main button link
        // Only show button if it has a valid link
        if (thisParingRing.attr('data-pairing-link') !== '') {
          $('#hvp-pairing .grid .grid-item.main .btn').addClass('active');
        } else {
          $('#hvp-pairing .grid .grid-item.main .btn').removeClass('active');
        }
      }
    });
  }
  if( $('#hvp-pairing').length ) {
    ringPairing();
    //$(window).resize(function() { ringPairing(); }); // on resize
	}






  /*

  // Related products
  // See: https://help.shopify.com/en/themes/liquid/objects/recommendations
  function getRelatedProducts() {

    var relatedProductCard = $('.related-products').find('.product-card');
    var fetchProductLimit = $('.related-products').attr('data-related-product-count');

    function makeMetalSwitcher(product, metalTag) {
      var defaultMetal = metalTag.split('metal:')[1];
      console.log('defaultMetal: ' + defaultMetal);
      var altMetal1, altMetal2, altMetal1ProductHandle, altMetal2ProductHandle = '';
      var handle = product.handle;
      //handle = product.handle.replace('18k', '').replace('-14k', ''); // Remove any instances of '14k' or '18k' from the handle
      // Create alt metal handles
      if (defaultMetal == 'solid-gold') {
        altMetal1 = 'solid-white-gold';
        altMetal2 = 'solid-rose-gold';
        // solid-14k-rose-gold
        altMetal1ProductHandle = handle.replace('solid-14k', 'solid-14k-white').replace('solid-18k', 'solid-18k-white').replace('solid-gold', 'solid-white-gold');
        altMetal2ProductHandle = handle.replace('solid-14k', 'solid-14k-rose').replace('solid-18k', 'solid-18k-rose').replace('solid-gold', 'solid-rose-gold');
      }
      else if (defaultMetal == 'solid-white-gold') {
        altMetal1 = 'solid-gold';
        altMetal2 = 'solid-rose-gold';
        altMetal1ProductHandle = handle.replace('solid-14k-white', 'solid-14k').replace('solid-18k-white', 'solid-18k').replace('solid-white-gold', 'solid-gold');
        altMetal2ProductHandle = handle.replace('solid-14k-white', 'solid-14k-rose').replace('solid-18k-white', 'solid-18k-rose').replace('solid-white-gold', 'solid-rose-gold');
      }
      else if (defaultMetal == 'solid-rose-gold') {
        altMetal1 = 'solid-gold';
        altMetal2 = 'solid-white-gold';
        altMetal1ProductHandle = handle.replace('solid-14k-rose', 'solid-14k').replace('solid-18k-rose', 'solid-18k').replace('solid-rose-gold', 'solid-gold');
        altMetal2ProductHandle = handle.replace('solid-14k-rose', 'solid-14k-white').replace('solid-18k-rose', 'solid-18k-white').replace('solid-rose-gold', 'solid-white-gold');
      }
      console.log('altMetal1ProductHandle: ' + altMetal1ProductHandle);
      console.log('altMetal2ProductHandle: ' + altMetal2ProductHandle);
      //console.log(product.handle);

      // Get product data from alt metal handles
      // console.log(window.location.protocol + '//' + window.location.hostname + '/products/' + product.handle + '.json');
      // console.log(product);
      $.getJSON(window.location.protocol + '//' + window.location.hostname + '/products/' + altMetal1ProductHandle + '.json', function(product) {
        product = product.product;
        //console.log('The title of this product is ' + product.title);
        var altMetal1ProductId = product.id;
        var altMetal1ProductTitle = product.title;
        var altMetal1ProductUrl = product.url;
        var altMetal1ProductPrice = product.price;
        var altMetal1ProductFirstImage = product.images[0].src;
        var altMetal1ProductBodyImage = product.images[1].src;
        $.each(product.images, function(key, val) { // Check for on-body shot
          if (val.alt == 'on-body-shot') {
            altMetal1ProductBodyImage = key.src;
          }
        });
        //console.log(altMetal1ProductBodyImage);

      });
    }

    // Init on load
    ajaxCall('GET', window.location.protocol + '//' + window.location.hostname + '/recommendations/products.json?product_id=' + productId + '&limit=' + fetchProductLimit, function(response){

      const parsedResponse = JSON.parse(response); // Parse AJAX data
      const products = parsedResponse.products;
      let editedProducts = products;

      // Clean up the array
      for (let i = 0; i < products.length; i++){
        let {tags} = products[i];
        if (tags.includes("hidefromcollection") || tags.includes("algolia-ignore") || tags.includes("ring sizer")){
          console.log("hidden product found at index " + products.indexOf(products[i]));
          let currentIndex = products.indexOf(products[i]);
          editedProducts.splice(currentIndex, 1);
        }

        // if (tags.includes("metal:plated-rose-gold")){
        //   console.log(tags);
        // }
        // else {
        //   console.log("no tag found");
        // }
        //console.log(tags);

      }

      // For each related product
      for (let i = 0; i < editedProducts.length; i++){

        // Get data
        let productId = products[i].id;
        let productFirstVariantId = products[i].variants[0].id;
        let {handle, title, price, url, tags} = products[i];
        price = makeCurrency(price/100);
        let images = products[i].images;
        let media = products[i].media;
        let firstImageUrl = images[0];
        firstImageUrl = firstImageUrl.split('.jpg')[0] + '_480x480.jpg' + firstImageUrl.split('.jpg')[1]; // Replace image size
        let onBodyImageUrl = '';
        // Check all images for on-body alt text, if none found use second image
        for (let j = 0; j < media.length; j++){
          if (media[j].alt == 'on-body-shot') {
            onBodyImageUrl = media[j].src;
            break;
          } else {
            onBodyImageUrl = images[1];
          }
        }
        // Check all tags for 'metal:' substring
        let hasMetalTag = false;
        $.each(tags, function(key, val) {
          if (val.indexOf('metal:solid') >= 0) {
            hasMetalTag = true;
            var metalTag = val;
            makeMetalSwitcher(products[i], metalTag); // Make new metal switcher
            return false; // Break loop
          }
        });

        // Apply data to related product cards
        relatedProductCard.eq(i).children('.inner').find('.upper a').attr('href', url); // URL
        relatedProductCard.eq(i).children('.inner').children('a').attr('href', url); // URL
        relatedProductCard.eq(i).children('.inner').find('img').attr('src', firstImageUrl).attr('alt', title); // First image 
        relatedProductCard.eq(i).children('img').attr('src', onBodyImageUrl).attr('alt', title); // Second image (rollover)
        relatedProductCard.eq(i).children('.inner').find('h3').text(title); // Title
        relatedProductCard.eq(i).find('.price').text(price); // Price
        relatedProductCard.eq(i).find('.metal-switcher').remove(); // Remove existing metal switcher
        ////relatedProductCard.eq(i).find('.price').insertBefore(metalSwitcher); // Metal switcher

        // if (hasMetalTag == true) { // Metal switcher
        //   relatedProductCard.eq(i).find('.metal-switcher').show();
        // } else {
        //   relatedProductCard.eq(i).find('.metal-switcher').hide();
        // }
        relatedProductCard.eq(i).attr('data-product-id', productId); // Product ID
        relatedProductCard.eq(i).attr('data-first-variant-id', productFirstVariantId); // First variant ID
        // if (Appmate.wk.getProduct(productId) !== null) { // If this item is in Wishlist, set active state
        //   productSlots[i].querySelector('.recommended-wishlist-add').classList.add('active');
        // }
      }

    });

  }
  if ($('.related-products').length > 0) {
    getRelatedProducts();
  }

  */




//}); // end document.ready
