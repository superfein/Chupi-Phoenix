//$( document ).ready(function() {

  const desktopBreakPoint = 991; // Screen width in px
  const mobileMenuSlideTime = 200; // ms




  // Reset mega menus on resize
  function megaMenuReset() {
    if( window.innerWidth > desktopBreakPoint ) { // Desktop
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
    if($('#main-nav').hasClass('active') && !$('header').hasClass('scrolled')) { // if menu open at top
			$('header').addClass('solid');
		} else if (!$('#main-nav').hasClass('active') && !$('header').hasClass('scrolled')) { // if menu closed at top
      $('header').removeClass('solid');
    } else if ($('#main-nav').hasClass('active') && $('header').hasClass('scrolled')) { // if menu open past top
      $('header').addClass('solid');
    } else if ($('#main-nav').hasClass('active') && $('header').hasClass('scrolled')) { // if menu closed past top
      $('header').addClass('solid');
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

  // Mobile currency open
  $('#main-nav .currency-btn').off().click( function() {
    $('#main-nav > ul').toggleClass('slide-out');
  });
  // Mobile currency close
  $('#main-nav .currency-close-btn').off().click( function() {
    $('#main-nav > ul').toggleClass('slide-out');
  });


  // Change header state on scroll
	function headerScroll() {
    var scrollTrigger = 10; // pixels from top for scroll state to take action
	  var scrolled = $(window).scrollTop();
		if( scrolled > scrollTrigger && $('#main-nav').hasClass('active') ) { // If past top and menu open
			$('header').addClass('solid scrolled');
		} else if( scrolled > scrollTrigger && !$('#main-nav').hasClass('active') ) { // If past top and menu closed
			$('header').addClass('solid scrolled');
		} else if( scrolled <= scrollTrigger && $('#main-nav').hasClass('active') ) { // If at top and menu open
			$('header').addClass('solid').removeClass('scrolled');
		} else if( scrolled <= scrollTrigger && !$('#main-nav').hasClass('active') ) { // If at top and menu closed
			$('header').removeClass('solid scrolled');
		}

    if( window.innerWidth > desktopBreakPoint && scrolled <= scrollTrigger ) { // If is desktop and at top
      $('header').removeClass('solid scrolled');
    }
	}
	// headerScroll();
	// $(window).scroll ( function() {	headerScroll(); });
	// $(window).resize ( function() {	headerScroll(); });



  // Hover on top level menu items (desktop only)
  $('#main-nav > ul > li > a').hover(function(e) {
    if( window.innerWidth > desktopBreakPoint ) { // Desktop only
      var thisTopLevelItem = $(this);
      // Make header solid
      $('header').addClass('solid');
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
      // Reset header if not scrolled
      if (!$('header').hasClass('scrolled')) {
        $('header').removeClass('solid');
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
      // Make header solid
      $('header').addClass('solid');
      // Show menu underline
      $('#main-nav > ul > .underline').addClass('active');
      // Show this mega menu and mega-menu background
      $(this).addClass('active');
      $('#mega-menu-bg').addClass('active');
    }
  },function(e) {
    if( window.innerWidth > desktopBreakPoint ) { // Desktop only
      // Reset header if not scrolled
      if (!$('header').hasClass('scrolled')) {
        $('header').removeClass('solid');
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
    $('body').css('overflow', 'hidden');
    if (scrollbarWidth > 0) {
      $('body').css('padding-right', scrollbarWidth + 'px'); // add side padding to replace scrollbar width
      $('header .inner').css('padding-right', scrollbarWidth + 'px'); // add side padding to replace scrollbar width
    }
  }
  function unlockPageScroll() { // Unlock scroll
    $('body').css({ 'overflow' : '', 'padding-right' : '' });
    $('header .inner').css('padding-right', '');
  }




  // Drawer close
  $('.drawer-header .close-btn, .drawer-back').off().click(function(e) {
    unlockPageScroll(); // Unlock page scroll
    $(this).closest('.drawer').removeClass('active');
  });




  // Cart drawer open/close
  $('#cart-btn').off().click(function(e) {
    lockPageScroll(); // Lock page scroll
    $('#cart-drawer').addClass('active');
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





  // Add to wishlist
  $('.wishlist-add').off().click( function() {
    $('.wishlist-add').toggleClass('active');
  });





  // Set parameters
	// Ref: http://kenwheeler.github.io/slick/
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
		infinite: true,
		pauseOnFocus: true,
		pauseOnDotsHover: true,
		slidesToShow: 1,
		speed: 400,
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
	      breakpoint: 992, // mobile
	      settings: {
	        dots: false,
          //settings: "unslick",
					//arrows: true,
					//draggable: true,
					//swipe: true,
					speed: 400
	      }
	    }
		]
  };

  //
	if( $('.slider').length ) {
	  $('.slider').slick(slickSliderSettings);
	} // end if












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








  // Form labels
  // On focus-on
	$('.form-field input, .form-field select, .form-field textarea').focus( function() {
		// Check other inputs
		$(this).parent('.form-field').siblings('.form-field').each( function() {
			if ($(this).children('input').val() == "") {
				$(this).removeClass('open'); // Reset label if input is empty
			}
		});
		// Minify current
		$(this).parent('.form-field').addClass('open');
	});
	// On focus-off
	$('.form-field input, .form-field select, .form-field textarea').blur( function() {
			if (!$(this).val()) {
				$(this).parent('.form-field').removeClass('open'); // Reset label if input is empty
			}
	});




//}); // end document.ready
