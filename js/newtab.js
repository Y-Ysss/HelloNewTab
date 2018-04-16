let searchView = (key) => {
    chrome.bookmarks.search(key, function(results) {
        let joinResult = "";
        results.forEach(function(item) {
            if (item.url) {
                const title = item.title == "" ? item.url : item.title;
                joinResult += '<a href="' + item.url + '"><img class="favicon" src="chrome://favicon/' + item.url + '">' + title + '</a>';
            }
        });
        $('#searchResult').append(joinResult + '<div id="resultNum">Search Result : ' + results.length + '</div>');
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
let hideSearchResult = () => {
    $('#search').val("");
    $('#searchReset').removeClass('searchResetView');
    $('#searchResult').empty();
    // $('#searchResult').css('top', '0px').css('height', '0px');
}

// call >> getData( [get item name ... string, array of string, object] , [action ... function] );
let getData = (data, func) => {
    chrome.storage.local.get(data, function(value) {
        func(value);
    });
}
// ============================

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


let ld;

// =================================================================================

$(function() {
    deSVG('.faviconBig', true);
    $(document).keydown(function(event) {
        if (event.altKey) { // [ Alt + B ]
            if (event.keyCode === 66 && $('#search').val() === '') {
                $('#searchGroup').css('width', '30rem');
                $('#searchMenu').addClass('bg-searchMenu').attr('view', '1');
                $('#search').focus();
            }
        }
        if (event.keyCode === 27 && $('#search').focus()) { // [ Esc ]
            $('#searchGroup').css('width', '0rem');
            $('#searchMenu').removeClass('bg-searchMenu').attr('view', '0');
            $('#search').blur();
            hideSearchResult();
        }
    });

    let timeout_id = null;
    // $('#search').keyup(function() {
    //     if (timeout_id) {
    //         clearTimeout(timeout_id);
    //     }
    //     timeout_id = setTimeout(function() {
    //         timeout_id = null;
    //         searchView();
    //     }, 280);
    // });

    $(document).click(function(event) {
        if ($('#search').val() !== '') {
            $('#search').focus();
        }
        if (!$(event.target).closest('#systemLinkArea').length || $(event.target).closest('#searchMenu').length) {
            $('#systemLinkArea').css('width', '4rem').attr('view', '0');
            $('#mFilter').removeClass('filter');
        }
    });

    $('#searchReset').click(function() {
        hideSearchResult();
    });

    $('.more').click(function() {
        viewMode = $('#systemLinkArea').attr('view');
        if (viewMode === '0') {
            $('#systemLinkArea').css('width', '19rem').attr('view', '1');
            $('#mFilter').addClass('filter');
        } else {
            $('#systemLinkArea').css('width', '4rem').attr('view', '0');
            $('#mFilter').removeClass('filter');
        }
    });

    $('#searchMenu').click(function() {
        viewMode = $(this).attr('view');
        if (viewMode === '0') {
            $('#searchGroup').css('width', '30rem');
            $('#searchMenu').addClass('bg-searchMenu').attr('view', '1');
            $('#search').focus();
        } else {
            hideSearchResult();
            $('#searchGroup').css('width', '0rem');
            $('#searchMenu').removeClass('bg-searchMenu').attr('view', '0');
        }
    });

    $('.createTabLink').click(function() {
        chrome.tabs.create({ url: $(this).attr('href') });
        $('#systemLinkArea').css('width', '4rem').attr('view', '0');
        $('#mFilter').removeClass('filter');
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