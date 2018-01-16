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
        $('#searchResult').append(joinResult + '<div style="margin:5px">Search Result : ' + results.length + '</div>');
    console.log('OK : ' + results.length);
    });
    
    let sR = $('#searchResult');
    if (key !== "") {
        $('#searchReset').addClass('searchResetView');
        sR.css('top', '50px').css('height', '400px');
        $('#systemLinkArea').css('top', '-5px');
        $('#sysMenu').removeClass('sysMenuView');
    } else {
        $('#searchReset').removeClass('searchResetView');
        sR.css('top', '0px').css('height', '0px').css('cursor','text');
    }
    sR.empty();
}

// =================================================================================
// =================================================================================
let hideSearchResult = function() {
    $('#search').val("");
    $('#searchReset').removeClass('searchResetView');
    $('#searchResult').css('top', '0px').css('height', '0px');
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
        console.log(0);
    } else {
        $('.favicon').css('border-radius', '50%');
        console.log(50);
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

let addContents = function(data) {
    console.log('+' + data.contentsData);
    $('#bodyMain').append(data.contentsData);
    $('#bodyMain').masonry({
        // columnWidth: 100,
        itemSelector: '.cntntModule',
        percentPosition: true,
        transitionDuration: '0.5s'
    });
    // rippleEffect();
}

// =================================================================================

$(function() {
    getData('contentsData', addContents);
    getData('tgglIcon', funcTgglIcon);
    getData('tgglOpenTab', funcTgglOpenTab);
    getData('txtScale', funcTxtScale);
    $(document).keydown(function(event) {
        if (event.altKey) {
            if (event.keyCode === 66 && $('#search').val() === '') {
                $('#search').focus();
            }
        }
        if (event.keyCode === 27 && $('#search').focus()) {
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
    });

    $('#searchReset').click(function() {
        hideSearchResult();
    });

    // $('#sysMenu').click(function() {
    //     let sLA = $('#systemLinkArea');
    //     if (sLA.css("top") === "-5px") {
    //         sLA.css('top', '50px');
    //         $('#sysMenu').addClass('sysMenuView');
    //         hideSearchResult();
    //     } else {
    //         sLA.css('top', '-5px');
    //         $('#sysMenu').removeClass('sysMenuView');
    //     }
    // });

    $('.systemLink').click(function() {
        chrome.tabs.create({ url: $(this).attr('href') });
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