let joinBkmrk = "";
let appendData = "";
let BookmarkNode = function(bookmark) {
    console.log(bookmark)
    if ("children" in bookmark && bookmark.children.length > 0) {
        // if () {
            bookmark.children.forEach(function(subBookmark) {
                BookmarkNode(subBookmark);
            });
            if (joinBkmrk !== "") {
                if (bookmark.title.slice(0, 1) === "'") {
                    appendData += ('<div class="cntntModule hideModule"><div class="cntntHead ripple">' +
                        bookmark.title + '</div><ul>' +
                        joinBkmrk + '<li class="bkmrkNum">' + bookmark.children.length + ' bookmarks</li></ul></div>');
                } else {
                    appendData += ('<div class="cntntModule"><div class="cntntHead ripple">' +
                        bookmark.title + '</div><ul>' +
                        joinBkmrk + '<span class="bkmrkNum">' + bookmark.children.length + ' bookmarks</span></ul></div>');
                }
                joinBkmrk = "";
            }
        // }
    } else if(bookmark.url !== undefined){
        let title = bookmark.title.length > 0 ? bookmark.title : bookmark.url;
        joinBkmrk += '<li class="ripple"><a href="' + bookmark.url + '"><img class="favicon" src="chrome://favicon/' +
            bookmark.url + '">' + title + '</a></li>';
    }
}
let createContents = function() {
    chrome.bookmarks.getTree(function(itemTree) {
            itemTree.forEach(function(items) {
            if ("children" in items) {
                items.children.forEach(function(bookmark) {
                    BookmarkNode(bookmark);
                });
            }
        });
    });
    if(appendData !== "") {
        // setData({'contentsData' : appendData});
        chrome.storage.local.set({contentsData: appendData})
        appendData = "";
    }
    chrome.storage.local.get((a) => {
        if(a !== undefined) {
            let nowTime = new  Date().getHours();
            let range = [a.settings.text.range.slider_lower, a.settings.text.range.slider_upper];
            if(range[0] !== "" && range[1] !== "") {
                if(range[0] <= nowTime && nowTime < range[1]){
                    a.settings.radio.theme = a.settings.select.auto_theme_mode_primary;
                } else {
                    a.settings.radio.theme = a.settings.select.auto-theme-mode-secondary;
                }
                chrome.storage.local.set({settings: a.settings})
            }
        }
    })
    // 設定変更時 バックグラウンド更新
    // chrome.runtime.sendMessage({type: 'reload'}, function(response) {});
}

