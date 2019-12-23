//$( document ).ready(function() {

  const desktopBreakPoint = 991; // Screen width in px
  const mobileMenuSlideTime = 200; // ms
  const mobileCollectionStorySlideTime = 200; // ms
  const transparentHeaderScrollTrigger = 100; // Pixels scrolled from top of viewport where transparent header becomes solid
  var transparentHeader = false;
  if ($('body').hasClass('transparent-header')) { // for pages with transparent header
    transparentHeader = true;
  }





  // Reset mega menus on resize
  function megaMenuReset() {
    if( window.innerWidth > desktopBreakPoint ) { // Desktop
      // Reset main menu
      $('#main-nav').removeClass('active');
      $('#menu-btn').removeClass('active');
      // Reset mega-menu
      $('.mega-menu').removeClass('active').css('width', $(window).width()).css('display', 'grid');
      $('.mega-menu .inner-list > ul').css('display', 'block');
    }
    else { // Mobile
      $('.mega-menu').css('width', 'auto').css('display', 'none');
      $('.mega-menu').siblings('a.active').siblings('.mega-menu').addClass('active').css('display', 'block');
      $('.mega-menu .inner-list > ul').css('display', 'none');
      $('.mega-menu .inner-list > ul.active').css('display', 'block');
    }
	}
	megaMenuReset();
	$(window).resize ( function() {	megaMenuReset(); });



  // Menu open/close (mobile only)
  $('#menu-btn').off().click( function(e) {
    e.preventDefault();
    $(this).toggleClass('active');
    $('#main-nav').toggleClass('active');
    $('#main-nav > ul').removeClass('slide-out'); // Close currency menu
    // Header state
    if (transparentHeader == true && !$('header').hasClass('scrolled')) { // If is transparent header and at top
      $('body').toggleClass('transparent-header');
    }
  });



  // Top level menu items open/close (mobile only)
  $('#main-nav > ul > li > a').off().click(function(e) {
    e.preventDefault();
    if( window.innerWidth <= desktopBreakPoint ) { // Mobile only
      // Close sibling menus and inner menus
      $('#main-nav > ul > li > a').not(this).removeClass('active');
      $('#main-nav > ul > li > a').not(this).siblings('.mega-menu').slideUp(mobileMenuSlideTime).removeClass('active');
      $('#main-nav > ul > li > a').not(this).siblings('.mega-menu').children('.inner-list').children('h3').removeClass('active');
      $('#main-nav > ul > li > a').not(this).siblings('.mega-menu').children('.inner-list').children('ul').slideUp(mobileMenuSlideTime).removeClass('active');
      // Open clicked menu
      $(this).toggleClass('active').siblings('.mega-menu').slideToggle(mobileMenuSlideTime).toggleClass('active');
    }
	});
  // Inner menu items open/close (mobile only)
  $('#main-nav .mega-menu .inner-list > h3').off().click(function(e) {
    e.preventDefault();
    if( window.innerWidth <= desktopBreakPoint ) { // Mobile only
      // Close sibling inner menus
      $('#main-nav .mega-menu .inner-list > h3').not(this).removeClass('active');
      $('#main-nav .mega-menu .inner-list > h3').not(this).siblings('ul').slideUp(mobileMenuSlideTime).removeClass('active');
      // Open clicked menu
      $(this).toggleClass('active').siblings('ul').slideToggle(mobileMenuSlideTime).toggleClass('active');
    }
	});



  // Mobile search open
  $('#mobile-search-btn').off().click(function(e) {
    e.preventDefault();
    $('#menu-btn').addClass('active');
    $('#main-nav').addClass('active');
    $('#main-nav > ul, #mobile-search').removeClass('slide-out'); // Close currency menu
    if (transparentHeader == true) { // If transparent header, make solid
      $('body').removeClass('transparent-header');
    }
    setTimeout( function() {
      $('#mobile-search').children('input[type="search"]').focus();
      //$('#mobile-search').children('input[type="search"]').trigger('focus'); //trigger touchstart
    }, mobileMenuSlideTime);
    // Hide/show Live chat
    function onTidioChatApiReady() {
      tidioChatApi.display(false); // hide Tidio
    }
    if (window.tidioChatApi) {
      window.tidioChatApi.on("ready", onTidioChatApiReady);
    } else {
      document.addEventListener("tidioChat-ready", onTidioChatApiReady);
    }
	});
  // iOS treatment of above
  $('#mobile-search-btn').on('touchstart', function() {
    setTimeout( function() {
      $('#search-input-field-mobile').focus();
      //$('#search-input-field-mobile').trigger('focus'); //trigger touchstart
    }, mobileMenuSlideTime);
	});

  // Clear search results (mobile)
  $('#search-input-field-mobile').keyup(function(){ // Check input on every keyup
    var mobileSearchInput = $(this);
    if (mobileSearchInput.val() === '') { // if blank
      mobileSearchInput.siblings('.clear').removeClass('active');
    } else {
      mobileSearchInput.siblings('.clear').addClass('active');
    }
  });
  $('#mobile-search .clear').off().click(function(e) { // Click clear button
    // $('#search-input-field-mobile').autocomplete('close');
    // $('#search-input-field-mobile').autocomplete('val', myVal);
    $('#search-input-field-mobile').val('').focus();
    //$('#search-input-field-mobile').siblings('pre').html('');
    $(this).removeClass('active');
    $('.algolia-autocomplete').hide();
  });

  // Hide search results on click away (Desktop only)
  $('html').off().click(function(e) {
    if( window.innerWidth > desktopBreakPoint ) {
      if ($(e.target).closest('.algolia-autocomplete').length === 0) {
        $('.algolia-autocomplete').hide();
      }
    }
  });

  // Hide search results on click header (Mobile only)
  $('header .inner').off().click(function(e) {
    if( window.innerWidth <= desktopBreakPoint ) {
      $('.algolia-autocomplete').hide();
    }
  });

  // Hide search results on resize (Desktop only)
  $(window).resize ( function() {
    if( window.innerWidth > desktopBreakPoint ) {
      $('.algolia-autocomplete').hide();
    }
  });



  // Mobile currency open
  $('#main-nav').on('click', '.currency-btn', function() {
    $('#main-nav > ul, #mobile-search').toggleClass('slide-out');
  });
  // Mobile currency close
  $('#main-nav').on('click', '.currency-close-btn', function() {
    $('#main-nav > ul, #mobile-search').toggleClass('slide-out');
  });


  // Change header state on scroll
	function headerScroll() {
	  var scrolled = $(window).scrollTop();
    if( scrolled > transparentHeaderScrollTrigger ) { // If past top and menu open
      $('header').addClass('scrolled');
			$('body').removeClass('transparent-header');
		}
    else if (!$('#main-nav').hasClass('active')) { // If at top and menu open
      $('header').removeClass('scrolled');
      $('body').addClass('transparent-header');
    }
    else {
      $('header').removeClass('scrolled'); // If at top and menu closed
    }
	}
  if (transparentHeader == true) { // If page has transparent header
    headerScroll();
  	$(window).scroll ( function() {	headerScroll(); });
  	$(window).resize ( function() {	headerScroll(); });
  }



  // Hover on top level menu items (desktop only)
  $('#main-nav > ul > li > a').hover(function(e) {
    if( window.innerWidth > desktopBreakPoint ) { // Desktop only
      var thisTopLevelItem = $(this);
      // Make header solid (applies to transparent header only)
      if (thisTopLevelItem.parent('li').hasClass('has-mega-menu')) { // If has mega menu
        $('body').removeClass('transparent-header');
      }
      // Show and position menu underline
      var thisTopLevelItemSidePadding = parseInt(thisTopLevelItem.css('padding-left')) + parseInt(thisTopLevelItem.css('padding-right'));
      var thisTopLevelItemWidth = parseInt(thisTopLevelItem.innerWidth()) - thisTopLevelItemSidePadding; // From text to end of chevron
      var thisTopLevelItemPosLeft = parseInt(thisTopLevelItem.position().left) + parseInt(thisTopLevelItem.css('padding-left'));
      $('#main-nav > ul > .underline').addClass('active').css({
        'width' : thisTopLevelItemWidth,
        'left' : thisTopLevelItemPosLeft
      });
      // Make this mega-menu active and adjust height of mega-menu background
      if (thisTopLevelItem.siblings('.mega-menu').length) {
        thisTopLevelItem.siblings('.mega-menu').addClass('active');
        var activeMegaMenuHeight = $('.mega-menu.active').outerHeight();
        $('#mega-menu-bg').addClass('active').css('height', activeMegaMenuHeight);
      }
    }
  },function(e) {
    if( window.innerWidth > desktopBreakPoint ) { // Desktop only
      // Make header transparent (applies to transparent header only)
      if (transparentHeader == true && !$('header').hasClass('scrolled')) { // If has mega menu
        $('body').addClass('transparent-header');
      }
      // Hide menu underline
      $('#main-nav > ul > .underline').removeClass('active');
      // Hide this mega menu and mega-menu background
      $(this).siblings('.mega-menu').removeClass('active');
      $('#mega-menu-bg').removeClass('active');
    }
	});

  // Hover on mega menu
  $('.mega-menu').hover(function(e) {
    if( window.innerWidth > desktopBreakPoint ) { // Desktop only
      // Make header solid (applies to transparent header only)
      $('body').removeClass('transparent-header');
      // Show menu underline
      $('#main-nav > ul > .underline').addClass('active');
      // Show this mega menu and mega-menu background
      $(this).addClass('active');
      $('#mega-menu-bg').addClass('active');
    }
  },function(e) {
    if( window.innerWidth > desktopBreakPoint ) { // Desktop only
      // Make header transparent (applies to transparent header only)
      if (transparentHeader == true && !$('header').hasClass('scrolled')) { // If has mega menu
        $('body').addClass('transparent-header');
      }
      // Hide menu underline
      $('#main-nav > ul > .underline').removeClass('active');
      // Hide this mega menu and mega-menu background
      $(this).removeClass('active');
      $('#mega-menu-bg').removeClass('active');
    }
	});








  // Custom fix for object-cover images in IE 11
  var isIE11 = !!navigator.userAgent.match(/Trident.*rv\:11\./);
  if (isIE11 == true && $('img.object-cover').length) {
    $('img.object-cover').each( function() {
      var thisObjectCoverImage = $(this);
      var imageSrc = thisObjectCoverImage.attr('src');
      // Hide original image and apply as background-image to parent
      thisObjectCoverImage.hide();
      thisObjectCoverImage.parent().addClass('image-cover').attr('style', 'background-image: url(' + imageSrc + ');');
    });
  }



  // Lock/Unlock page scroll
  // Get scrollbar width (Ref: https://davidwalsh.name/detect-scrollbar-width)
  var scrollDiv = document.createElement("div"); // Create temporary div
  scrollDiv.className = "scrollbar-measure";
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth; // Get the scrollbar width
  document.body.removeChild(scrollDiv); // Delete the div
  // console.log('scrollbarWidth: ' + scrollbarWidth);
  function lockPageScroll() { // Lock scroll
    $('body').addClass('no-scroll');
    if (scrollbarWidth > 0) {
      $('body, header').css('padding-right', scrollbarWidth + 'px'); // add side padding to replace scrollbar width
      // HVP top bar
      if($('#hvp-top-bar').length > 0) {
        var thisPaddingRight = parseInt($('#hvp-top-bar').css('padding-right'));
        $('#hvp-top-bar').css('padding-right', thisPaddingRight + scrollbarWidth + 'px');
      }
    }
  }
  function unlockPageScroll() { // Unlock scroll
    $('body').removeClass('no-scroll');
    if (scrollbarWidth > 0) {
      $('body, header').css('padding-right', ''); // reset side padding
      // HVP top bar
      if($('#hvp-top-bar').length > 0) {
        $('#hvp-top-bar').css('padding-right', '');
      }
    }
  }






  // Drawer close
  $('.drawer-header .close-btn, .drawer-back').off().click(function(e) {
    if( window.innerWidth > 450 ) { // Desktop only
      unlockPageScroll(); // Unlock page scroll
    }
    $(this).closest('.drawer').removeClass('active');
  });



  // Overlay close
  $('.overlay').off().click(function(e) {
    var thisOverlay = $(this);
    var modal = $(this).children('.modal');
    var closeButton = modal.find('.modal-close');
    // If outside modal is clicked OR if close button is clicked
    if (!modal.is(e.target) && thisOverlay.has(e.target).length === 0 || closeButton.is(e.target)) {
      thisOverlay.removeClass('active');
    }
  });










  // Sticky filter bar
  function stickyFilterBar() {
    var filterButtonsPosTopDefault = $('#filter-buttons').parent().offset().top; // Position when not sticky
    var filterBarPosTopDefault = $('#filter-bar').parent().offset().top; // Position when not sticky
    var headerHeight = $('header').outerHeight();
	  var scrolled = $(window).scrollTop();

    if( window.innerWidth <= desktopBreakPoint ) { // Mobile only
      $('#filter-bar').removeClass('sticky'); // Remove desktop sticky
  		if( scrolled >= (filterButtonsPosTopDefault - headerHeight) ) { // If past top and menu open
        $('#filter-buttons').addClass('sticky');
  		} else {
        $('#filter-buttons').removeClass('sticky');
      }
    }
    else { // Desktop only
      $('#filter-buttons').removeClass('sticky'); // Remove mobile sticky
      if( scrolled >= (filterBarPosTopDefault - headerHeight) ) { // If past top and menu open
        $('#filter-bar').addClass('sticky');
  		} else {
        $('#filter-bar').removeClass('sticky');
      }
    }
	}
  if ($('#filter-bar').length) {
    stickyFilterBar();
  	$(window).scroll ( function() {	stickyFilterBar(); });
  	$(window).resize ( function() {	stickyFilterBar(); });
  }







  // Filter drawer
  // Open filter drawer
  $('#filter-filter-button').off().click( function() {
    $('#filter-drawer').addClass('active');
  });
  // Expand filter section
  $('.filter-section > a').off().click( function() {
    if ($(this).parent('.filter-section').hasClass('active')) { // if click on active, close
      $(this).parent('.filter-section').removeClass('active');
    } else { // else open clicked
      $('.filter-section').removeClass('active');
      $(this).parent('.filter-section').addClass('active');
    }
  });
  // Select filter item (temp)
  $('.filter-section ul li a').off().click( function() {
    $(this).parent('li').toggleClass('active');
  });








  // Compressed text
  $('.compressed-text').each( function() {
    var thisCompText = $(this);
    // var content = thisCompText.children('.content');
    // var contentHeight = content.outerHeight();
    var expandToggle = thisCompText.children('.expand-toggle');
    expandToggle.off().click(function(e) {
      thisCompText.toggleClass('active');
    });
  });






  // Metal switcher
  $('.metal-switcher a').off().click(function(e) {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
  });







  // Video cover buttons
  // This is a pseudo play button button as a sibling to the <video> element
  $('.video-cover-btn').off().click(function(e) {
    var thisVideoButton = $(this);
    var video = $(this).siblings('video');
    // Display as default controls while playing
    thisVideoButton.addClass('min');
    video[0].play();
    video.attr('controls', '');
    // Reset when video ends
    video.on('ended',function(){
      video[0].load(); // Show poster image
      video.removeAttr('controls'); // Hide controls
      thisVideoButton.removeClass('min'); // Show play button
    });
  });







  // Shop Story buttons
  $('.shop-story-btn').off().click(function(e) {
    if( window.innerWidth > desktopBreakPoint ) { // Desktop
      $(this).parent().siblings('.shop-story-overlay').addClass('active');
    }
    else { // Mobile
      // Buttons
      $('.shop-story-btn').not(this).removeClass('active');
      $(this).toggleClass('active');
      // Overlays
      var thisShopStoryOverlay = $(this).parent().siblings('.shop-story-overlay');
      $('.shop-story-overlay').not(thisShopStoryOverlay).slideUp(mobileCollectionStorySlideTime).removeClass('active');
      $(this).parent().siblings('.shop-story-overlay').slideToggle(mobileCollectionStorySlideTime).toggleClass('active');
    }
  });
  // Reset shop story section
  function shopStoryReset() {
    if( window.innerWidth > desktopBreakPoint ) { // Desktop
      $('.shop-story-overlay').css('display', 'block'); // Make all overlays accessible
      $('.shop-story-btn').removeClass('active'); // Deactivate all buttons
    }
    else { // Mobile
      $('.shop-story-overlay.active').siblings('.inner').children('.shop-story-btn').addClass('active'); // activate button
      $('.shop-story-overlay').not('.active').css('display', 'none'); // Hide all other overlays
    }
  }
  shopStoryReset();
  $(window).resize ( function() {	shopStoryReset(); });









  // Toggle Wishlist buttons
  $('.wishlist-add').click( function() {
    $(this).toggleClass('active');
  });





  // Set parameters
	// Ref: http://kenwheeler.github.io/slick/
  // var slickSliderSettings = {
  //   adaptiveHeight: true,
  //   mobileFirst: true,
	// 	//autoplay: true,
	// 	autoplaySpeed: 10000,
	// 	cssEase: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)', // $ease_out_quint
	// 	dots: true,
	// 	arrows: true,
  //   nextArrow: '<button class="slick-next slick-arrow" aria-label="Next" type="button"></button>', // remove text from button
  //   prevArrow: '<button class="slick-prev slick-arrow" aria-label="Previous" type="button"></button>', // remove text from button
	// 	draggable: true,
	// 	swipe: true,
	// 	infinite: true,
	// 	pauseOnFocus: true,
	// 	pauseOnDotsHover: true,
	// 	slidesToShow: 1,
	// 	speed: 400,
	// 	waitForAnimate: true,
	// 	responsive: [ // More swipe-friendly on mobile
	//     // {
	//     //   breakpoint: 1199,
	//     //   settings: {
	//     //     cssEase: 'ease',
	// 		// 		speed: 300
	//     //   }
	//     // },
	// 		{
	//       breakpoint: 992, // mobile
	//       settings: {
	//         dots: false,
  //         //settings: "unslick",
	// 				//arrows: true,
	// 				//draggable: true,
	// 				//swipe: true,
	// 				speed: 400
	//       }
	//     }
	// 	]
  // };
  //
  // //
	// if( $('.slider').length ) {
	//   $('.slider').slick(slickSliderSettings);
	// } // end if












  // Footer menus open/close
  function footerMobileMenus() {

    if( window.innerWidth <= desktopBreakPoint ) { // Mobile
      // Only show active menus
      $('.footer-menu').children('ul').hide();
      $('.footer-menu.active').children('ul').show();
      // Click on menu heading
      $('.footer-menu > h3').off().click(function(e) {
        e.preventDefault();
        var thisFooterMenu = $(this).parent('.footer-menu');
        // Close all footer menus
        $('.footer-menu').not(thisFooterMenu).children('ul').slideUp(mobileMenuSlideTime);
        $('.footer-menu').not(thisFooterMenu).removeClass('active');
        // Open selected menu
        thisFooterMenu.children('ul').slideToggle(mobileMenuSlideTime);
        thisFooterMenu.toggleClass('active');
      });
    }
    else { // Desktop
      // Show all menus
      $('.footer-menu').children('ul').show();
      // Prevent interaction with menu heading
      $('.footer-menu > h3').off().click(function(e) {
        e.preventDefault();
      });
    }

  }
  footerMobileMenus();
  $(window).resize ( function() {	footerMobileMenus(); });








  // Form floating labels
  // On load
  $('.form-field.floating-label input, .form-field.floating-label select, .form-field.floating-label textarea').each( function() {
		if ($(this).val()) {
			$(this).parent('.form-field').addClass('open'); // Activate if field has content
		}
	});
  // On focus-on
	$('.form-field.floating-label input, .form-field.floating-label select, .form-field.floating-label textarea').focus( function() {
		// Check other inputs
		$(this).parent('.form-field').siblings('.form-field.floating-label').each( function() {
			if ($(this).children('input').val() == "") {
				$(this).removeClass('open'); // Reset label if input is empty
			}
		});
		// Minify current
		$(this).parent('.form-field').addClass('open');
	});
	// On focus-off
	$('.form-field.floating-label input, .form-field.floating-label select, .form-field.floating-label textarea').blur( function() {
		if (!$(this).val()) {
			$(this).parent('.form-field').removeClass('open'); // Reset label if input is empty
		}
	});




//}); // end document.ready
