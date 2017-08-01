// =================================================================================
var joinBkmrk = "";
var joinResult = "";
var indexBkmrk = 0;
chrome.bookmarks.getTree(function(itemTree) {
    itemTree.forEach(function(items) {
        if ("children" in items) {
            items.children.forEach(function(bookmark) {
                BookmarkNode(bookmark);
            });
        }
    });
    // $('#bodyMain').freetile({
    //     selector: '.cntntModule',
    //     animate: true
    // });
    
    $('#bodyMain').masonry({
        itemSelector: '.cntntModule',
        percentPosition: true
        // fitWidth: true
    });
});
// ============================
function BookmarkNode(bookmark) {
    if ("children" in bookmark) {
        if (bookmark.children.length > 0) {
            indexBkmrk++;
            bookmark.children.forEach(function(subBookmark) {
                BookmarkNode(subBookmark);
            });
            if (joinBkmrk != "") {
                if (bookmark.title.slice(0, 1) == "'") {
                    $('#bodyMain').append('<div class="cntntModule hideModule"><div class="cntntHead">' + bookmark.title + '</div><ul id="cntntId_' + indexBkmrk + '">' + joinBkmrk + '</ul></div>');
                } else {
                    $('#bodyMain').append('<div class="cntntModule"><div class="cntntHead">' + bookmark.title + '</div><ul id="cntntId_' + indexBkmrk + '">' + joinBkmrk + '</ul></div>');
                }
                joinBkmrk = "";
            }
        }
    } else {
        var title = bookmark.title.length > 0 ? bookmark.title : bookmark.url;
        joinBkmrk += '<li><a href="' + bookmark.url + '"><img class="favicon" src="chrome://favicon/' + bookmark.url + '">' + title + '</a></li>';
    }
}
// =================================================================================
function searchView(inputWord) {
    var type_old = type_new = $(inputWord).find('#search').val();
    return function() {
        type_new = $(inputWord).find('#search').val();
        if (type_new == "") {
            $('#searchReset').css('color', '#678');
            $('#searchResult').css('top', '0px');
            $('#searchResult').css('height', '0px');
        } else {
            $('#searchReset').css('color', '#fff');
            $('#searchResult').css('top', '50px');
            $('#searchResult').css('height', '400px');
            $('#systemLinkArea').css('top', '-5px');
            $('#sysMenu').removeClass('sysMenuView');
        }
        if (type_old != type_new) {
            type_old = type_new;
            isChange = true;

            $('#searchResult').empty();
            chrome.bookmarks.search($('#search').val(), function(results) {
                results.forEach(function(searchItem) {
                    searchNode(searchItem);
                });
                $('#searchResult').append(joinResult);
                joinResult = "";
                $('#searchResult').append('<span>Search Result : ' + $('#searchResult a').length + '</span>');
            });
        }
    }
}
// ============================
function searchNode(node) {
    var nodeId
    if (node.children) {
        node.children.forEach(function(child) {
            searchNode(child);
        });
    }
    if (node.url) {
        var title = node.title == "" ? node.url : node.title;
        joinResult += '<a href="' + node.url + '"><img class="favicon" src="chrome://favicon/' + node.url + '">' + title + '</a>';
    }
}

// =================================================================================
// =================================================================================

$(function() {
    // $('#bodyMain').freetile({
    //     selector: '.cntntModule',
    //     animate: true
    // });

    $('#searchReset').click(function() {
        $('#search').val("");
    });

    $(document).keypress(function(event) {
        $('#search').focus();
    });
    $('#search').keyup(searchView(this)); //call function searchView()

    $(document).click(function(event) {
        if ('#searchResult > a') {
            $('#search').val("");
            $('#searchReset').css('color', '#678');
            $('#searchResult').css('top', '0px');
            $('#searchResult').css('height', '0px');
        }
        if (!$(event.target).closest('#searchResult').length && !$(event.target).closest('#search').length) {
            $('#searchResult').css('top', '0px');
            $('#searchResult').css('height', '0px');
        }
    });
    $('#sysMenu').click(function() {
        if ($('#systemLinkArea').css("top") == "-5px") {
            $('#systemLinkArea').css('top', '50px');
            $('#sysMenu').addClass('sysMenuView');
        } else {
            $('#systemLinkArea').css('top', '-5px');
            $('#sysMenu').removeClass('sysMenuView');
        }
    });

    $('.systemLink').click(function() {
        chrome.tabs.create({ url: $(this).attr('href') });
    });


    // $('body').chromeContext({
    //     items: [{
    //         title: 'Menu_01',
    //         onclick: function() {

    //         }
    //     }, {
    //         title: 'Menu_02',
    //         onclick: function() {

    //         }
    //     }, { separator: true }, {
    //         title: 'Menu_03',
    //         onclick: function() {

    //         }
    //     }, {
    //         title: 'Menu_04',
    //         onclick: function() {

    //         }
    //     }]
    // });
    $('#tggl1').click(function() {
        $(this).toggleClass('form_tggl_on');
        if ($(this).hasClass('form_tggl_on')) {
            $('.hideModule').css('display', 'inline-block');
        } else {
            $('.hideModule').css('display', 'none');
        }

    });


});
// =================================================================================



// =================================================================================

// デバッグ
function inLog(num, logText) {
    $('#logView' + num).text(logText);
}
