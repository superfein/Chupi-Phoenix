//$( document ).ready(function() {





//-------------- Event handling -------------- //

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
// Select filter section
const filterSectionSlideTime = 200;
$('.filter-section > a').off().click( function() {
  var thisFilterSection = $(this).closest('.filter-section');
  // Open
  if (!thisFilterSection.hasClass('active')) {
    $('.filter-section').not(thisFilterSection).children('.inner').slideUp(filterSectionSlideTime);
    $('.filter-section').not(thisFilterSection).removeClass('active');
    thisFilterSection.children('.inner').slideDown(filterSectionSlideTime);
    thisFilterSection.addClass('active');
  }
  // Close
  else {
    thisFilterSection.children('.inner').slideUp(filterSectionSlideTime);
    thisFilterSection.removeClass('active');
  }
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























// Define URL parts
var urlFull = window.location.href; // full URL
var urlRoot = urlFull.split('collections/')[0]; // up to and excluding /collections/...
var currentCollection = urlFull.split('collections/')[1].split('/')[0].split('?')[0].split('#')[0]; // term directly after /collections/

// console.log('urlFull: ' + urlFull);
// console.log('urlRoot: ' + urlRoot);
// console.log('currentCollection: ' + currentCollection);







//-------------- Sort -------------- //

// Get sorting parameter
var urlSortParam = '';
if (urlFull.indexOf('?sort_by=') >= 1 ) {
  urlSortParam = urlFull.split('?sort_by=')[1]; // sorting parameter
}

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

var urlSortString = '';
if (urlSortParam !== '') {
  urlSortString = '?sort_by=' + urlSortParam;
}

// Click sort option
$('.collection-sort-option').click( function() {
  // Change selected checkbox
  $(this).closest('ul').find('a').removeClass('active');
  $(this).addClass('active');
  // Go to new filtered URL
  var thisSortParam = $(this).attr('data-sort-type');
  if (thisSortParam == 'default') {
    urlSortString = '';
  } else {
    urlSortString = '?sort_by=' + thisSortParam;
  }
  window.location.href = urlRoot + 'collections/' + currentCollection + selectedTagsString + urlSortString;
});












//-------------- Filter -------------- //

var urlAllTags = {};

// Get Metal tag
var urlMetalTag;
if (urlFull.indexOf('metal:') >= 1 ) {
  urlMetalTag = 'metal:' + urlFull.split('metal:')[1].split('+')[0].split('?')[0];
  urlAllTags.metal = urlMetalTag; // Apply metal parameter to object
}
// Get Piece tag
var urlPieceTag;
if (urlFull.indexOf('piece:') >= 1 ) {
  urlPieceTag = 'piece:' + urlFull.split('piece:')[1].split('+')[0].split('?')[0];
  urlAllTags.piece = urlPieceTag; // Apply piece parameter to object
}

// On Load:  Activate filter tags that are in URL
function activateTagsFromUrl() {
  $.each(urlAllTags, function(filterSection, tag){
    $('.filter-option[data-tag="'+tag+'"]').parent('li').addClass('active');
  });
  // // If no options checked in a section, check 'All' option
  $('.filter-section').each( function() {
    var thisFilterSection = $(this);
    if (!thisFilterSection.find('ul li.active').length) {
      thisFilterSection.find('.filter-option.all').parent('li').addClass('active');
    }
  });
}
activateTagsFromUrl(); // On load

var selectedTags = urlAllTags;
var selectedTagsString = ''; // str

// Compile selected tags string
function makeTagsString(selectedTags) {
  selectedTagsString = ''; // Reset string
  if ($.isEmptyObject(selectedTags) == false) { // if tags object is not empty
    $.each(selectedTags, function(filterSection, tag){
      if (tag.indexOf(':all') == -1) { // only if tag doesn't contain ':all'
        selectedTagsString += tag + '+'; // append tag and '+'
      }
    });
    selectedTagsString = '/' + selectedTagsString.slice(0,-1); // Prepend '/' and trim last '+'
  }
}
makeTagsString(selectedTags); // Call on load

// Update selected tags
function updateSelectedTags(selectedTag) {
  selectedTagType = selectedTag.split(':')[0];
  selectedTags[selectedTagType] = selectedTag; // Modify the selected tags object
  makeTagsString(selectedTags); // Rewrite the selected tags string
}

// Select filter item
$('.filter-option').click( function() {
  $(this).parent().siblings('li').removeClass('active');
  $(this).parent('li').addClass('active');
  var thisItemTag = $(this).attr('data-tag');
  updateSelectedTags(thisItemTag); // Update selectedTagArray
});

// Apply filters
$('#filter-update').click( function() {
  window.location.href = urlRoot + 'collections/' + currentCollection + selectedTagsString + urlSortString;
  return false;
});












//}); // end document.ready
