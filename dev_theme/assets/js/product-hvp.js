$( document ).ready(function() {







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









  //-------------- Wishlist -------------- //

  // Toggle Wishlist buttons
  $('.wishlist-add').on().click( function() {
    //wishlistState(); // Change frontend Wishlist state
    //$(this).toggleClass('active');
    $('#hvp-top-bar').find('.wishlist-add').children('span').each( function() {
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
  addToBagButton.off().click( function(e) {
    $('.customise-section').each( function() {
      // If this incomplete required field exists
      if ( !$(this).hasClass('complete') ) {
        e.stopPropagation(); // Prevent submit
        // For general customisation, open dropdown panel
        if ($(this).children('.dropdown-panel').length) {
          $(this).children('.dropdown-panel').addClass('active');
        }
        return false; // Break
      }
      // Commit Add-to-bag
      else {
        //
      }
    });
  }); // end click Add-to-bag











  //-------------- Prodct Customisation -------------- //

  // Open product customise panel
  $('.customise-section .dropdown-btn').off().click( function() {
    // $('.customise-section').not($(this).closest('.customise-section')).find('.dropdown-panel').removeClass('active'); // Close any other open customisation panels
    $('.customise-section').find('.dropdown-panel').removeClass('active'); // Close any other open customisation panels
    $(this).siblings('.dropdown-panel').toggleClass('active'); // Open selected customisation panel
  });


  // Close product customise panel with close button (mobile)
  $('.customise-section .dropdown-panel .close-btn').off().click( function() {
    $(this).closest('.dropdown-panel').removeClass('active');
  });


  // Close product customise panel by clicking outside of panel (Desktop)
  $('html').click(function(e) {
    if( (window.innerWidth > desktopBreakPoint) ) { // Desktop only
      if( !e.target.closest('.customise-section') ) {
        $('.dropdown-panel').removeClass('active');
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









  // Four Cs section
  function fourCsSectionAdjust() {
    // Set min height of desription container
    var minHeight = -1;
    $('#hvp-four-cs').find('.descriptions .description').each(function() {
     minHeight = minHeight > $(this).height() ? minHeight : $(this).height();
    });
    $('#hvp-four-cs').find('.descriptions').css('min-height', minHeight);

    // Position underline
    var currentFourC = $('#hvp-four-cs').find('.options a.current');
    $('#hvp-four-cs').find('.options .underline').css({
      'width' : parseInt(currentFourC.innerWidth()),
      'left' : parseInt(currentFourC.position().left)
    });
  }
  fourCsSectionAdjust();
  $(window).resize(function() { fourCsSectionAdjust(); }); // on resize

  // Change description when a Four Cs option is selected
  $('#hvp-four-cs').find('.options a').click( function() {
    currentFourC = $(this);
    // Assign current class
    $('#hvp-four-cs').find('.options a').removeClass('current');
    $(this).addClass('current');
    // Move underline
    var thisFourCIndex = $('.options a').index(this);
    $(this).siblings('.underline').css({
      'width' : parseInt($('#hvp-four-cs').find('.options a.current').innerWidth()),
      'left' : parseInt($('#hvp-four-cs').find('.options a.current').position().left)
    });
    // Show matching quote
    $('#hvp-four-cs').find('.descriptions .description').removeClass('active');
    $('#hvp-four-cs').find('.descriptions .description').eq(thisFourCIndex).addClass('active');
  });






  $('#hvp-pairing .grid .grid-item img').click( function() {
    if (!$(this).parent().hasClass('main')) { // does not apply to main view box
      $('#hvp-pairing .grid .grid-item').removeClass('active');
      $(this).parent().addClass('active');
      // Change image
      // pariedProductImgSrc = $(this).find('img').attr('src');
      // $('#hvp-pairing .grid .grid-item.main').children('.ring-pair-image').css('background-image', 'url(' + pariedProductImgSrc + ')');
      // Change title
      // pariedProductTitle = $(this).find('img').attr('alt');
      // $('#hvp-pairing .grid .grid-item.main .ring-pair-description span').text(pariedProductTitle);
    }
  });






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
  pressSectionAdjust();
  $(window).resize(function() { pressSectionAdjust(); }); // on resize

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
 





}); // end document.ready
