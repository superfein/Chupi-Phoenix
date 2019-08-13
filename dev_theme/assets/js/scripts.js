$( document ).ready(function() {

  const desktopBreakPoint = 991; // Screen width in px




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







  var mobileMenuSlideTime = 200;

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
	headerScroll();
	$(window).scroll ( function() {	headerScroll(); });
	$(window).resize ( function() {	headerScroll(); });



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





  // Drawer close
  $('.drawer-header .close-btn, .drawer-back').off().click(function(e) {
    $(this).closest('.drawer').removeClass('active');
  });




  // Cart drawer open/close
  $('#cart-btn').off().click(function(e) {
    $('#cart-drawer').addClass('active');
  });




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




}); // end document.ready
