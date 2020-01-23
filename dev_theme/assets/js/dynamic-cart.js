//$( document ).ready(function() {

const openOnAddToBagDelay = 1000; // delay to allow add-to-bag button confirmation

// If Dynamic Cart is enabled on <body>
if ($('body').attr("data-dynamic-cart") === "true") {


  var cartItemCount = 0;
  const currency = $('body').attr('data-currency');
  const currencySymbol = $('body').attr('data-currency-symbol');
  const openOnAddToBag = true; // True = Open cart panel after a product is added to cart
  const detailNoteKeys = ['Size', 'Initials', 'Coordinates', 'Birthstone', 'Starsign', 'Zodiac']; // List of property notes
  const luxPackagingTitlePhrases = ['solid', 'accessory', 'notebook', 'gift coin', 'gift card'];
  const giftBoxPrice = $('#dynamic-cart').attr('data-gift-box-price');
  const giftBoxID = $('#dynamic-cart').attr('data-gift-box-id');



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


  // AJAX Callback function
  function getCartData(data) {
    // Parse AJAX data
    const parsedResponse = JSON.parse(data);
    // Get cart data
    cartItemCount = parsedResponse.item_count;
    var cartItems = parsedResponse.items;
    var cartTotalPrice = Shopify.formatMoney(parsedResponse.total_price.toString()).replace(/^.{1}/g, currencySymbol); // Replace the first character with current currency symbol
    //var cartTotalPrice = parsedResponse.total_price; // temp, use above comment ^^^
    if (currency === 'JPY') { // Trim from decimal if currency is Japanese Yen
      cartTotalPrice = cartTotalPrice.split('.00')[0];
    }
    let dhlDelivery = false;

    // Clear current cart data
    $('#dynamic-cart .drawer-main ul').children('li').not('.cart-item-template').remove();

    // If cart has items
    if (cartItemCount > 0) {

      // Hide cart-empty message
      $('#dynamic-cart .drawer-main .cart-empty').hide();

      // Get cart item data
      for (let i = 0; i < cartItems.length; i++) {
        let thisItemPriceFormatted = Shopify.formatMoney(cartItems[i].price).replace(/^.{1}/g, currencySymbol); // Replace the first character with current currency symbol
        //let thisItemPriceFormatted = cartItems[i].price; // temp, use above comment ^^^
        if (currency === 'JPY') { // Trim from decimal if currency is Japanese Yen
          thisItemPriceFormatted = thisItemPriceFormatted.split('.00')[0];
        }

        // Clone template cart item for this item
        var cartItemTemplate = $('#dynamic-cart .drawer-main ul li.cart-item-template').clone().removeClass('cart-item-template').addClass('current');
        $('#dynamic-cart .drawer-main ul').append(cartItemTemplate);
        // Populate this cart item template
        // If it's a gift box, add a class to it
        if (cartItems[i].id == giftBoxID){
          $('#dynamic-cart .drawer-main ul li.current').addClass('gift-box');
        }

        if(cartItems[i].properties){
          if (cartItems[i].properties.Packaging === 'Luxury Gifting Box'){
            $('#dynamic-cart .drawer-main ul li.current').addClass('packaging--lux');
          } else if (cartItems[i].properties.Packaging === 'Minimal Packaging'){
            $('#dynamic-cart .drawer-main ul li.current').addClass('packaging--minimal');
          }
        }
        // Give key to each item (good for deleting)
        $('#dynamic-cart .drawer-main ul li.current').attr('data-key', cartItems[i].key);
        // Give line index to each cart item (base 1)
        $('#dynamic-cart .drawer-main ul li.current').attr('data-line', i + 1);
        $('#dynamic-cart .drawer-main ul li.current').attr('data-item-properties', JSON.stringify(cartItems[i].properties));
        // Image as link
        $('#dynamic-cart .drawer-main ul li.current').children('div').eq(0).find('a').attr('href', cartItems[i].url).children('img').attr('src', cartItems[i].image).attr('alt', cartItems[i].image.alt);
        // Title
        var title = $('#dynamic-cart .drawer-main ul li.current').children('div').eq(1).find('.title');
        var cartItemTitleLowercase = cartItems[i].title.toLowerCase();
        // If item is a matching ring set (two separate ring sizes), use product title only
        if (cartItemTitleLowercase.indexOf('ring') >= 0 && cartItemTitleLowercase.indexOf('matching') >= 0 && cartItemTitleLowercase.indexOf('set') >= 0){
          title.attr('href', cartItems[i].url).children('h4').text(cartItems[i].product_title);
        } else { // else use standard title (includes ring size)
          title.attr('href', cartItems[i].url).children('h4').text(cartItems[i].title);
        }
        // Detail notes
        $.each(cartItems[i].properties, function(key, val) {
          var detailNote = '<span class="detail-note">' + key + ': ' + val + '</span>';
          if ($.inArray(key, detailNoteKeys) != -1) {
            $('#dynamic-cart .drawer-main ul li.current').children('div').eq(1).find('.detail-notes').append(detailNote);
          }
        });
        // Quantity
        $('#dynamic-cart .drawer-main ul li.current').children('div').eq(1).find('.qty select').val(cartItems[i].quantity).attr('data-variant-id', cartItems[i].variant_id);
        // Price
        $('#dynamic-cart .drawer-main ul li.current').children('div').eq(1).find('.price').text(thisItemPriceFormatted);
        // Luxury packaging price
        $('#dynamic-cart .drawer-main ul li.current').children('div').eq(1).find('.packaging-lux.add .packaging-option span').append(' + ' + makeCurrency(giftBoxPrice/100));

        // Packaging options (conditional)
        $.each(luxPackagingTitlePhrases, function(key, phrase) { // for each phrase
          if (cartItems[i].product_type.toLowerCase().indexOf(phrase) != -1) { // Check if title contains any of the phrases (defined at top)
            $('#dynamic-cart .drawer-main ul li.current').addClass('comp-gift-box');
          }
          if (cartItems[i].product_type.toLowerCase().indexOf('notebook') != -1) { // Check if title contains the phrase 'notebook'
            $('#dynamic-cart .drawer-main ul li.current').addClass('notebook-packaging');
          }
        });

        // If there's a solid gold piece, show the dhl delivery notice
        if (cartItems[i].product_type.toLowerCase().includes('solid')){
          dhlDelivery = true;
        }


        // Unmark as current
        $('#dynamic-cart .drawer-main ul li.current').removeClass('current');
      } // end for loop

      // Show DHL delivery option (outside the loop)
      if (dhlDelivery) {
        $('.totals-item.standard-delivery').hide();
        $('.totals-item.dhl-delivery').css('display', 'grid');
      } else {
        $('.totals-item.standard-delivery').css('display', 'grid');
        $('.totals-item.dhl-delivery').hide();
      }

      // Show cart footer
      $('#dynamic-cart .drawer-footer').show();
      // Update cart total
      $('#dynamic-cart #cart-total-price').text(cartTotalPrice);

      // Update Gift Boxes in total price
      if (countGiftBoxes() > 0){
        $('.totals-item.gift-boxes').css('display', 'grid');
        $('.totals-item.gift-boxes .value').text(makeCurrency((giftBoxPrice * countGiftBoxes())/100));
      } else {
        $('.totals-item.gift-boxes').hide();
        $('.totals-item.gift-boxes .value').text();
      }

      $('#cart-btn').addClass('active'); // Show active cart icon

    } // end if cart has items

    // Else if cart is empty
    else {
      $('#dynamic-cart .drawer-main .cart-empty').show(); // Show cart-empty message
      $('#dynamic-cart .drawer-footer').hide(); // Hide cart footer
      $('#cart-btn').removeClass('active'); // Show regular cart icon
    }

    // Update cart icon in header
    $('header .header-top .inner .corner-icons a.cart').text(cartItemCount);

    // When fully loaded, display contents
    //$('#dynamic-cart').addClass('ready');
  }

  // Init on load
  ajaxCall('GET', '/cart.js', getCartData);




  // Open Dynamic Cart
  function openDynamicCart() {
    $('#dynamic-cart').addClass('active');
    $('body').addClass('no-scroll');
    if( window.innerWidth > 450 ) { // Desktop only
      if (scrollbarWidth > 0) {
        $('body, header').css('padding-right', scrollbarWidth + 'px'); // add side padding to replace scrollbar width
      }
    }

    // function onTidioChatApiReady() {
    //   tidioChatApi.display(false); // hide Tidio
    // }
    // if (window.tidioChatApi) {
    //   window.tidioChatApi.on("ready", onTidioChatApiReady);
    // } else {
    //   document.addEventListener("tidioChat-ready", onTidioChatApiReady);
    // }
  }

  // Open Dynamic Cart (cart icon)
  $('#cart-btn').off().click(function(e) {
    e.preventDefault();
    openDynamicCart();
  });


  // Open Dynamic Cart (after Add-to-bag)
  $('.add-to-bag').click(function(e) {
    // Check if all customise fields have 'complete' class
    if (
      !$(this).hasClass('disabled') &&
      //$('#product-upper .product-info .customise-field').length == $('#product-upper .product-info .customise-field.complete').length ||
      $('.customise-section').length == $('.customise-section.complete').length // work with old and new verions for product template
    ) {
      if (openOnAddToBag == true) { // if setting is active
        // Hide cart-empty message
        $('#dynamic-cart .drawer-main .cart-empty').hide();
        setTimeout(function() { // delay to allow add-to-bag button confirmation
          ajaxCall('GET', '/cart.js', getCartData); // Get cart data
          openDynamicCart();
        }, openOnAddToBagDelay);
      }
    } // end if
  });

  // Open Dynamic Cart if URL contains parameter (link from Blog/Care)
  //$(document).ready(function() {
  if (window.location.href.indexOf("?cart=open") > -1) {
    openDynamicCart();
  }
  //});


  // Close Dynamic Cart (close button or underlay)
  $('#dynamic-cart .drawer-back, #dynamic-cart .close-btn').off().click(function(e) {
    $('#dynamic-cart').removeClass('active');
    $('body').removeClass('no-scroll');
    if( window.innerWidth > 450 ) { // Desktop only
      if (scrollbarWidth > 0) {
        $('body, header').css('padding-right', ''); // reset side padding
      }
    }
    // setTimeout(function() {
    //   tidioChatApi.display(true);
    // }, 200); // show Tidio after cart-drawer closes
  });


  // Change item quantity
  $('#dynamic-cart').on('change', '.cart-item .qty select', function() {

    var thisQty = $(this);
    var thisQtyVal = thisQty.val();
    var thisQtyItemVariantID = thisQty.attr('data-variant-id');
    const key = $(this).closest('.cart-item').attr('data-key');

    // Temporarily disable interaction
    $('#dynamic-cart').addClass('loading');

    var data = {
      id: thisQtyItemVariantID,
      quantity: thisQtyVal
    };
    var url = '/cart.js';

    jQuery.post(
      '/cart/update.js',
      'updates['+ key +']=' + thisQtyVal
      ,
      null,
      'json'
    ).then(function() {
      ajaxCall('GET', '/cart.js', getCartData); // Call updated data
      //console.log(cartItemCount);
    }).then(function() {
      //console.log(cartItemCount);
      $('#dynamic-cart').removeClass('loading'); // Re-enable interaction
//         window.setTimeout(function() {
        $('header .cart-count').text('Cart: ' + cartItemCount); // Update cart counter in header
//         }, 1000); // Allow for data return
    });

  }); // end quantity-adjust click


  // Remove item
  $('#dynamic-cart').on('click', '.cart-item .remove', function(e) {

    e.preventDefault();
    var thisQty = $(this).siblings('.qty').children('select');
    var thisQtyVal = thisQty.val();
    var thisQtyItemVariantID = thisQty.attr('data-variant-id');
    const itemProps = JSON.parse($(this).closest('.cart-item').attr('data-item-properties'));
    const key = $(this).closest('.cart-item').attr('data-key');

    // Fade-out cart-item
    $(this).closest('.cart-item').addClass('removed');

    // Temporarily disable interaction
    $('#dynamic-cart').addClass('loading');
    // If item has luxury gift box, remove one gift box from the cart
    if(itemProps && itemProps.Packaging === 'Luxury Gifting Box'){
      removeGiftBox().then(function(){

        jQuery.post(
          '/cart/update.js',
          'updates['+ key +']=0'
          ,
          null,
          'json'
        ).then(function() {
          ajaxCall('GET', '/cart.js', getCartData); // Call updated data
        }).then(function() {
          $('#dynamic-cart').removeClass('loading'); // Re-enable interaction
          $('header .cart-count').text('Cart: ' + cartItemCount); // Update cart counter in header
        });
      });
    } else {
      // Update cart
      jQuery.post(
        '/cart/update.js',
        'updates['+ key +']=0',
        null,
        'json'
      ).then(function() {
        ajaxCall('GET', '/cart.js', getCartData); // Call updated data
      }).then(function() {
        $('#dynamic-cart').removeClass('loading'); // Re-enable interaction
        $('header .cart-count').text('Cart: ' + cartItemCount); // Update cart counter in header
      });
    }
    // If that was the last item in the cart, close the cart
    if ($('#dynamic-cart .drawer-main ul li')){
      const remainingItems = document.querySelectorAll('#dynamic-cart .drawer-main ul li:not(.removed):not(.cart-item-template)');
      if (remainingItems.length === 0){
        // Close Dynamic Cart (close button or underlay)
        setTimeout(function() {
          $('#dynamic-cart').removeClass('active');
          $('body').removeClass('no-scroll');
          setTimeout(function() {
            ////tidioChatApi.display(true);
          }, 200); // show Tidio after cart-drawer closes
        }, openOnAddToBagDelay)
      }
    }
  }); // end remove item click







  /* --- PACKAGING --- */
  // Just adds one gift box to the cart
  function addGiftBox(){
    const payload = {
      id: parseInt(giftBoxID),
      quantity: 1
    }
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/cart/add.js');
      xhr.onreadystatechange = function(event) {
        if(xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(Error(xhr.statusText));

          }
        }
      }
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(payload));
    });
  };

  // Returns number of gift boxes
  function countGiftBoxes() {
    if (document.querySelector('li.cart-item.gift-box')){
      return document.querySelector('li.cart-item.gift-box div.qty select').value;
    } else {
      return 0;
    }

  };

  // Remove one gift box
  function removeGiftBox(){
    const payload = {
      id: giftBoxID,
    }
    payload.quantity = countGiftBoxes() - 1;
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/cart/change.js');
      xhr.onreadystatechange = function(event) {
        if(xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(Error(xhr.statusText));
          }
        }
      }
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(payload));
    });
  };

  // Sets packaging attribute on the line item
  function changePackagingAttribute(item, value){
    const lineItemIndex = item.attr('data-line');
    let props = JSON.parse(item.attr('data-item-properties'));
    const qty = item.find('div.qty select').val();
    props.Packaging = value;
    const payload = {
      line: lineItemIndex,
      properties: props,
      quantity: qty
    }
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/cart/change.js');
      xhr.onreadystatechange = function(event) {
        if(xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(Error(xhr.statusText));

          }
        }
      }
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(payload));
    });
  };

  function addMinimalPackaging(item) {
    return new Promise(function(resolve, reject){
      changePackagingAttribute(item, 'Minimal Packaging').then(function(){
        if (document.querySelector('li.cart-item.gift-box')){
          removeGiftBox().then(function() {
            ajaxCall('GET', '/cart.js', getCartData);
            resolve();
          });
        } else {
          ajaxCall('GET', '/cart.js', getCartData);
          resolve();
        }
      });
    })
  };


  // Open packaging overlays
  // Add luxury
  $('#dynamic-cart').on('click', '.cart-item .packaging-lux.add .packaging-option, .cart-item .packaging-lux.add .info-btn', function(e) {
    $(this).closest('.cart-item').addClass('packaging-info-open'); // mark this cart item
    $('.overlay.packaging-lux-add').addClass('active');
  });
  // Comp luxury
  $('#dynamic-cart').on('click', '.cart-item .packaging-lux.comp .info-btn', function(e) {
    $(this).closest('.cart-item').addClass('packaging-info-open'); // mark this cart item
    $('.overlay.packaging-lux-comp').addClass('active');
  });
  // Comp luxury notebook
  $('#dynamic-cart').on('click', '.cart-item.notebook-packaging .packaging-lux.comp .info-btn', function(e) {
    $(this).closest('.cart-item').addClass('packaging-info-open'); // mark this cart item
    $('.overlay.packaging-lux-comp-notebook').addClass('active');
  });
  // Add min
  $('#dynamic-cart').on('click', '.cart-item .packaging-basic .packaging-option', function(e) {
    $(this).closest('.cart-item').addClass('packaging-info-open'); // mark this cart item
    $('.overlay.packaging-min-add').addClass('active');
  });


  // Close all packaging overlays
  function closePackagingInfo() {
    $('#dynamic-cart .cart-item').removeClass('packaging-info-open'); // unmark all cart items (as open)
    $(".overlay.packaging").removeClass("active");
  }

  $('.overlay.packaging').off().click(function(e) {
    var thisOverlay = $(this);
    var modal = $(this).children('.modal');
    var closeButton = modal.find('.modal-close');
    // If outside modal is clicked OR if close button is clicked
    if (!modal.is(e.target) && thisOverlay.has(e.target).length === 0 || closeButton.is(e.target)) {
      //thisOverlay.removeClass('active');
      closePackagingInfo();
    }
  });


  // Add luxury packaging
  $('.overlay.packaging-lux-add .modal-main').find('.btn').on('click', function(e) {
    $('#dynamic-cart').addClass('loading'); // Temporarily disable interaction
    var thisQty = $('#dynamic-cart').find('.cart-item.packaging-info-open').find('select');
    var thisQtyItemVariantID = thisQty.attr('data-variant-id');
    var thisItemLineIndex = $('#dynamic-cart').find('.cart-item.packaging-info-open').attr('data-line');
    var thisItemProperties = $('#dynamic-cart').find('.cart-item.packaging-info-open').attr('data-item-properties');
    var thisItemProperties = JSON.parse(thisItemProperties);
    // Add the gift box to the cart
    changePackagingAttribute($('#dynamic-cart').find('.cart-item.packaging-info-open'), 'Luxury Gifting Box')
    .then(function(){
      addGiftBox().then(function() { // Add the box
        ajaxCall('GET', '/cart.js', getCartData);
      });

    })
    .then(function() {
      $('#dynamic-cart').removeClass('loading'); // Re-enable interaction
      closePackagingInfo();
    })
  });


  // Undo add luxury packaging
  $('#dynamic-cart').on('click', '.cart-item .packaging-lux.added .undo', function(e) {
    $('#dynamic-cart').addClass('loading'); // Temporarily disable interaction
    changePackagingAttribute($(this).closest('.cart-item'), 'Standard').then(function(){
      removeGiftBox().then(function(){
        $('#dynamic-cart').removeClass('loading');
        ajaxCall('GET', '/cart.js', getCartData);
      });
    });
  });


  // Add minimal packaging
  $('.overlay.packaging-min-add .modal-main').find('.btn').on('click', function(e) {
    $('#dynamic-cart').addClass('loading'); // Temporarily disable interaction
    addMinimalPackaging($('#dynamic-cart .cart-item.packaging-info-open'))
    .then(function(){
      $('#dynamic-cart').removeClass('loading');
      closePackagingInfo();
    });
  });


  // Undo add minimal packaging
  $('#dynamic-cart').on('click', '.cart-item .packaging-basic-selected .undo', function(e) {
    $('#dynamic-cart').addClass('loading'); // Temporarily disable interaction
    changePackagingAttribute($(this).closest('.cart-item'), 'Standard').then(function(){
      ajaxCall('GET', '/cart.js', getCartData);
      $('#dynamic-cart').removeClass('loading');
    });
  });








/* --- NOTE --- */

  // Order note (taken directly from chupi-cart.js)

//     function createOrderNote() {
//       let userNote =
//       let fullNote = userNote;
//       return fullNote;
//     }

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
  };
  additionalNoteProgress();


  // Expand order note
  $('#dynamic-cart .drawer-footer .add-note-btn').off().click(function(e) {
    $(this).toggleClass('active');
    $(this).siblings('.notes-wrapper').slideToggle(200).toggleClass('active');
  });

  // Edit note
  $(".notes-wrapper #note").on('change', function() {
    let cartNote = $(this).val();
    //console.log(document.getElementById('note'));
    //if (cartNote.length > 0) {
      jQuery.post('/cart/update.js', {
        note: cartNote,
      });
    //}
  });

} // end If Dynamic Cart is enabled in theme



//}); // end document.ready
