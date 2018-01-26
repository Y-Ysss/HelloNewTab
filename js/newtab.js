let searchView = function() {
    let key = $('#search').val();
    chrome.bookmarks.search(key, function(results) {
        let joinResult = "";
        results.forEach(function(item) {
            if (item.url) {
                const title = item.title == "" ? item.url : item.title;
                joinResult += '<a href="' + item.url + '"><img class="favicon" src="chrome://favicon/' + item.url + '">' + title + '</a>';
            }
        });
        $('#searchResult').append(joinResult + '<div id="resultNum">Search Result : ' + results.length + '</div>');
        // console.log('OK : ' + results.length);
    });

    let sR = $('#searchResult');
    if (key !== "") {
        $('#searchReset').addClass('searchResetView');
        // sR.css('top', '50px').css('height', '100%');
        // $('#sysMenu').removeClass('sysMenuView');
    } else {
        $('#searchReset').removeClass('searchResetView');
        // sR.css('top', '0px').css('height', '0px').css('cursor','text');
    }
    sR.empty();
}

// =================================================================================
// =================================================================================
let hideSearchResult = function() {
    $('#search').val("");
    $('#searchReset').removeClass('searchResetView');
    $('#searchResult').empty();
    // $('#searchResult').css('top', '0px').css('height', '0px');
}

// call >> getData( [get item name ... string, array of string, object] , [action ... function] );
let getData = function(data, func) {
    chrome.storage.local.get(data, function(value) {
        func(value);
    });
}
// ============================

let funcTgglIcon = function(data) {
    // $('.favicon').css('border-radius', 25 - 25 * data.tgglIcon + '%');
    if (data.tgglIcon === 1) {
        $('.favicon').css('border-radius', '0%');
        // console.log(0);
    } else {
        $('.favicon').css('border-radius', '50%');
        // console.log(50);
    }
}

let funcTgglOpenTab = function(data) {
    if (data.tgglOpenTab === 1) {
        $('head').append('<base target="_blank">');
    }
}

let funcTxtScale = function(data) {
    const scale = data.txtScale;
    if (!isNaN(scale) && scale !== '') {
        $('html').css('zoom', scale + '%');
        $('#bodyMain').masonry({ itemSelector: '.cntntModule', percentPosition: true });
    }
}
var timer = false;
$(window).resize(function() {
    if (timer !== false) {
        clearTimeout(timer);
    }
    timer = setTimeout(function() {
        let mw = parseInt($('#bodyMain').width() / 190);
        let macy = Macy({
            container: '#bodyMain',
            trueOrder: false,
            waitForImages: true,
            columns: mw,
            margin: {
                x: 30,
                y: 15,
            },
            breakAt: {
                1200: 5,
                940: 3,
                520: 2,
                400: 1
            }
        });
    }, 200);
});
// $(window).on('load resize', function(){
// let mw = parseInt($('#bodyMain').width() / 190);
// console.log(mw);
//     let macy = Macy({
//         container: '#bodyMain',
//         trueOrder: false,
//         waitForImages: true,
//         columns: mw,
//         margin: {
//             x: 30,
//             y: 15,
//           },
//         breakAt: {
//             1200: 5,
//             940: 3,
//             520: 2,
//             400: 1
//         }
//     });
// });

let addContents = function(data) {
    $('#bodyMain').append(data.contentsData);
    // $('#bodyMain').masonry({
    //     itemSelector: '.cntntModule'
    //     ,percentPosition: true
    // });
    let mw = parseInt($('#bodyMain').width() / 190);
    let macy = Macy({
        container: '#bodyMain',
        trueOrder: false,
        waitForImages: true,
        columns: mw,
        margin: {
            x: 30,
            y: 15,
        },
        breakAt: {
            1200: 5,
            940: 3,
            520: 2,
            400: 1
        }
    });
    rippleEffect();
}

let ld;

let funcSetCSS = function(data) {
    // if(data.theme !== undefined) {
    tm = data.theme === undefined ? 'tmLight' : data.theme;
    $('head').append('<link rel="stylesheet" type="text/css" href="css/theme/' + tm + '.css">');
    // }
}

// =================================================================================

$(function() {
    getData('theme', funcSetCSS);
    getData('contentsData', addContents);
    getData('tgglIcon', funcTgglIcon);
    getData('tgglOpenTab', funcTgglOpenTab);
    getData('txtScale', funcTxtScale);
    deSVG('.faviconBig', true);
    $(document).keydown(function(event) {
        if (event.altKey) { // [ Alt + B ]
            if (event.keyCode === 66 && $('#search').val() === '') {
                $('#searchGroup').css('width', '30rem');
                $('#searchMenu').addClass('bg-searchMenu'); //.css('background-color', '#ebedee');
                $('#searchMenu').attr('view', '1');
                $('#search').focus();
            }
        }
        if (event.keyCode === 27 && $('#search').focus()) { // [ Esc ]
            $('#searchGroup').css('width', '0rem');
            $('#searchMenu').removeClass('bg-searchMenu'); //.css('background-color', '');
            $('#searchMenu').attr('view', '0');
            $('#search').blur();
            hideSearchResult();
        }
    });

    let timeout_id = null;
    $('#search').keyup(function() {
        if (timeout_id) {
            clearTimeout(timeout_id);
        }
        timeout_id = setTimeout(function() {
            timeout_id = null;
            searchView();
        }, 280);
    });

    $(document).click(function(event) {
        if ($('#search').val() !== '') {
            $('#search').focus();
        }
        if (!$(event.target).closest('#systemLinkArea').length || $(event.target).closest('#searchMenu').length) {
            $('#systemLinkArea').css('width', '4rem');
            $('#systemLinkArea').attr('view', '0');
        }
    });

    $('#searchReset').click(function() {
        hideSearchResult();
    });

    $('.more').click(function() {
        viewMode = $('#systemLinkArea').attr('view');
        if (viewMode === '0') {
            $('#systemLinkArea').css('width', '19rem').attr('view', '1');
        } else {
            $('#systemLinkArea').css('width', '4rem').attr('view', '0');
        }
    });

    $('#searchMenu').click(function() {
        viewMode = $(this).attr('view');
        if (viewMode === '0') {
            $('#searchGroup').css('width', '30rem');
            $('#searchMenu').addClass('bg-searchMenu');
            $('#searchMenu').attr('view', '1');
            $('#search').focus();
        } else {
            hideSearchResult();
            $('#searchGroup').css('width', '0rem');
            $('#searchMenu').removeClass('bg-searchMenu');
            $('#searchMenu').attr('view', '0');
        }
    });

    $('.createTabLink').click(function() {
        chrome.tabs.create({ url: $(this).attr('href') });
        $('#systemLinkArea').css('width', '4rem');
        $('#systemLinkArea').attr('view', '0');
    });

    $('#tggl1').click(function() {
        $(this).toggleClass('form_tggl_on');
        if ($(this).hasClass('form_tggl_on')) {
            $('.hideModule').css('visibility', 'visible').css('opacity', '1');
        } else {
            $('.hideModule').css('visibility', 'hidden').css('opacity', '0');
        }
    });
});