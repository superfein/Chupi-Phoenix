//$( document ).ready(function() {





    var relatedProductCard = $('.related-products').find('.product-card');
    var fetchProductLimit = $('.related-products').attr('data-related-product-count');






    function makeMetalSwitcher(productCard, relatedProduct, metalTag) {

      // Declare variables and objects
      var defaultMetal = metalTag.split('metal:')[1];
      var altMetal1, altMetal2, altMetal1ProductHandle, altMetal2ProductHandle;
      var altMetal1Data = {}, altMetal2Data = {};
      var altMetal1hasData = false, altMetal2hasData = false;
      var handle = relatedProduct.handle;

      // Create alt metal handles
      if (defaultMetal == 'solid-gold') {
        altMetal1 = 'solid-white-gold';
        altMetal2 = 'solid-rose-gold';
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

      //ajaxCall('GET', window.location.protocol + '//' + window.location.hostname + '/products/' + altMetal1ProductHandle + '.json', altMetal1Ajax);
      var data;
      $.ajax({
        type: "GET",
        url: window.location.protocol + '//' + window.location.hostname + '/products/' + altMetal1ProductHandle + '.json',
        data: data,
        dataType: "json"
      }).done(function(data) {
        altMetal1hasData = true;
        altMetal1Ajax(data);
      })
      .fail(function() {
        altMetal1hasData = false;
        altMetal1Ajax(data);
      });

      // Get product data for alt metal 1
      function altMetal1Ajax(data) {

        var product = data.product;
        altMetal1Data.id = product.id;
        altMetal1Data.title = product.title;
        altMetal1Data.url = '/products/' + product.handle;
        altMetal1Data.price = product.price;
        altMetal1Data.firstImage = product.images[0].src;
        altMetal1Data.bodyImage = product.images[1].src;
        $.each(product.images, function(key, val) { // Check for on-body shot
          if (val.alt == 'on-body-shot') {
            altMetal1Data.bodyImage = key.src;
          }
        });
        // After altMetal1Ajax, call altMetal2Ajax
        $.ajax({
          type: "GET",
          url: window.location.protocol + '//' + window.location.hostname + '/products/' + altMetal2ProductHandle + '.json',
          data: data,
          dataType: "json"
        }).done(function(data) {
          altMetal2hasData = true;
          altMetal2Ajax(data);
        })
        .fail(function() {
          altMetal2hasData = false;
          altMetal2Ajax(data);
        });

      }

      function altMetal2Ajax(data) {

        var product = data.product;
        altMetal2Data.id = product.id;
        altMetal2Data.title = product.title;
        altMetal2Data.url = '/products/' + product.handle;
        altMetal2Data.price = product.price;
        altMetal2Data.firstImage = product.images[0].src;
        altMetal2Data.bodyImage = product.images[1].src;
        $.each(product.images, function(key, val) { // Check for on-body shot
          if (val.alt == 'on-body-shot') {
            altMetal2Data.bodyImage = key.src;
          }
        });
        // After altMetal2Ajax, make switches and append data attributes
        makeMetalSwitches();
        altMetalDataAttributes();
      }

      function makeMetalSwitches() {

        // If the default metal and at least one alt metal exists
        if (defaultMetal !== '' && altMetal1hasData == true || altMetal2hasData == true) {
          // Make switcher element
          $('<div class="metal-switcher"></div>').insertBefore(productCard.find('.price'));

          // Make Solid Gold switch
          if (defaultMetal == 'solid-gold') {
            $('<a href="javascript:;" class="metal-switch solid-gold active" data-alt-metal-index="0"></a>').appendTo(productCard.find('.metal-switcher'));
          } else if (altMetal1 == 'solid-gold' && altMetal1hasData == true) {
            $('<a href="javascript:;" class="metal-switch solid-gold" data-alt-metal-index="1"></a>').appendTo(productCard.find('.metal-switcher'));
          } else if (altMetal2 == 'solid-gold' && altMetal2hasData == true) {
            $('<a href="javascript:;" class="metal-switch solid-gold" data-alt-metal-index="2"></a>').appendTo(productCard.find('.metal-switcher'));
          } else {
            // No Solid Gold switch
          }

          // Make Solid White Gold switch
          if (defaultMetal == 'solid-white-gold') {
            $('<a href="javascript:;" class="metal-switch solid-white-gold active" data-alt-metal-index="0"></a>').appendTo(productCard.find('.metal-switcher'));
          } else if (altMetal1 == 'solid-white-gold' && altMetal1hasData == true) {
            $('<a href="javascript:;" class="metal-switch solid-white-gold" data-alt-metal-index="1"></a>').appendTo(productCard.find('.metal-switcher'));
          } else if (altMetal2 == 'solid-white-gold' && altMetal2hasData == true) {
            $('<a href="javascript:;" class="metal-switch solid-white-gold" data-alt-metal-index="2"></a>').appendTo(productCard.find('.metal-switcher'));
          } else {
            // No Solid White Gold switch
          }

          // Make Solid Rose Gold switch
          if (defaultMetal == 'solid-rose-gold') {
            $('<a href="javascript:;" class="metal-switch solid-rose-gold active" data-alt-metal-index="0"></a>').appendTo(productCard.find('.metal-switcher'));
          } else if (altMetal1 == 'solid-rose-gold' && altMetal1hasData == true) {
            $('<a href="javascript:;" class="metal-switch solid-rose-gold" data-alt-metal-index="1"></a>').appendTo(productCard.find('.metal-switcher'));
          } else if (altMetal2 == 'solid-rose-gold' && altMetal2hasData == true) {
            $('<a href="javascript:;" class="metal-switch solid-rose-gold" data-alt-metal-index="2"></a>').appendTo(productCard.find('.metal-switcher'));
          } else {
            // No Solid Rose Gold switch
          }
        } // end if

      } // end makeMetalSwitches()


      function altMetalDataAttributes() {

        var productCardFirstImage = productCard.children('.inner').find('img');
        var productCardTitle = productCard.find('h3');
        var productCardPrice = productCard.find('.price');
        var productCardUrl = productCard.children('.inner').find('a');
        var productCardBodyImage = productCard.children('img');

        // Apply alt metal data attributes to make ready for switching
        // Product ID
        productCard.attr('data-alt-metal-0-product-id', productCard.attr('data-product-id')).attr('data-alt-metal-1-product-id', altMetal1Data.id).attr('data-alt-metal-2-product-id', altMetal2Data.id);
        // Body image
        productCardBodyImage.attr('data-alt-metal-0-body-image', productCardBodyImage.attr('src')).attr('data-alt-metal-1-body-image', altMetal1Data.bodyImage).attr('data-alt-metal-2-body-image', altMetal2Data.bodyImage);
        // First image
        productCardFirstImage.attr('data-alt-metal-0-first-image', productCardFirstImage.attr('src')).attr('data-alt-metal-1-first-image', altMetal1Data.firstImage).attr('data-alt-metal-2-first-image', altMetal2Data.firstImage);
        // Title
        productCardTitle.attr('data-alt-metal-0-title', productCardTitle.text()).attr('data-alt-metal-1-title', altMetal1Data.title).attr('data-alt-metal-2-title', altMetal2Data.title);
        // URL
        productCardUrl.attr('data-alt-metal-0-link', productCardUrl.attr('href')).attr('data-alt-metal-1-link', altMetal1Data.url).attr('data-alt-metal-2-link', altMetal2Data.url);
        // Price
        productCardPrice.attr('data-alt-metal-0-price', productCardPrice.text()).attr('data-alt-metal-1-price', altMetal1Data.price).attr('data-alt-metal-2-price', altMetal2Data.price);

      } // end altMetalDataAttributes()


    } // end makeMetalSwitcher()









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
        relatedProductCard.eq(i).find('.metal-switcher').remove(); // Remove existing metal switcher
        // Check all tags for 'metal:' substring
        let hasMetalTag = false;
        $.each(tags, function(key, val) {
          if (val.indexOf('metal:solid') >= 0) {
            hasMetalTag = true;
            var metalTag = val;
            makeMetalSwitcher(relatedProductCard.eq(i), products[i], metalTag); // Make new metal switcher and apply alt metal data attributes
            return false; // Break
          }
        });

        // Apply data to related product cards
        relatedProductCard.eq(i).children('.inner').find('.upper a').attr('href', url); // URL
        relatedProductCard.eq(i).children('.inner').children('a').attr('href', url); // URL
        relatedProductCard.eq(i).children('.inner').find('img').attr('src', firstImageUrl).attr('alt', title); // First image 
        relatedProductCard.eq(i).children('img').attr('src', onBodyImageUrl).attr('alt', title); // Second image (rollover)
        relatedProductCard.eq(i).children('.inner').find('h3').text(title); // Title
        relatedProductCard.eq(i).find('.price').text(price); // Price
        relatedProductCard.eq(i).attr('data-product-id', productId); // Product ID
        relatedProductCard.eq(i).attr('data-first-variant-id', productFirstVariantId); // First variant ID
        // if (Appmate.wk.getProduct(productId) !== null) { // If this item is in Wishlist, set active state
        //   productSlots[i].querySelector('.recommended-wishlist-add').classList.add('active');
        // }
      }

    });









//}); // end document.ready
