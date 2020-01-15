//$( document ).ready(function() {




// Account orders menu
function accountOrdersMenu() {
  var section = $('#account-signed-in');
  var currentMenuItem = $('#account-signed-in').find('.account-menu .account-links').children('li.current');
  var returnToMenu = $('#account-signed-in').find('.account-main').find('.account-menu-return');

  if( window.innerWidth <= desktopBreakPoint ) { // Mobile only
    // Init display - check for orders parameter
    if (window.location.href.indexOf("?menu-open") > -1) {
      section.addClass('account-menu-active');
    }
  }
  // Pan between menu/main
  currentMenuItem.click( function() {
    if( window.innerWidth <= desktopBreakPoint ) { // Mobile only
      section.removeClass('account-menu-active');
    }
  });
  returnToMenu.click( function() {
    if( window.innerWidth <= desktopBreakPoint ) { // Mobile only
      section.addClass('account-menu-active');
    }
  });

}
if ($('#account-signed-in').length) {
  accountOrdersMenu();
	$(window).resize ( function() {	accountOrdersMenu(); });
}







// Account addresses
function accountAddresses() {
  var addressesSection = $('#addresses');
  var addressSingleSection = $('.address-single');
  var addressSingleTrigger = $('.address-add, .address-edit');
  var returnToAddresses = $('.addresses-return');

  addressSingleTrigger.click( function() {
    addressesSection.removeClass('active');
    addressSingleSection.addClass('active');
  });
  returnToAddresses.click( function() {
    addressSingleSection.removeClass('active');
    addressesSection.addClass('active');
  });
}
if ($('#addresses').length) {
  accountAddresses();
}







// Account address preview
function accountAddressPreview() {

  function reflectInputInPreview(thisInput) {
    $('.address-single .preview').find('span').each( function() {
      var thisPreviewLine = $(this);
      thisPreviewLineMatchingInput = $(this).attr('data-matching-input-name');
      if(thisPreviewLineMatchingInput == thisInput.attr('name')) {
        if (thisInput.val().length === 0) {
          thisPreviewLine.removeClass('active');
        } else {
          thisPreviewLine.addClass('active').text(thisInput.val());
        }
      }
    });
  }
  // Set Preview on load
  $('.address-single').find('.form-field').children('input').each( function() {
    var thisInput = $(this);
    reflectInputInPreview($(this));
  });
  // Update Preview on
  $('.address-single').find('.form-field').children('input').keyup(function(e) {
    var thisInput = $(this);
    reflectInputInPreview(thisInput);
  });

}
if ($('#addresses').length) {
  accountAddressPreview();
}







//}); // end document.ready
