/* tabs */

	(function ($, F) {
	    F.transitions.resizeIn = function() {
	        var previous = F.previous,
	            current  = F.current,
	            startPos = previous.wrap.stop(true).position(),
	            endPos   = $.extend({opacity : 1}, current.pos);

	        startPos.width  = previous.wrap.width();
	        startPos.height = previous.wrap.height();

	        previous.wrap.stop(true).trigger('onReset').remove();

	        delete endPos.position;

	        current.inner.hide();

	        current.wrap.css(startPos).animate(endPos, {
	            duration : current.nextSpeed,
	            easing   : current.nextEasing,
	            step     : F.transitions.step,
	            complete : function() {
	                F._afterZoomIn();

	                current.inner.fadeIn("fast");
	            }
	        });
	    };

	}(jQuery, jQuery.fancybox));

	var tabModule = function(){
		var $container = $('.btns');
		$container.find('li').on({
			mouseenter : function(){
				if(!$(this).hasClass('active')){
					$(this).addClass('hover');
				}
			},
			mouseleave: function(){
				$(this).removeClass('hover');
			},
			click : function(){
				var tabIndex = $(this).data('tab'),
					tempTabIndex = $(this).parent().find('.active').data('tab'),
					tabContent = $(this).parents('.module').find('.tab'),
					direction = 1;
				$(this).parent().find('li').removeClass('active');
				$(this).addClass('active');
				tabContent.each(function(){

					direction = (tabIndex > tempTabIndex) ? 1 : -1;

					if($(this).data('index') === tabIndex){
						$(this).css({display : 'block', position: 'relative', left: (direction)*(1000)});
						$(this).animate({left: 0, opacity: 1}, 1000, 'easeOutQuint');
						$(this).parent().animate({height : $(this).outerHeight(true)}, 1000, 'easeOutQuint');
					} else {
						$(this).css({position: 'absolute', top: 0});
						$(this).animate({left: (direction)*(-1000), opacity: 0}, 1000, 'easeOutQuint');
					}
				});
				return false;
			}
		});

		//resize btn container
		$container.each(function(){
			var containerWidth = 0;
			$(this).find('li').each(function(){
				containerWidth += $(this).outerWidth(true);
			});
			$(this).css('width', containerWidth + 1);
		});
		//set container height
		$(window).load(function(){
			$('.tab-content').each(function(){
				var tabHeight = $(this).outerHeight(true);
				$(this).css('height', tabHeight);
			});
		});
	};
	if($('.tab').length){
		tabModule();
	}

	var zFix = function() {
		var $container = $('#main-nav');
		$container.find('li').on({
			mouseenter : function() {
				if($(this).hasClass('z-fix')) {
				} else {
					$(this).addClass('z-fix');
				}
			},
			mouseleave : function() {
				if($(this).children().hasClass('current')) {
				} else {
					$(this).removeClass('z-fix');
				}
			}
		})
		active = $container.find('li a.current');
		active.parent().addClass('z-fix');

		if($('html').hasClass('lt-ie9')){
			window.setTimeout(function(){
				active.css({"z-index": 100});
			}, 1000);
		}

	}
	if ($('#main-nav').length) {
		zFix();
	}

	var paginatedSlider = function(){
		var $container = $('.controls'),
			tabIndex = 1;
		$container.css({'display':'block'}).find('li').on({
			mouseenter : function(){
				$(this).addClass('hover');
			},
			mouseleave: function(){
				$(this).removeClass('hover');
			},
			click : function(){
				var $tabContent = $(this).parents('.module').find('.tab'),
					direction = ($(this).hasClass('next')) ? 1 : -1 ;

				if($(this).hasClass('next')){
					if(tabIndex < $tabContent.length){
						tabIndex += 1;
					} else {
						tabIndex = 1;
					}
				} else {
					if(tabIndex > 1){
						tabIndex -= 1;
					} else {
						tabIndex = $tabContent.length;
					}
				}

				$tabContent.each(function(){
					if($(this).data('index') === tabIndex){
						$(this).css({display : 'block', position: 'relative', left: (direction)*(1000)});
						$(this).animate({left: 0, opacity: 1}, 1000, 'easeOutQuint');
						$(this).parent().animate({height : $(this).outerHeight(true)}, 1000, 'easeOutQuint');
					} else {
						$(this).css({position: 'absolute', top: 0});
						$(this).animate({left: (direction)*(-1000), opacity: 0}, 1000, 'easeOutQuint');
					}
				});
			}
		});
	};
	if($('.paginated-4-column-feed .tab').length > 1){
		paginatedSlider();
	};

	var mainHeroSlider = function() {

		function getMargin(newItems) {
			var center  = newItems.eq(0).outerWidth(true) + (newItems.eq(1).outerWidth(true)/2);
			var minMarg = ($(window).width()/2) - center;

			return minMarg;
		}
		function centerIMG( newItems ) {
			var slideCenter = newItems.find('img').width();
			var imgCenter = ($(window).width() - slideCenter)/2;

			return imgCenter;
		}

		if($('#main-hero .slider li').length < 2) {
			$('#main-hero .slider-controls').hide();
		}

		// Slider functionality
		$("#main-hero .slider").carouFredSel({
			responsive: true,
			height: 'variable',
			width: '100%',
			items: {
				width: 1600,
				height: 'variable',
				visible: {
					min: 1,
					max: 1
				}
			},
			prev: {
			    button: function() {
			        return $(this).parent().parent().find(".slider-prev");
			    },
			    key: "left",
 				pauseOnHover: true
			},
			next: {
			    button: function() {
			        return $(this).parent().parent().find(".slider-next");
			    },
			    key: "right",
 				pauseOnHover: true
			},
			pagination: {
			 	container: function() {
			 		return $(this).parent().parent().find(".slider-pagin");
			 	}
			},
			auto: {
				play: true,
				timeoutDuration: 5000,
				button: function() {
					return $(this).parent().parent().find(".slider-play");
				},
				pauseOnEvent: 'resume'
			},
			scroll: {
				items: 1,
				fx: 'crossfade',
				onBefore: function( data ) {

					//console.log(data);

					data.items.old.removeClass('current');
					//data.items['new'].addClass('current');
					data.items.visible.eq(0).addClass('current');

					var offsetW = ($('#main-hero .slider li img').width() - $('#main-hero').width())/2;
					var offsetH = ($('#main-hero .slider li img').height() - $('#main-hero').height())/2;

					$('#main-hero .slider li img').css({
						'marginLeft': '0px',
						'marginTop': '0px'
					});
					$('#main-hero .slider li.current img').css({
						'marginLeft': -offsetW+'px',
						'marginTop': -offsetH+'px'
					});
				}
			},
			onCreate: function( data ) {

				data.items.addClass('current');

				var offsetW = ($('#main-hero .slider li img').width() - $('#main-hero').width())/2;
				var offsetH = ($('#main-hero .slider li img').height() - $('#main-hero').height())/2;

				$('#main-hero .slider li img').css({
					'marginLeft': '0px',
					'marginTop': '0px'
				});
				$('#main-hero .slider li.current img').css({
					'marginLeft': -offsetW+'px',
					'marginTop': -offsetH+'px'
				});

				$('#main-hero').animate({
					'left': 0
				}, function() {
					$(this).animate({
						'opacity': 1
					});
					if($('html').hasClass('lt-ie7')){
						var heroHeight = $('#main-hero').height();
						$('#main-hero').find('.slider-nav').find('span').css({height: heroHeight});
					}
				});

			},
			swipe: true
		});

		$(window).resize(function() {

			if($('html').hasClass('lt-ie7')){
				var heroHeight = $('#main-hero').height();
				$('#main-hero').find('.slider-nav').find('span').css({height: heroHeight});
			}

			if( $(window).width() < 1800 ) {
				var offset = ($('#main-hero .slider li img').width() - $(window).width())/2;

				$('#main-hero .slider li img').css({
					'marginLeft': '0px'
				});
				$('#main-hero .slider li.current img').css({
					'marginLeft': -offset+'px'
				});
			}
		});

		$('#main-hero .slider-prev').find('span').on({
			mouseenter: function(){
				$(this).stop().animate({left: 10}, 200);
			},
			mouseleave: function(){
				$(this).stop().animate({left: 0}, 300);
			}
		});

		$('#main-hero .slider-next').find('span').on({
			mouseenter: function(){
				$(this).stop().animate({left: -10}, 200);
			},
			mouseleave: function(){
				$(this).stop().animate({left: 0}, 300);
			}
		});
	};
	if($('#main-hero .slider').length) {
		mainHeroSlider();
	}


	var subHeroSlider = function() {

		function getMargin(newItems) {
			var center  = newItems.eq(0).outerWidth(true) + (newItems.eq(1).outerWidth(true)/2);
			var minMarg = ($(window).width()/2) - center;

			return minMarg;
		}
		function centerIMG( newItems ) {
			var slideCenter = newItems.eq(0).outerWidth(true);
			var imgCenter = (($(this).find('li').width()/2) - slideCenter)/2;

			return imgCenter;
		}

		// Slider functionality
		$("#sub-hero .slider").carouFredSel({
			width: 10000,
			//height: 'variable',
			height: 360,
			align: false,
			items: {
				visible: 1,
				min: 3
			},
			prev: {
			    button: function() {
			        return $(this).parent().parent().find(".slider-prev");
			    },
			    key: "left",
 				pauseOnHover: true
			},
			next: {
			    button: function() {
			        return $(this).parent().parent().find(".slider-next");
			    },
			    key: "right",
 				pauseOnHover: true
			},
			pagination: {
			 	container: function() {
					return $(this).parent().parent().find(".slider-pagin");
				}
			},
			auto: {
				play: true,
				timeoutDuration: 3000,
				button: function() {
					return $(this).parent().parent().find(".slider-play");
				},
				pauseOnEvent: 'resume'
			},
			scroll: {
				items: 1,
				fx: 'scroll',
				onAfter: function( data ) {
				},
				onBefore: function( data ) {
					$(this).find('.detail').stop().fadeOut(200);

					$(this).parent().animate({
						'marginLeft': getMargin( data.items.visible.prevObject )
					}, data.scroll.duration);

					if(data.scroll.direction == 'prev') {
						data.items.old.prevObject.eq(2).animate({
							'opacity': .3
						}, data.scroll.duration);
						data.items.visible.prevObject.eq(1).animate({
							'opacity': 1
						}, data.scroll.duration);
					} else {
						data.items.visible.eq(0).animate({
							'opacity': .3
						}, data.scroll.duration);
						data.items['new'].prevObject.eq(2).animate({
							'opacity': 1
						}, data.scroll.duration);
					}
					data.items.visible.eq(0).removeClass('current');
					data.items['new'].prevObject.eq(2).addClass('current');

				}
			},
			onCreate: function( data ) {
				$(this).parent().css({
					'marginLeft': getMargin( data.items.prevObject )
				});
				$(this).children().not(':eq(1)').css({
					'opacity': .3
				});

				data.items.prevObject.eq(1).addClass('current');

				$('#sub-hero').animate({
					'left': 0
				}, function() {
					$(this).animate({
						'opacity': 1
					})
				});
			},
			swipe: true
		});

		$('#sub-hero').on({
			mouseenter: function() {
				$(this).closest('#sub-hero').find('h2').stop().animate({
					bottom: '0px',
					opacity: 0
				}, 300);

				$(this).find('.inner-overlay').stop().animate({
					opacity: 0
				}, 100);
				//if($(this).find('.caption').children('p').html().length > 0){
				//	$(this).stop().animate({height: 360}, 400, 'easeOutQuint');
				//}
				var controlPos = ($(window).width()/2) - ($(this).find('.slider-controls').outerWidth()/2);
				$(this).find('.slider-controls').stop().fadeIn(200).css({left: controlPos});
				//$(this).find('.current').find('.detail').stop().fadeIn(200);
			},
			mouseleave: function() {
				$(this).closest('#sub-hero').find('h2').stop().animate({
					bottom: '80px',
					opacity: 1
				}, 500);

				$(this).find('.inner-overlay').stop().animate({
					opacity: .25
				}, 200);

				//$(this).stop().animate({height: 380}, 400, 'easeOutQuint');
				$(this).find('.slider-controls').stop().fadeOut(200);
			}
		});

		$(window).resize(function() {
			$('#sub-hero .slider').parent().css({
				'marginLeft': getMargin( $('#sub-hero .slider li') )
			});
		});

		$('#sub-hero .slider-prev').find('span').on({
			mouseenter: function(){
				$(this).stop().animate({left: 10}, 200);
			},
			mouseleave: function(){
				$(this).stop().animate({left: 0}, 300);
			}
		});

		$('#sub-hero .slider-next').find('span').on({
			mouseenter: function(){
				$(this).stop().animate({left: -10}, 200);
			},
			mouseleave: function(){
				$(this).stop().animate({left: 0}, 300);
			}
		});

	};
	if($('#sub-hero .slider').length) {
		subHeroSlider();
	}

	var paginatedGallery = function() {

		//Galleria Init/Setup
		Galleria.loadTheme('/assets/js/libs/themes/soho/galleria.sohov2.js');
		Galleria.run('.paginated-multiple-media-elements .gallery', {
			autoplay: 10000,
			height: 480,
			width: 645,
			fullscreenDoubleTap: false,
			initialTransition: 'fade',
			idleTime: 3000,
			preload: 4,
			show: 0,
			showCounter: false,
			thumbnails: 'numbers',
			transition: 'slide',
			trueFullscreen: false,
			imageCrop: true,
			overlayOpacity:0
		});


		Galleria.on('rescale', function(e) {
			this.$('container').height('360');
			if(this.$('container').width() <= 645) {
				this.$('container').width('645');
				this.$('container').height('360');
			}
		});

	};
	if($('.paginated-multiple-media-elements .gallery').length) {
		paginatedGallery();
	}

	var paginatedSlider = function() {

		// Slider functionality
		$(".paginated-multiple-media-elements .slider").carouFredSel({
			width: 577,
			height: 324,
			align: false,
			items: {
				width: 577,
				height: 324,
				visible: 1,
				min: 1
			},
			prev: {
			    button: function() {
			        return $(this).parent().parent().find(".slider-prev");
			    },
			    pauseOnHover: true
			},
			next: {
			    button: function() {
			        return $(this).parent().parent().find(".slider-next");
			    },
			    pauseOnHover: true
			},
			pagination: {
			 	container: function() {
			 		return $(this).parent().parent().find(".slider-pagin");
			 	},
				pauseOnHover: true
			},
			auto: {
				play: false
			},
			scroll: {
				items: 1,
				fx: 'scroll',
				onAfter: function( data ) {

				},
				onBefore: function( data ) {

				}
			},
			onCreate: function( data ) {

			},
			swipe: true
		});

		$('.paginated-multiple-media-elements .slideshow-container').on({
			mouseenter: function() {
				if($(this).find('.caption').children('p').html().length > 0){
					//$(this).stop().animate({height: 360}, 400, 'easeOutQuint');
					$(this).find('.detail').stop().fadeOut(200);
				}
				//var controlPos = ($(window).width()/2) - ($(this).find('.slider-controls').outerWidth()/2);
				//$(this).find('.slider-controls').stop().fadeIn(200).css({left: controlPos});

			},
			mouseleave: function() {
				//$(this).stop().animate({height: 380}, 400, 'easeOutQuint');
				//$(this).find('.slider-controls').stop().fadeOut(200);
				$(this).find('.detail').stop().fadeIn(200);
			}
		});

		$('.paginated-multiple-media-elements .slider-prev').find('span').on({
			mouseenter: function(){
				$(this).stop().animate({left: 10}, 200);
			},
			mouseleave: function(){
				$(this).stop().animate({left: 0}, 300);
			}
		});

		$('.paginated-multiple-media-elements .slider-next').find('span').on({
			mouseenter: function(){
				$(this).stop().animate({left: -10}, 200);
			},
			mouseleave: function(){
				$(this).stop().animate({left: 0}, 300);
			}
		});

	};
	if($('.paginated-multiple-media-elements .slider').length) {
		paginatedSlider();
	}

	var galleryFilter = function(){
		var filterArr = [];
		//add the filters
		$('.mod-filters').find('input').each(function(){
			if($(this).is(':checked')){
				filterArr.push($(this).data('filter'));
			}
		});
		//toggle filters
		$('.mod-filters').find('input').on('click', function(){
			var filter = $(this).data('filter'),
				index = $.inArray(filter, filterArr),
				flag = false;
			if($(this).is(':checked')){
				filterArr.push(filter);
				flag = false;
			} else {
				filterArr.splice(index, 1);
				flag = true;
			}
			$('.gallery-holder').find('li').each(function(){
				var filterToCheck = $(this).data('filter');
				if($.inArray(filterToCheck, filterArr) > -1){
					$(this).children().removeClass('inactive');
					$(this).fadeIn(300);
				} else {
					$(this).children().addClass('inactive');
					$(this).fadeOut(300);
				}
			});
			//wait for animations to finish on fadeOut
			if(flag === true){
				setTimeout( function(){
					$('.gallery-holder').animate({height : $('.gallery-holder').find('ul').outerHeight(true)});
				}, 350 );
			} else {
				$('.gallery-holder').animate({height : $('.gallery-holder').find('ul').outerHeight(true)});
			}
			//update fancyBox
			$('.fancybox:not(.inactive)').fancybox({
				nextMethod : 'resizeIn',
				nextSpeed  : 250,
        		prevMethod : false,
				padding : [10, 35, 10, 35],
				helpers : {
					title : {
						type : 'inside'
					}
				}
			});
		});
		//set container height
		$(window).load(function(){
			var galleryHeight = $('.gallery-holder').outerHeight(true);
			$('.gallery-holder').css('height', galleryHeight);
		});
	};
	if($('.media-gallery-with-filters').length){
		galleryFilter();
		$(document).ready(function() {
			$('.fancybox').fancybox({
				nextMethod : 'resizeIn',
				nextSpeed  : 250,
		        prevMethod : false,
				padding : [10, 35, 10, 35],
				helpers : {
					title : {
						type : 'inside'
					}
				}
			});
		});
	}

	var globalSubmenu = function() {
		var $container = $('#utility-nav, #main-nav'),
			$listTrigger = $container.find('a.sub-menu');

		$listTrigger.on({
			click: function() {
				if($(this).hasClass('open')) {
					$(this).siblings('div.dropdown').addClass('offscreen');
					$(this).removeClass('open');
				} else {
					$(this).siblings('div.dropdown').removeClass('offscreen');
					$(this).addClass('open');
				}
				return false;
			}
		});

		// Requires jquery.ba-outside-events.min.js Plugin
		$listTrigger.bind('clickoutside', function(event) {
			$(this).siblings('div.dropdown').addClass('offscreen');
			$(this).removeClass('open');
		});

	};
	if($('#utility-nav, #main-nav').length) {
		globalSubmenu();
	}

	var scrollTop = function() {
		var $target = $('#global-footer a.scroll-top');

		$target.on({
			click: function() {
				$('body,html').animate({
					scrollTop: 0
				}, 500);
				return false;
			}
		});
	};
	if($('#global-footer a.scroll-top').length) {
		scrollTop();
	}

	var reservationForm = function(){
		var $curr_lang = $('#global-header .lang .current').attr('title');
		var $locale = 'zh-CN';

		if($curr_lang == 'English') {
			$locale = 'en-GB';
		} else {
			$locale = 'zh-CN';
		}

		$.datepicker.setDefaults( $.datepicker.regional[ $locale ] );

		$( "#from" ).datepicker({
			defaultDate: "+1w",
			changeMonth: false,
			numberOfMonths: 1,
			minDate: 0,
			onSelect: function( selectedDate ) {
				$( "#to" ).datepicker( "option", "minDate", selectedDate );
			}
		});
		$( "#to" ).datepicker({
			defaultDate: "+1w",
			changeMonth: false,
			numberOfMonths: 1,
			onSelect: function( selectedDate ) {
				$( "#from" ).datepicker( "option", "maxDate", selectedDate );
			}
		});
	};
	if($('.utility-reservataion-booker').length) {
		reservationForm();
	}

	var moduleHovers = function(){
		$('.mod-hover').find('.inner-content').on({
			mouseenter: function(){
				$(this).find('.hover-container').addClass('hover');
			},
			mouseleave: function(){
				$(this).find('.hover-container').removeClass('hover');
			}
		});
	};
	if($('.mod-hover').length){
		moduleHovers();
	}

	var customForm = function(){
		$('.custom-select').dropkick();
	}

	if($('.utility-reservataion-booker').length){
		customForm();
	}