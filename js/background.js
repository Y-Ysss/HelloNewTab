class bgService {
    constructor() {
        this.joinBkmrk = "";
        this.appendData = "";
        this.regExpPattern = "";
        this.createContents();
    }
    createContents() {
        (async () => {
            await chrome.storage.local.get('settings', (data) => {
                this.regExpPattern = data.settings.sub.text.txtRegExpPattern;
            });
        })();
        chrome.bookmarks.getTree((itemTree) => {
            itemTree.forEach((items) => {
                if ("children" in items) {
                    items.children.forEach((bookmark) => { this.BookmarkNode(bookmark); });
                }
            });
            chrome.storage.local.set({ 'contentsData': this.appendData });
            this.appendData = "";
        });
        this.autoTheme();
        // 設定変更時 バックグラウンド更新
        // chrome.runtime.sendMessage({type: 'reload'}, function(response) {});
    }

    BookmarkNode(bookmark) {
        if("children" in bookmark && bookmark.children.length > 0) {
            bookmark.children.forEach((subBookmark) => {
                this.BookmarkNode(subBookmark);
            });
            if(this.joinBkmrk !== "") {
                // console.log(this.regExpPattern)
                // if(this.regExpPattern !== undefined && bookmark.title.match(this.regExpPattern)){
                    // console.log("match (" + this.RegExpPattern + ") : " + bookmark.title)
                // } else 
                if(bookmark.title.match(/^'/)) {
                    this.appendData += ('<div class="cntntModule hideModule hide"><div class="cntntHead">' + bookmark.title + '</div><ul>' + this.joinBkmrk + '<li    class="bkmrkNum">' + bookmark.children.length + ' bookmarks</li></ul></div>');
                } else {
                    this.appendData += ('<div class="cntntModule"><div class="cntntHead">' + bookmark.title + '</div><ul>' + this.joinBkmrk + '<span class="bkmrkNum">'    + bookmark.children.length + ' bookmarks</span></ul></div>');
                }
                this.joinBkmrk = "";
            }
        } else if(bookmark.url !== undefined) {
            let title = bookmark.title.length > 0 ? bookmark.title : bookmark.url;
            this.joinBkmrk += '<li><a href="' + bookmark.url + '"><img class="favicon" src="chrome://favicon/' + bookmark.url + '">' + title + '</a></li>';
            // this.joinBkmrk += '<li data-bookmarks-id="' + bookmark.id + '"><a href="' + bookmark.url + '"><img class="favicon" src="chrome://favicon/' +  bookmark.url + '">' + title + '</a></li>';
        }
    }

    autoTheme() {
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

}

const bgservice = new bgService();

chrome.runtime.onInstalled.addListener(() => {
    let settings = {
        "common" : {
            "toggle": {"tgglIcon": -1, "tgglOpenTab": 1, "tgglWebSearch":-1},
            "radio": {"theme": "tmFlatLight"},
            "text": { "txtScale": ""},
        },
        "sub" : {
            "text" : {"txtRegExpPattern":"", "range":{ "sliderLower": "", "sliderUpper": ""}},
            "select": {"autoThemeMode1": "tmFlatLight", "autoThemeMode2": "tmFlatDark"}
        }
    }
    chrome.storage.local.set({ settings: settings });
    bgservice.createContents();
}),
chrome.tabs.onCreated.addListener((a) => {bgservice.autoTheme();}),
chrome.bookmarks.onChanged.addListener((a) => {bgservice.createContents();}),
chrome.bookmarks.onMoved.addListener((a) => {bgservice.createContents();}),
chrome.bookmarks.onChildrenReordered.addListener((a) => {bgservice.createContents();}),
chrome.bookmarks.onRemoved.addListener((a) => {bgservice.createContents();})

    // chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { if(request.type === 'create') { createContents(); } });