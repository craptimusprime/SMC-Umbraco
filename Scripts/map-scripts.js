/******************************************************************
Site Name: SMC USA
Author: DH Web

Name: Map Scripts File
******************************************************************/

function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

jQuery(document).ready(function($) {

    var url = window.location.href;
    var maplocation = "";
    if(url.indexOf('distributor') >= 0) {
        maplocation = "distributors";
    } else {
        if(url.indexOf('sales') >= 0) {
            maplocation = "sales-personnel";
        } else {
            maplocation = "";
        }
    }

    // JVector Map
    var mapX = 0.5;
    var mapY = 0.5;
    var mapScale = 1;

    // EMEA Map Focus
    if($('#world-map').hasClass('emea')) {
        mapX = 0.6;
        mapY = 0.5;
        mapScale = 1.75;
    }

    function generateMap(maptype) {
        $('#world-map').vectorMap({
            map: maptype,
            backgroundColor: 'white',
            focusOn: {
                x: mapX,
                y: mapY,
                scale: mapScale
            },
            regionStyle: {
                initial: {
                    fill: '#007ABF',
                    "fill-opacity": 1,
                    stroke: 'none',
                    "stroke-width": 0,
                    "stroke-opacity": 1
                },
                hover: {
                    fill: '#00598C',
                    "fill-opacity": 1,
                    cursor: 'pointer'
                },
                selected: {
                    fill: '#F39A00'
                },
                selectedHover: {
                }
            },
            onRegionClick: function(event, code) {
                if(code === 'US') {
                    $('#return-btn').show();
                    generateMap('us_aea_en');
                }
                if(code === 'CA') {
                    $('#return-btn').show();
                    generateMap('ca_lcc_en');
                }
                /*
                if(code !== 'US' && code !== 'CA') {
                    //$('#world-map').hide();
                    //$('#return-btn').show();
                    window.location.href = '../contact/' + maplocation + '/' + code.toLowerCase();
                    //$('#results').html('<h1>' + code + '</h1><hr />');
                }
                if(code.indexOf('US-') >= 0) {
                    var states = code.split('-');
                    window.location.href = '../contact/' + maplocation + '/us/' + states[1].toLowerCase();
                    //$('#search-region').show();
                }

                if(code.indexOf('CA-') >= 0) {
                    var province = code.split('-');
                    window.location.href = '../contact/' + maplocation + '/ca/' + province[1].toLowerCase();
                    //$('#search-region').show();
                }
                */
            }
        });
    }

    if(qs('area') === 'US') {
        $('#return-btn').show();
        generateMap('us_aea_en');
    } else {
        if(qs('area') === 'CA') {
            $('#return-btn').show();
            generateMap('ca_lcc_en');
        } else {
            generateMap('world_mill_en');
        }
    }

    $('#return-btn').on('click', function() {
        $('.jvectormap-container').remove();
        $('#world-map').show();
        generateMap('world_mill_en');
        $(this).add('#search-region').hide();
        $('#results').html('');
    });

    $('#search-region').on('click', function() {
        $('#world-map').show();
        $(this).hide();
        $('#results').html('');
    });

}); /* end of as page load scripts */
