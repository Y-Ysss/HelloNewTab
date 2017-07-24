var joinBkmrk = "";
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
