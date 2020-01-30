//$( document ).ready(function() {

  const desktopBreakPoint = 991; // Screen width in px
  const mobileMenuSlideTime = 200; // ms
  const mobileCollectionStorySlideTime = 200; // ms
  const transparentHeaderScrollTrigger = 100; // Pixels scrolled from top of viewport where transparent header becomes solid
  var transparentHeader = false;
  if ($('body').hasClass('transparent-header')) { // for pages with transparent header
    transparentHeader = true;
  }






  // Global AJAX call function
	function ajaxCall(method, url, callback) {
		var xmlhttp = new XMLHttpRequest();
		var response = '';
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE) { // XMLHttpRequest.DONE == 4
				if (xmlhttp.status == 200) {
					response = this.responseText;
					xmlhttp.onload = function() {
						callback(response);
					};
				} else if (xmlhttp.status == 400) {
					console.warn('There was an error 400 on the AJAX call');
				} else {
					console.warn('something else other than 200 was returned');
				}
			}
		};

		xmlhttp.open(method, url, true);
		xmlhttp.send();
	}
	// Define max number of products and product pages
	const ajaxMaxItems = 250;
	const totalProductCount = $('body').attr('data-product-count');
	const totalProductPages = Math.ceil(totalProductCount / ajaxMaxItems); // round up







  // Check if object is empty
  function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }






  // Make currency
  function makeCurrency(amount) {
    const symbol = document.body.getAttribute('data-currency-symbol');
    const trailingZeroes = document.body.getAttribute('data-currency-sample').includes('.00');
    if (trailingZeroes){
      if (typeof amount === 'string'){
        amount = parseInt(amount);
      }
      amount = amount.toFixed(2);
      let money = (symbol + amount);
      return money;
    } else {
      let money = symbol + amount;
      return money;
    }
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







  // Currency selector

  function submitFormOnChangeStandard(){
    const currencySelector = $('.currency-select');
    currencySelector.each(function() { // Apply to both desktop and mobile curreny selectors
      var form = $(this).children('form');
    	var select = form.children('select');
      select.on('change', function(){
        form.submit();
      });
    });
  }
  submitFormOnChangeStandard();

  function createFrontActive(option){
    const currencySelector = $('.currency-select');
    currencySelector.each(function() { // Apply to both desktop and mobile curreny selectors
      var frontActive = $(this).children('.currency-btn');
      frontActive.addClass('currency-' + option.value.toLowerCase());
      frontActive.html(option.value);
    });
  }

  function createFrontOption(option, appendTarget){
    var optionListItem = document.createElement('li');
    optionListItem.setAttribute('data-value', option.value);
    optionListItem.innerHTML = '<a href="javascript:;" class="currency-item">' + option.value + '</a>';
    optionListItem.querySelector('a').classList.add('currency-' + option.value.toLowerCase());
    if (option.selected){
      createFrontActive(option);
      optionListItem.classList.add('active');
    };
    appendTarget.append(optionListItem);
    //optionListItem.insertBefore(appendTarget.find())
  }

  function createFront(){
    const currencySelector = $('.currency-select');
    currencySelector.each(function() { // Apply to both desktop and mobile curreny selectors
      var form = $('#currency-select-mobile').children('form'); // Reference Shopify currency form (in mobile currency select)
    	var select = form.children('select');
      var options = Array.from(select.children('option'));
      var frontActive = $(this).children('.currency-btn');
      var frontList = $(this).children('.currency-list');

      options.map(option => {
        createFrontOption(option, frontList)
      });

      // Append back button to mobile currency
      if ($(this).is("#currency-select-mobile")) {
        frontList.append('<li><a href="javascript:;" class="currency-close-btn">Currency</a></li>');
      }
    });
  }
  createFront();

  function submitFormFromFront(){
    const currencySelector = $('.currency-select');
    currencySelector.each(function() { // Apply to both desktop and mobile curreny selectors
      var form = $('#currency-select-mobile').children('form'); // Reference Shopify currency form (in mobile currency select)
      var select = form.children('select');
      var options = Array.from(select.children('option'));
      var frontActive = $(this).children('.currency-btn');
      var frontList = $(this).children('.currency-list');
      var frontListItems = Array.from(frontList.children('li'));
      frontListItems.map(item => {
        item.addEventListener('click', function(){
          for (let i in options){
            if (options[i].value === item.getAttribute('data-value')){
              options[i].selected = true;
              form.submit();
              break;
            }
          }
        })
      })
    });
  }
  submitFormFromFront();



  // Move currency form location depending on window size
  //var currencyForm = $('#currency-select-mobile').children('form');
  // function currencyFormLocation(){
  //
  //   // $('#currency-select-mobile').children('.currency-list').clone().appendTo('#currency-select-desktop');
  //
  //   // if( window.innerWidth > desktopBreakPoint ) { // Desktop
  //   //   console.log('desktop');
  //   //   currencyForm.prependTo("#currency-select-desktop");
  //   // }
  //   // else { // Mobile
  //   //   console.log('mobile');
  //   //   currencyForm.prependTo("#desktop-select-desktop");
  //   // }
  // }
  // currencyFormLocation();
  //$(window).resize ( function() {	currencyFormLocation(); });








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







  // Collection pagination
  function collectionPagination() {
    // abbreviating 'pagination' to 'pag'
    let pagSection = $('#collection-pagination');
    let pagProgressBar = pagSection.find('#pagination-progress-bar');
    let pagProgress = pagProgressBar.children('#pagination-progress');
    let productsViewed = pagSection.find('#products-viewed');
    let loadMoreButton = pagSection.find('#pagination-load-more');

    var collectionTotalProducts = parseInt(pagSection.attr('data-total-products'));
    var pagStepSize = parseInt(pagSection.attr('data-pagination-step'));
    var pagTotalPages = parseInt(pagSection.attr('data-pagination-pages'));
    var productsLoaded = parseInt($('#collection-listing').find('.product-card').length);

    var currentPageIndex = 1;
    var nextPageUrl = pagSection.attr("data-next-page-url");
    var filterApplied = nextPageUrl.split("&")[1];
    var pageToFetch = nextPageUrl.split("=")[0] + "=" + (currentPageIndex + 1) + "&" + filterApplied;

    function countProductsLoaded() {
      productsLoaded = $('#collection-listing').find('.product-card').length;
      return productsLoaded;
    }

    // Update progress bar on load
    var percentageViewed = 100 * (productsLoaded/collectionTotalProducts);
    pagProgress.css('width', percentageViewed + '%');

    // Update progress bar before ajax call by increasing by pagination step size
    function updateProgressBar() {
      percentageViewed = 100 * ((productsLoaded + pagStepSize)/collectionTotalProducts);
      pagProgress.css('width', percentageViewed + '%');
    }

    loadMoreButton.click(function() {
      // Update progress bar
      pagProgress.addClass('active');
      updateProgressBar();
      // Get data from next page of products
      $.ajax({
        url: pageToFetch,
        success: function(result) {
          // Find product-cards from next page and append
          let newItems = $(result).find('.product-card');
          newItems.each( function(i) {
            newItem = $(newItems[i]).wrap( "<div class='grid-item'></div>" ); // Wrap each product-card in a grid-item
            $(newItem.parent()).insertBefore($("#collection-pagination")); // Append new wrapped item to the list before pagination section
          });
          // Update products-viewed text in pagination section
          productsViewed.text(countProductsLoaded());
        }
      }).done(function() {
        // pagProgress.removeClass('active'); // Reset progress bar state
        pagProgress.removeClass('active'); // Reset progress bar state
        // Update pagination data
        currentPageIndex++;
        pageToFetch = nextPageUrl.split("=")[0] + "=" + (currentPageIndex + 1) + "&" + filterApplied;
        pagSection.attr('data-next-page-url', pageToFetch);
        // If pagination complete, apply feedback
        if (currentPageIndex == pagTotalPages) {
          loadMoreButton.fadeOut();
          //loadMoreButton.text('Complete').addClass('disabled');
          pagSection.find('p').text('Viewing all ' + collectionTotalProducts + ' items in this collection');
        }
      });

    }); // end click

	}
  if ($('#collection-pagination').length) {
    collectionPagination();
  }









  // Compressed text
  $('.compressed-text').each( function() {
    var thisCompText = $(this);
    var expandToggle = thisCompText.children('.expand-toggle');
    // Apply compressed text if content has more than one paragraph
    if (thisCompText.children('.inner').children('p').length > 1) {
      expandToggle.show();
      expandToggle.off().click(function(e) {
        thisCompText.toggleClass('active');
      });
    }
  });







  // Metal switcher
  function metalSwitcher() {

    // Switch metal
    $('body').on('click', '.metal-switch', function() { // Work for existing metal-switches and dynamically rendered metal-switches

      // Make active
      $(this).siblings().removeClass('active');
      $(this).addClass('active');

      // Product card only
      if ($(this).closest('.product-card').length) {

        var thisProductCard = $(this).closest('.product-card');
        var thisProductCardFirstImage = thisProductCard.children('.inner').find('img');
        var thisProductCardTitle = thisProductCard.find('h3');
        var thisProductCardPrice = thisProductCard.find('.price');
        var thisProductCardUrl = thisProductCard.children('.inner').find('a');
        var thisProductCardBodyImage = thisProductCard.children('img');

        thisProductCard.addClass('no-hover'); // Disable hover effect

        // Change data based on metal selection
        var selectedAltMetalIndex = $(this).attr('data-alt-metal-index'); // index of 0 is default setting
        thisProductCardFirstImage.attr('src', thisProductCardFirstImage.attr('data-alt-metal-'+selectedAltMetalIndex+'-first-image')); // Change first image
        thisProductCardTitle.text(thisProductCardTitle.attr('data-alt-metal-'+selectedAltMetalIndex+'-title')); // Change title
        thisProductCardPrice.text(thisProductCardPrice.attr('data-alt-metal-'+selectedAltMetalIndex+'-price')); // Change price
        thisProductCardUrl.attr('href', thisProductCardUrl.attr('data-alt-metal-'+selectedAltMetalIndex+'-link')); // Change URL
        thisProductCardBodyImage.attr('src', thisProductCardBodyImage.attr('data-alt-metal-'+selectedAltMetalIndex+'-body-image')); // Change first image
        thisProductCard.attr('data-product-id', thisProductCard.attr('data-alt-metal-'+selectedAltMetalIndex+'-product-id')); // Change product ID

      }
    });

    // Reset hover effect on mouseleave
    $('body').on('mouseleave', '.product-card.no-hover', function() {
      $(this).removeClass('no-hover');
    });

  }
  //if ($('.metal-switch').length > 0) {
    metalSwitcher(); // No conditional call as some metal switchers are not present in the DOM on load
  //}








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






  // Press carousel
  $('#press-articles').find('.carousel-item a').off().click(function(e) {
    $(this).siblings('.press-overlay').addClass('active');
  });





  // Updgrade instructions section
  //function upgradeIntructions() {

    // Set min height of instruction panels
    // var minHeight = -1;
    // $('#upgrade-program-instructions').find('.instruction-panel').each(function() {
    //  minHeight = minHeight > $(this).outerHeight() ? minHeight : $(this).outerHeight();
    // });
    // $('#upgrade-program-instructions').find('.instruction-panels').css('min-height', minHeight);
    //
    //
    // // Toggle between instruction panels
    // var prevButton = $('#upgrade-program-instructions').find('.instruction-panel .top .prev');
    // var nextButton = $('#upgrade-program-instructions').find('.instruction-panel .top .next');
    // $('#product-press').find('.press-logo').click( function() {
    //   currentPressLogo = $(this);
    //   // Assign current class
    //   $('#product-press').find('.press-logo').removeClass('current');
    //   $(this).addClass('current');
    //   // Move underline
    //   var thisLogoIndex = $('.press-logo').index(this);
    //   $(this).siblings('.underline').css({
    //     'width' : parseInt($('#product-press').find('.press-logo.current').innerWidth()),
    //     'left' : parseInt($('#product-press').find('.press-logo.current').position().left)
    //   });
    //   // Show matching quote
    //   $('#product-press').find('.press-quote').removeClass('active');
    //   $('#product-press').find('.press-quote').eq(thisLogoIndex).addClass('active');
    // });




    // Slick Slider - set parameters (Ref: http://kenwheeler.github.io/slick/)
    var slickSliderSettings = {
      adaptiveHeight: true,
      mobileFirst: true,
  		//autoplay: true,
  		autoplaySpeed: 10000,
  		cssEase: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)', // $ease_out_quint
  		dots: false,
  		arrows: true,
      nextArrow: '<button class="slick-next slick-arrow" aria-label="Next" type="button"></button>', // remove text from button
      prevArrow: '<button class="slick-prev slick-arrow" aria-label="Previous" type="button"></button>', // remove text from button
  		draggable: true,
  		swipe: true,
      swipeToSlide: true,
      touchThreshold: 200,
      touchMove: true,
  		infinite: true,
  		pauseOnFocus: true,
  		pauseOnDotsHover: true,
  		slidesToShow: 1,
  		speed: 300,
  		waitForAnimate: true,
  		responsive: [ // More swipe-friendly on mobile
  			{
  	      breakpoint: 992, // desktop
  	      settings: {
  					speed: 400
  	      }
  	    }
  		]
    };
  	// if( $('.slider').length ) {
  	//   $('.slider').slick(slickSliderSettings);
    //   $('.slider').removeClass('loading'); // Show slider after fully loaded
    //   //$('.slick-slide').bind('touchstart', function(){ console.log('touchstart'); });
  	// }

  //}
  if ($('#upgrade-program-instructions').length > 0) {
    $('#upgrade-program-instructions').find('.slider').slick(slickSliderSettings);
    // upgradeIntructions();
    // $(window).resize(function() { upgradeIntructions(); }); // on resize
  }








  function carouselDragScroll() {

    // Ref: https://stackoverflow.com/questions/5766297/handle-click-and-drag-movement-to-scroll-horizontally-with-mootools-or-jquery#answer-5839943
    var x,left,down,parentLinkElement,parentLink;
    var scrollPreventdefaultMargin = 20; // Distance to drag before links get disabled
    var carousel = $('.carousel .carousel-track');

    carousel.mousedown(function(e){
      if (e.which === 1) { // on left-click only
        down = true;
        x = e.pageX; // Get X position of cursor
        left = carousel.scrollLeft(); // Get scroll position of carousel
        if (e.target.closest('a')) {
          parentLinkElement = e.target.closest('a'); // Determine link element
          parentLink = parentLinkElement.getAttribute('href'); // Get link URL
        }
        e.preventDefault(); // Important - Cancels left-click specific mousedown register
      }
    });

    $("body").mousemove(function(e){
        if(down){ // Drag
          var newX = e.pageX;
          if (Math.abs(x-newX) > scrollPreventdefaultMargin) { // if dragged more than set margin
            parentLinkElement.setAttribute('href', 'javscript:;'); // Temporarily remove link URL
            carousel.addClass('dragging');
          }
          carousel.scrollLeft(left - newX + x); // Scroll carousel with drag
        }
    });

    //$("body").mouseup(function(e){
    $('body').on('mouseup mouseleave', function(e) { // Reset on mouseup OR when the mouse leaves the window
      setTimeout( function() {
        parentLinkElement.setAttribute('href', parentLink); // Reset original link URL
      }, 10);
      carousel.removeClass('dragging');
      down = false; // Reset to default behaviour
    });
  }

  if ($('.carousel').length) {
    carouselDragScroll();
  }












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










  // Make Currency
  function makeCurrency(amount, commas) {
    const symbol = document.body.getAttribute('data-currency-symbol');
    const trailingZeroes = document.body.getAttribute('data-currency-sample').includes('.00');
    if (trailingZeroes){
      if (typeof amount === 'string'){
        amount = parseInt(amount);
      }
      amount = amount.toFixed(2);
      if (commas === true){
        amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      let money = (symbol + amount);
      return money;
    } else {
      if (commas === true){
        amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      let money = symbol + amount;
      return money;
    }
  }













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
