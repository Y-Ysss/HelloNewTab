let joinBkmrk = "";
let appendData = "";
let BookmarkNode = function(bookmark) {
    if("children" in bookmark && bookmark.children.length > 0) {
        bookmark.children.forEach(function(subBookmark) {
            BookmarkNode(subBookmark);
        });
        if(joinBkmrk !== "") {
            if(bookmark.title.match(/'$|^#/)){

            } else if(bookmark.title.match(/^'/)) {
                appendData += ('<div class="cntntModule hideModule hide"><div class="cntntHead">' + bookmark.title + '</div><ul>' + joinBkmrk + '<li class="bkmrkNum">' + bookmark.children.length + ' bookmarks</li></ul></div>');
            } else {
                appendData += ('<div class="cntntModule"><div class="cntntHead">' + bookmark.title + '</div><ul>' + joinBkmrk + '<span class="bkmrkNum">' + bookmark.children.length + ' bookmarks</span></ul></div>');
            }
            joinBkmrk = "";
        }
    } else if(bookmark.url !== undefined) {
        let title = bookmark.title.length > 0 ? bookmark.title : bookmark.url;
        joinBkmrk += '<li><a href="' + bookmark.url + '"><img class="favicon" src="chrome://favicon/' +
            bookmark.url + '">' + title + '</a></li>';
    }
}

let autoTheme = ()=> {
    chrome.storage.local.get((a) => {
        if(a !== undefined) {
            let nowTime = new Date().getHours();
            let range = [a.settings.sub.text.range.sliderLower, a.settings.sub.text.range.sliderUpper];
            if(range[0] !== "" && range[1] !== "") {
                if(range[0] <= nowTime && nowTime < range[1]) {
                    a.settings.common.radio.theme = a.settings.sub.select.autoThemeMode1;
                } else {
                    a.settings.common.radio.theme = a.settings.sub.select.autoThemeMode2;
                }
                chrome.storage.local.set({ settings: a.settings })
            }
        }
    })
}

let createContents = function() {
    chrome.bookmarks.getTree(function(itemTree) {
        itemTree.forEach(function(items) {
            if ("children" in items) {
                items.children.forEach(function(bookmark) { BookmarkNode(bookmark); });
            }
        });
        chrome.storage.local.set({ 'contentsData': appendData });
        appendData = "";
    });
    autoTheme();
    // 設定変更時 バックグラウンド更新
    // chrome.runtime.sendMessage({type: 'reload'}, function(response) {});
}


chrome.runtime.onInstalled.addListener(function() {
        let settings = {
            "common" : {
        "toggle": {"tgglIcon": -1, "tgglOpenTab": 1, "tgglWebSearch":-1},
        "radio": {"theme": "tmFlatLight"},
        "text": { "txtScale": ""},
      },
      "sub" : {
        "text" : {"txtRegExpPattern":"", "range":{ "sliderLower": "", "sliderUpper": ""}},
        "select": {"autoThemeMode1": "tmFlatLight", "autoThemeMode2": "tmFlatDark"}
      }}
        chrome.storage.local.set({ settings: settings });
        createContents();

    }),
    chrome.tabs.onCreated.addListener(function(a) {autoTheme();}),
    chrome.bookmarks.onChanged.addListener(function(a) {createContents();}),
    chrome.bookmarks.onMoved.addListener(function(a) {createContents();}),
    chrome.bookmarks.onChildrenReordered.addListener(function(a) {createContents();}),
    chrome.bookmarks.onRemoved.addListener(function(a) {createContents();})

    // chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { if(request.type === 'create') { createContents(); } });