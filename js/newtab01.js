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

    $('#bodyMain').freetile({
        selector: '.cntntModule',
        animate: true
    });
});
// ============================
function BookmarkNode(bookmark) {

    if ("children" in bookmark) { // フォルダであるかをチェック
        // 中身が無いディレクトリは無視
        if (bookmark.children.length > 0) {
            indexBkmrk++;
            // 再帰処理 フォルダ内のブックマークに対して
            bookmark.children.forEach(function(subBookmark) {
                BookmarkNode(subBookmark);
            });

            if (joinBkmrk != "") {
                $('#bodyMain').append('<div class="cntntModule"><div class="cntntHead">' + bookmark.title + '</div><ul id="cntntId_' + indexBkmrk + '">' + joinBkmrk + '</ul></div>');
                joinBkmrk = ""; //初期化   
            }
        }
    } else {
        var title = bookmark.title.length > 0 ? bookmark.title : bookmark.url; // タイトルが無しの場合はURLを表示
        joinBkmrk += '<li><a href="' + bookmark.url + '"><img class="favicon" src="chrome://favicon/' + bookmark.url + '">' + title + '</a></li>';
    }
}

// =================================================================================

$(function() {
    $('#search').keyup(searchView(this));

    $('#searchReset').click(function() {
        $('#search').val("");
        $('#searchReset').addClass('displayNone');
    });
    $(document).click(function(event) {
        if ('#searchResult ul li') {
            $('#search').val("");
            $('#searchReset').addClass('displayNone');
            $('#searchResult').addClass('displayNone');
        }
        if (!$(event.target).closest('#searchResult').length && !$(event.target).closest('#search').length) {
            $('#searchResult').addClass('displayNone');
        }
    });

    $('body').chromeContext({
        items: [{
                title: 'Menu_01',
                onclick: function() { inLog(2, "a1"); }
            }, {
                title: 'Menu_02',
                onclick: function() { inLog(2, "b2"); }
            },
            { separator: true }, {
                title: 'Menu_03',
                onclick: function() { inLog(2, "c3"); }
            }, {
                title: 'Menu_04',
                onclick: function() { inLog(2, "d4"); }
            }
        ]
    });
	$('#tggl1').click(function() {
		$(this).toggleClass('form_tggl_on');
	});


});
// =================================================================================



// =================================================================================
function searchView(inputWord) {
    var type_old = type_new = $(inputWord).find('#search').val();
    return function() {
        type_new = $(inputWord).find('#search').val();
        if (type_new == "") {
            $('#searchReset').addClass('displayNone');
            $('#searchResult').addClass('displayNone');
        } else {
            $('#searchReset').removeClass('displayNone');
            $('#searchResult').removeClass('displayNone');
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

function searchNode(node) {
	var nodeId
    if (node.children) {
        node.children.forEach(function(child) {
            searchNode(child);
        });
    }
    if (node.url) {
    var title = node.title == "" ? node.url : node.title;
        // 三項演算子
        joinResult += '<a href="' + node.url + '"><img class="favicon" src="chrome://favicon/' + node.url + '">' + title +'</a>';
    }
}

// =================================================================================
// デバッグ
function inLog(num, logText) {
    $('#logView' + num).text(logText);
}
