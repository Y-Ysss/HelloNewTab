let joinBkmrk = "";
let indexBkmrk = 0;
let bkmrkNum = 0;
chrome.bookmarks.getTree(function(itemTree) {
    itemTree.forEach(function(items) {
        if ("children" in items) {
            items.children.forEach(function(bookmark) {
                BookmarkNode(bookmark);
            });
        }
    });

    $('#bodyMain').masonry({
        itemSelector: '.cntntModule',
        percentPosition: true
    });
    rippleEffect();
});
// ============================
function BookmarkNode(bookmark) {
    if ("children" in bookmark) {
        if (bookmark.children.length > 0) {
            indexBkmrk++;
            bookmark.children.forEach(function(subBookmark) {
                BookmarkNode(subBookmark);
            });
            if (joinBkmrk !== "") {
                if (bookmark.title.slice(0, 1) === "'") {
                    $('#bodyMain').append('<div class="cntntModule hideModule"><div class="cntntHead ripple">' +
                        bookmark.title + '</div><ul id="cntntId_' + indexBkmrk + '">' +
                        joinBkmrk + '<li class="bkmrkNum">' + bkmrkNum + ' bookmarks</li></ul></div>');
                } else {
                    $('#bodyMain').append('<div class="cntntModule"><div class="cntntHead ripple">' +
                        bookmark.title + '</div><ul id="cntntId_' + indexBkmrk + '">' +
                        joinBkmrk + '<span class="bkmrkNum">' + bkmrkNum + ' bookmarks</span></ul></div>');
                }
                joinBkmrk = "";
                bkmrkNum = 0;
            }
        }
    } else {
        bkmrkNum++;
        let title = bookmark.title.length > 0 ? bookmark.title : bookmark.url;
        joinBkmrk += '<li class="ripple"><a href="' + bookmark.url + '"><img class="favicon" src="chrome://favicon/' +
            bookmark.url + '">' + title + '</a></li>';
    }
}
// =================================================================================
function searchView() {
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
function hideSearchResult() {
    $('#search').val("");
    $('#searchReset').removeClass('searchResetView');
    $('#searchResult').css('top', '0px').css('height', '0px');
}

function getData(data, func) {
    chrome.storage.local.get(data, function(value) {
        func(value);
    });
}
// ============================

function funcTgglIcon(data) {
    if (data.tgglIcon === 1) {
        $('.favicon').css('border-radius', '0%');
    } else {
        $('.favicon').css('border-radius', '50%');
    }
}

function funcTgglOpenTab(data) {
    if (data.tgglOpenTab === 1) {
        $('head').append('<base target="_blank">');
    }
}

function funcTxtScale(data) {
    const scale = data.txtScale;
    if (!isNaN(scale) && scale !== '') {
        $('html').css('zoom', scale + '%');
        $('#bodyMain').masonry({ itemSelector: '.cntntModule', percentPosition: true });
    }
}

// =================================================================================

$(function() {
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

    $('#sysMenu').click(function() {
        let sLA = $('#systemLinkArea');
        if (sLA.css("top") === "-5px") {
            sLA.css('top', '50px');
            $('#sysMenu').addClass('sysMenuView');
            hideSearchResult();
        } else {
            sLA.css('top', '-5px');
            $('#sysMenu').removeClass('sysMenuView');
        }
    });

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