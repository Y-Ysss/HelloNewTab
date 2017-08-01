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
    
    $('#bodyMain').masonry({
        itemSelector: '.cntntModule',
        percentPosition: true
        // fitWidth: true
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
            if (joinBkmrk != "") {
                if (bookmark.title.slice(0, 1) == "'") {
                    $('#bodyMain').append('<div class="cntntModule hideModule"><div class="cntntHead ripple">' + bookmark.title + '</div><ul id="cntntId_' + indexBkmrk + '">' + joinBkmrk + '</ul></div>');
                } else {
                    $('#bodyMain').append('<div class="cntntModule"><div class="cntntHead ripple">' + bookmark.title + '</div><ul id="cntntId_' + indexBkmrk + '">' + joinBkmrk + '</ul></div>');
                }
                joinBkmrk = "";
            }
        }
    } else {
        var title = bookmark.title.length > 0 ? bookmark.title : bookmark.url;
        joinBkmrk += '<li class="ripple"><a href="' + bookmark.url + '"><img class="favicon" src="chrome://favicon/' + bookmark.url + '">' + title + '</a></li>';
    }
}
// =================================================================================
// =================================================================================
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
function rippleEffect(){
    var ripple, ripples, RippleEffect, loc, cover, coversize, style, x, y, i, num;

    //クラス名rippleの要素を取得
    ripples = document.querySelectorAll('.ripple');
    //位置を取得
    RippleEffect = function(e) {
        ripple = this; //クリックされたボタンを取得
        cover = document.createElement('span'); //span作る
        coversize = ripple.offsetWidth; //要素の幅を取得
        loc = ripple.getBoundingClientRect(); //絶対座標の取得
        x = e.pageX - loc.left - window.pageXOffset - (coversize / 2);
        y = e.pageY - loc.top - window.pageYOffset - (coversize / 2);
        pos = 'top:' + y + 'px; left:' + x + 'px; height:' + coversize + 'px; width:' + coversize + 'px;';

        //spanを追加
        ripple.appendChild(cover);
        cover.setAttribute('style', pos);
        cover.setAttribute('class', 'rp-effect'); //クラス名追加

        //しばらくしたらspanを削除
        setTimeout(function() {
            var list = document.getElementsByClassName("rp-effect");
            for (var i = list.length - 1; i >= 0; i--) { //末尾から順にすべて削除
                list[i].parentNode.removeChild(list[i]);
            }
        }, 4000)
    };
    for (i = 0, num = ripples.length; i < num; i++) {
        ripple = ripples[i];
        ripple.addEventListener('mousedown', RippleEffect);
    }
}
// =================================================================================
function hideSearchResult(){
    $('#search').val("");
    $('#searchReset').css('color', '#678');
    $('#searchResult').css('top', '0px');
    $('#searchResult').css('height', '0px');

}
// =================================================================================
// =================================================================================

$(function() {
    $('#searchReset').click(function() {
        hideSearchResult();
    });

    $(document).keydown(function(event) {
        if($('#search').val() == ''){
            $('#search').focus();
        }
    });
    $('#search').keyup(searchView(this)); //call function searchView()

    $(document).on('click touchend',function(event) {
        if($('#search').val() != ''){
            $('#search').focus();
        }
        // if (!$(event.target).closest('#searchResult').length && !$(event.target).closest('#searchGroup').length) {
        //     $('#searchResult').css('top', '0px');
        //     $('#searchResult').css('height', '0px');
        // }
    });
    $('#sysMenu').click(function() {
        if ($('#systemLinkArea').css("top") == "-5px") {
            $('#systemLinkArea').css('top', '50px');
            $('#sysMenu').addClass('sysMenuView');
            hideSearchResult();
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
            // $('.hideModule').css('display', 'inline-block');
            $('.hideModule').css('opacity', '1');
        } else {
            // $('.hideModule').css('display', 'none');
            $('.hideModule').css('opacity', '0');
        }

    });


});
// =================================================================================



// =================================================================================

