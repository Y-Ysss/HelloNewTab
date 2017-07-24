var joinBkmrk = "";
var indexBkmrk = 0;
chrome.bookmarks.getTree(function(itemTree) {
    itemTree.forEach(function(items) {
        if ("children" in items) {
            items.children.forEach(function(bookmark) {
                // console.log(bookmark);
                BookmarkNode(bookmark);
                // console.log(joinBkmrk);
            });
        }
    });
});

function BookmarkNode(bookmark) {
    // フォルダであるかをチェック
    if ("children" in bookmark) {
        // 中身が無いディレクトリは無視
        if (bookmark.children.length > 0) {
            indexBkmrk++;
            //console.log('Title : ' + bookmark.title);//FolderTitle
            $('#bodyMain').append('<div class="cntntModule"><div class="cntntHead">' + bookmark.title + '</div><ul id="cntntId_' + indexBkmrk + '"></ul></div>');
            // ディレクトリ(フォルダ)内のブックマークを列挙して再度同等の処理を行う
            bookmark.children.forEach(function(subBookmark) {
                BookmarkNode(subBookmark);
            });
            $('#cntntId_' + indexBkmrk).append(joinBkmrk);
            joinBkmrk = "";
        }
    } else {
        // タイトルが無しの場合はURLを表示
        var title = bookmark.title.length > 0 ? bookmark.title : bookmark.url;
        //console.log('Sub : ' + title);//BookmarkTitle
        joinBkmrk += '<li><img class="favicon" src="chrome://favicon/' + bookmark.url+ '"><a href="' + bookmark.url + '">' + title + '</a></li>';
    }
}
