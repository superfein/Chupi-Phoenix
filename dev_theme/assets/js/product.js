$( document ).ready(function() {





  // Product page

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
  addToBagButton.off().click( function(e) {
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
        return false; // Break
      }
      // Commit Add-to-bag
      else {
        //
      }
    });
  }); // end click Add-to-bag








  // Open product customise panel
  $('.customise-section .dropdown-btn').off().click( function() {
    $('.customise-section').not($(this).closest('.customise-section')).find('.dropdown-panel').removeClass('active'); // Close any other open customisation panels
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




  // Customisation - general selection (ring-size. birthstone, starsign)
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

    // Append variant ID
  });



  // Open guide
  $('.customise-section .guide-btn').off().click( function() {
    lockPageScroll(); // Lock page scroll
    $(this).closest('.customise-section').find('.product-guide-drawer').addClass('active');
  });



  // Open Hint drawer
  $('.send-hint').off().click( function() {
    lockPageScroll(); // Lock page scroll
    $('#hint-drawer').addClass('active');
  });





  // Product customer stories hover effect
  $('.customer-photo').hover( function() {
    var thisPhotoIndex = $('.customer-photo').index(this); // get index of current
    // Make current photo active
    $('.customer-photo').removeClass('active');
    $(this).addClass('active');
    // Make current quote active
    $(this).parent('.grid-item').siblings('.grid-item').children('.customer-quote').removeClass('active').eq(thisPhotoIndex).addClass('active');
  }, function() {
    // Hover off
  });


  // Product FAQs open/close
  $('#product-faq .question').off().click(function(e) {
    e.preventDefault();
    var thisQuestion = $(this);
    $('#product-faq .question').not(thisQuestion).removeClass('active').siblings('.answer').slideUp(mobileMenuSlideTime); // close all
    thisQuestion.toggleClass('active').siblings('.answer').slideToggle(mobileMenuSlideTime); // open this
  });






  // Product Detail section - disable Slick on desktop
  // function productDetailSlider() {
  //   if( window.innerWidth > desktopBreakPoint ) { // Desktop only
  //     if (!$('body').hasClass('desktop')) {
  //       setTimeout(function(){
  //         $('#product-detail .slider').slick(slickSliderSettings); // Enable Slick
  //         $('#product-detail .slider').slick("unslick"); // Disable Slick
  //       }, 200);
  //     }
  //     $('body').addClass('desktop');
  //   }
  //   else { // Mobile only
  //     if ($('body').hasClass('desktop')) {
  //       $('#product-detail .slider').slick(slickSliderSettings); // Enable Slick
  //     }
  //     $('body').removeClass('desktop');
  //   }
	// }
  // if ($('#product-detail').length) { // only run on Product page
  //   productDetailSlider();
  // 	$(window).resize ( function() {	productDetailSlider(); });
  // }















}); // end document.ready
