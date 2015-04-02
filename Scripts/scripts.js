/******************************************************************
Site Name: SMC USA
Author: DH Web

Scripts: Scripts File
******************************************************************/

jQuery(document).ready(function($) {

	var menuEvents = 'tap click';
    if (! navigator.userAgent.match(/(Android)|(iemobile)/i) && $(window).width() > 945) {
        menuEvents += ' mouseenter';
    }
    $('#mainnav li.dropdown a').not('ul.children li a').on(menuEvents, function(e) {

        if ($(window).width() < 945) {
            $(this).parent('li').toggleClass('active');
            $(this).parent('li').children('ul.children').slideUp(0);
        } else {
            $(this).parent('li').addClass('active');
        }

        $(this).parent('li.active').children('ul.children').slideDown(100);

        if (! navigator.userAgent.match(/(Android)|(iemobile)/i) && $(window).width() > 945) {
            $(this).parent('li').on('mouseleave', function() {
        }, function() {
            	$(this).removeClass('active');
            	$(this).children('ul.children').slideUp(0);
        	});
        }

        e.preventDefault();

    });

    if (! navigator.userAgent.match(/(Android)|(iemobile)/i) && $(window).width() > 945) {

        $('ul.children li.dropdown a').not('ul.subchildren li a').on('mouseenter', function(e) {

        	$('ul.children li.dropdown a').not($(this).parent('li')).removeClass('active');
        	$('ul.children li.dropdown a').not($(this).parent('li')).children('ul.subchildren').hide();

        	$(this).parent('li').toggleClass('active');
        	$(this).parent('li').children('ul.subchildren').show();
            $('ul.children').css('width', '750px');

            $(this).parent('li').on('mouseleave', function() {
                $(this).removeClass('active');
                $(this).children('ul.subchildren').hide();
                $('ul.children').css('width', '250px');
            });

        	e.preventDefault();

        });

        $('ul.subchildren li').not('.additional li').on('mouseenter', function(e) {

            var menuimage = $(this).parent('ul.subchildren').find('.menu-img');
            var menutitle = $(this).parent('ul.subchildren').find('.menu-meta h4');
            var index = $(this).index() - 1;
            var vposition = (index) * (-140);

            $(menuimage).css('background-position', 'center ' + vposition + 'px');
            $(menutitle).html($(this).text());
            $('ul.subchildren li').not($(this)).removeClass('active');
            $(this).addClass('active');

            e.preventDefault();
        });

    }

    if($(window).width() < 753) {

        $('button.quick-links').on('tap click', function(event) {
            event.stopPropagation();
            $('#container').toggleClass('dropdown');
            $('#quick-list').slideToggle(100);
        });

        $(document).on('tap click', function() {
            $('#container').removeClass('dropdown');
            $('#quick-list').slideUp(100);
        });

    }

	if ($(window).width() < 945) {

        $('#menu').click(function(e) {
            $(this).toggleClass('active');
            $('#container').toggleClass('active', 200);
            e.preventDefault();
        });

        $('.description-btn').on('tap click', function(e) {
            if ($(this).text().trim() === 'Show Description' ) {
                $(this).text('Hide Description');
            } else {
                $(this).text('Show Description');
            }
            $('.description-text').fadeToggle(100);
            e.preventDefault();
        });

		$('#homeTabs').accordion({
	        active: false,
	        collapsible: true,
	        header: 'h2',
	        heightStyle: 'content',
	        animate: 'easeOutExpo',
            activate: function( event, ui ) {
                if(!$.isEmptyObject(ui.newHeader.offset())) {
                    $('html:not(:animated), body:not(:animated)').animate({ scrollTop: ui.newHeader.offset().top - 10 }, 'fast');
                }
            }
	    });

	    $('#productTabs').accordion({
	        active: false,
	        collapsible: true,
	        header: 'h2',
	        heightStyle: 'content',
	        animate: 'easeOutExpo'
	    });

	    $('#catTabs').accordion({
	        active: false,
	        collapsible: true,
	        header: 'h2',
	        heightStyle: 'content',
	        animate: 'easeOutExpo',
            activate: function( event, ui ) {
                if(!$.isEmptyObject(ui.newHeader.offset())) {
                    $('html:not(:animated), body:not(:animated)').animate({ scrollTop: ui.newHeader.offset().top - 10 }, 'fast');
                }
            }
	    });

	}

	if ($(window).width() > 945) {
		$('#relatedTabs').tabs();
        $('.flipout').flipout_cards();
	}

    if($('#config').length) {
        var elTop = $('#config').offset().top + 120;
    }

    $('#sidebar-nav').find('li.active-category').parent('ul').css('display', 'block').parents('#sidebar-nav ul li').addClass('active');

    $('#sidebar-nav ul li.dropdown').not('#sidebar-nav ul ul li').on('click tap', function() {
        $('#sidebar-nav ul ul').not($(this).children('ul')).slideUp(0);
        $(this).children('ul').slideDown(100);
        $('#sidebar-nav ul li.dropdown').not($(this)).removeClass('active');
        $(this).addClass('active');
    });

    $(window).scroll(function() {
        $('#config').toggleClass('sticky', $(window).scrollTop() > elTop);
        $('#sitewrap').toggleClass('sticky', $(window).scrollTop() > elTop);
    });

    $('#selectBoxArrow0').on('click', function(e) {
        $('#selectBoxOptions0').slideToggle(100);
        e.preventDefault();
    });

}); /* end of as page load scripts */