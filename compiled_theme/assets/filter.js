//$( document ).ready(function() {



// Sticky filter bar on scroll
function stickyFilterBar() {
  var filterButtonsPosTopDefault = $('#sort-filter').parent().offset().top; // Position when not sticky
  var filterBarPosTopDefault = $('#filter-bar').parent().offset().top; // Position when not sticky
  var headerHeight = $('header').outerHeight();
  var scrolled = $(window).scrollTop();

  if( window.innerWidth <= desktopBreakPoint ) { // Mobile only
    $('#filter-bar').removeClass('sticky'); // Remove desktop sticky
		if( scrolled >= (filterButtonsPosTopDefault - headerHeight) ) { // If past top and menu open
      $('#sort-filter').addClass('sticky');
		} else {
      $('#sort-filter').removeClass('sticky');
    }
  }
  else { // Desktop only
    $('#sort-filter').removeClass('sticky'); // Remove mobile sticky
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
$('#filter-button').off().click( function() {
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





// Sort dropdown
// Open sort dropdown
$('#sort-button').off().click( function() {
  $(this).siblings('.dropdown').toggleClass('active');
});
// Close sort dropdown with close button (mobile)
$('#sort-button').siblings('.dropdown').find('.close-btn').off().click( function() {
  $(this).closest('.dropdown').removeClass('active');
});
// Close product customise panel by clicking outside of panel (Desktop)
$('html').click(function(e) {
  if( (window.innerWidth > desktopBreakPoint) ) { // Desktop only
    var sortButton = $('#sort-button');
    var sortDropdown = sortButton.siblings('.dropdown');
    if (!sortButton.is(e.target) && sortDropdown.has(e.target).length === 0) {
      $(sortDropdown).removeClass('active');
    }
  }
});























// Define URL parameters
var urlFull = window.location.href; // full URL
var urlRoot = urlFull.split('collections/')[0]; // up to and excluding /collections/...
var currentCollection = urlFull.split('collections/')[1].split('?')[0].split('#')[0]; // term directly after /collections/

// console.log('urlFull: ' + urlFull);
// console.log('urlRoot: ' + urlRoot);
// console.log('currentCollection: ' + currentCollection);




// Define tag arrays here....



// Get sorting parameter
var urlSortParam = '';
if (urlFull.indexOf('?sort_by=') >= 1 ) {
  urlSortParam = urlFull.split('?sort_by=')[1]; // sorting parameter
}
//console.log('urlSortParam: ' + urlSortParam);



// Define sort-parameters
var sortDefault = '';
var sortBestSelling = 'best-selling';
var sortNewest = 'created-descending';
var sortOldest = 'created-ascending';
var sortHighestPrice = 'price-descending';
var sortLowestPrice = 'price-ascending';

// On load set current sort option
if (urlSortParam == sortBestSelling) {
  $('.collection-sort-option[data-sort-type="best-selling"]').addClass('active');
} else if (urlSortParam == sortNewest) {
  $('.collection-sort-option[data-sort-type="created-descending"]').addClass('active');
} else if (urlSortParam == sortOldest) {
  $('.collection-sort-option[data-sort-type="created-ascending"]').addClass('active');
} else if (urlSortParam == sortHighestPrice) {
  $('.collection-sort-option[data-sort-type="price-descending"]').addClass('active');
} else if (urlSortParam == sortLowestPrice) {
  $('.collection-sort-option[data-sort-type="price-ascending"]').addClass('active');
} else {
  $('.collection-sort-option[data-sort-type="default"]').addClass('active');
}

// Click sort option
$('.collection-sort-option').click( function() {
  // Change selected checkbox
  $(this).closest('ul').find('a').removeClass('active');
  $(this).addClass('active');
  // Go to new filtered URL
  var thisSortParam = $(this).attr('data-sort-type');
  window.location.href = urlRoot + 'collections/' + currentCollection + '?sort_by=' + thisSortParam;
});





//}); // end document.ready
