"use strict";$(document).ready(function(){var l=991;function e(){window.innerWidth>l?($(".mega-menu").removeClass("active").css("width",$(window).width()).css("display","grid"),$(".mega-menu .inner-list > ul").css("display","block")):($(".mega-menu").css("width","auto").css("display","none"),$(".mega-menu").siblings("a.active").siblings(".mega-menu").addClass("active").css("display","block"),$(".mega-menu .inner-list > ul").css("display","none"),$(".mega-menu .inner-list > ul.active").css("display","block"))}e(),$(window).resize(function(){e()});var a=200;function i(){var e=$("#filter-buttons").parent().offset().top,i=$("#filter-bar").parent().offset().top,a=$("header").outerHeight(),s=$(window).scrollTop();window.innerWidth<=l?($("#filter-bar").removeClass("sticky"),e-a<=s?$("#filter-buttons").addClass("sticky"):$("#filter-buttons").removeClass("sticky")):($("#filter-buttons").removeClass("sticky"),i-a<=s?$("#filter-bar").addClass("sticky"):$("#filter-bar").removeClass("sticky"))}function s(){window.innerWidth<=l?($(".footer-menu").children("ul").hide(),$(".footer-menu.active").children("ul").show(),$(".footer-menu > h3").off().click(function(e){e.preventDefault();var i=$(this).parent(".footer-menu");$(".footer-menu").not(i).children("ul").slideUp(a),$(".footer-menu").not(i).removeClass("active"),i.children("ul").slideToggle(a),i.toggleClass("active")})):($(".footer-menu").children("ul").show(),$(".footer-menu > h3").off().click(function(e){e.preventDefault()}))}$("#menu-btn").off().click(function(e){e.preventDefault(),$(this).toggleClass("active"),$("#main-nav").toggleClass("active"),$("#main-nav > ul").removeClass("slide-out"),$("#main-nav").hasClass("active")&&!$("header").hasClass("scrolled")?$("header").addClass("solid"):$("#main-nav").hasClass("active")||$("header").hasClass("scrolled")?$("#main-nav").hasClass("active")&&$("header").hasClass("scrolled")?$("header").addClass("solid"):$("#main-nav").hasClass("active")&&$("header").hasClass("scrolled")&&$("header").addClass("solid"):$("header").removeClass("solid")}),$("#main-nav > ul > li > a").off().click(function(e){e.preventDefault(),window.innerWidth<=l&&($("#main-nav > ul > li > a").not(this).removeClass("active"),$("#main-nav > ul > li > a").not(this).siblings(".mega-menu").slideUp(a).removeClass("active"),$("#main-nav > ul > li > a").not(this).siblings(".mega-menu").children(".inner-list").children("h3").removeClass("active"),$("#main-nav > ul > li > a").not(this).siblings(".mega-menu").children(".inner-list").children("ul").slideUp(a).removeClass("active"),$(this).toggleClass("active").siblings(".mega-menu").slideToggle(a).toggleClass("active"))}),$("#main-nav .mega-menu .inner-list > h3").off().click(function(e){e.preventDefault(),window.innerWidth<=l&&($("#main-nav .mega-menu .inner-list > h3").not(this).removeClass("active"),$("#main-nav .mega-menu .inner-list > h3").not(this).siblings("ul").slideUp(a).removeClass("active"),$(this).toggleClass("active").siblings("ul").slideToggle(a).toggleClass("active"))}),$("#main-nav .currency-btn").off().click(function(){$("#main-nav > ul").toggleClass("slide-out")}),$("#main-nav .currency-close-btn").off().click(function(){$("#main-nav > ul").toggleClass("slide-out")}),$("#main-nav > ul > li > a").hover(function(e){if(window.innerWidth>l){var i=$(this);$("header").addClass("solid");var a=parseInt(i.css("padding-left"))+parseInt(i.css("padding-right")),s=parseInt(i.innerWidth())-a,n=parseInt(i.position().left)+parseInt(i.css("padding-left"));if($("#main-nav > ul > .underline").addClass("active").css({width:s,left:n}),i.siblings(".mega-menu").length){i.siblings(".mega-menu").addClass("active");var t=$(".mega-menu.active").outerHeight();$("#mega-menu-bg").addClass("active").css("height",t)}}},function(e){window.innerWidth>l&&($("header").hasClass("scrolled")||$("header").removeClass("solid"),$("#main-nav > ul > .underline").removeClass("active"),$(this).siblings(".mega-menu").removeClass("active"),$("#mega-menu-bg").removeClass("active"))}),$(".mega-menu").hover(function(e){window.innerWidth>l&&($("header").addClass("solid"),$("#main-nav > ul > .underline").addClass("active"),$(this).addClass("active"),$("#mega-menu-bg").addClass("active"))},function(e){window.innerWidth>l&&($("header").hasClass("scrolled")||$("header").removeClass("solid"),$("#main-nav > ul > .underline").removeClass("active"),$(this).removeClass("active"),$("#mega-menu-bg").removeClass("active"))}),1==!!navigator.userAgent.match(/Trident.*rv\:11\./)&&$("img.object-cover").length&&$("img.object-cover").each(function(){var e=$(this),i=e.attr("src");e.hide(),e.parent().addClass("image-cover").attr("style","background-image: url("+i+");")}),$(".drawer-header .close-btn, .drawer-back").off().click(function(e){$(this).closest(".drawer").removeClass("active")}),$("#cart-btn").off().click(function(e){$("#cart-drawer").addClass("active")}),i(),$(window).scroll(function(){i()}),$(window).resize(function(){i()}),$(".compressed-text").each(function(){var i=$(this);i.children(".expand-toggle").off().click(function(e){i.toggleClass("active")})}),$(".metal-switcher a").off().click(function(e){$(this).siblings().removeClass("active"),$(this).addClass("active")}),s(),$(window).resize(function(){s()}),$(".form-field input, .form-field select, .form-field textarea").focus(function(){$(this).parent(".form-field").siblings(".form-field").each(function(){""==$(this).children("input").val()&&$(this).removeClass("open")}),$(this).parent(".form-field").addClass("open")}),$(".form-field input, .form-field select, .form-field textarea").blur(function(){$(this).val()||$(this).parent(".form-field").removeClass("open")})});
//# sourceMappingURL=scripts.js.map
