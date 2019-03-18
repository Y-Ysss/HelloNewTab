class bgService {
    constructor() {
        this.joinBkmrk = '';
        this.appendData = '';
        this.regExpPattern = '';
        console.log('Constructor');
        (async () => {
            const Xaa = await getStorage('settings');
            console.log(Xaa)
        })();
        // this.createContents();
    }
    async createContents() {
        console.group('create contents');
        console.log('create');
        // (async () => {
        //     await chrome.storage.local.get((data) => {
        //         console.log('getRegExp ->');
        //         if(data !== undefined) {
        //             this.regExpPattern = new RegExp(data.settings.sub.text.txtRegExpPattern);
        //             console.log(this.regExpPattern)
        //         }
        //         console.log('getRegExp -|');
        //     });
        // })();
        const data = await getStorage('settings');
        console.group('reg exp');
        console.log(data)
            if(data !== undefined) {
                this.regExpPattern = new RegExp(data.settings.sub.text.txtRegExpPattern);
                console.log(this.regExpPattern)
            }
        console.groupEnd();
        // console.log(data.settings.sub.text.txtRegExpPattern);
        console.group('get bookmarks tree');
        const itemTree = await getBookmarksTree();
        // chrome.bookmarks.getTree((itemTree) => {
            console.log(itemTree);
            itemTree.forEach((items) => {
                if ('children' in items) {
                    items.children.forEach((bookmark) => { this.BookmarkNode(bookmark); });
                }
            });
            chrome.storage.local.set({ 'contentsData': this.appendData });
            this.appendData = "";
            console.groupEnd();
        // });
        this.autoTheme();
        // 設定変更時 バックグラウンド更新
        // chrome.runtime.sendMessage({type: 'reload'}, function(response) {});
        // console.log('create -|')
        console.groupEnd();

    }

    BookmarkNode(bookmark) {
        if("children" in bookmark && bookmark.children.length > 0) {
            bookmark.children.forEach((subBookmark) => {
                this.BookmarkNode(subBookmark);
            });
            if(this.joinBkmrk !== "") {
                // if(bookmark.title.match(this.regExpPattern)){
                    // console.log(this.regExpPattern)
                //     // console.log("match (" + this.RegExpPattern + ") : " + bookmark.title)
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
            this.joinBkmrk += '<li><a href="' + bookmark.url + '" title=" ' + title + ' "><img class="favicon" src="chrome://favicon/' + bookmark.url + '">' + title + '</a></li>';
            // this.joinBkmrk += '<li data-bookmarks-id="' + bookmark.id + '"><a href="' + bookmark.url + '"><img class="favicon" src="chrome://favicon/' +  bookmark.url + '">' + title + '</a></li>';
        }
    }

    autoTheme() {
        chrome.storage.local.get((a) => {
        console.group('auto theme');
            if(a !== undefined) {
                let nowTime = new Date().getHours();
                let range = [a.settings.sub.text.range.sliderLower, a.settings.sub.text.range.sliderUpper];
                console.log(range);
                if(range[0] !== "" && range[1] !== "") {
                    if(range[0] <= nowTime && nowTime < range[1]) {
                        a.settings.common.radio.theme = a.settings.sub.select.autoThemeMode1;
                    } else {
                        a.settings.common.radio.theme = a.settings.sub.select.autoThemeMode2;
                    }
                    chrome.storage.local.set({ settings: a.settings })
                }
            }
        console.groupEnd();
        });
    }

}

const bgservice = new bgService();

chrome.runtime.onInstalled.addListener(async () => {
    console.group('installed')
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
    // chrome.storage.local.set({ settings: settings }, ()=>{
        await setStorage({'settings':settings});
        bgservice.createContents();
    // });
    console.groupEnd();
}),
chrome.tabs.onCreated.addListener((a) => {bgservice.autoTheme();}),
chrome.bookmarks.onChanged.addListener((a) => {bgservice.createContents();}),
chrome.bookmarks.onMoved.addListener((a) => {bgservice.createContents();}),
chrome.bookmarks.onChildrenReordered.addListener((a) => {bgservice.createContents();}),
chrome.bookmarks.onRemoved.addListener((a) => {bgservice.createContents();})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.type === 'reload') {
        bgservice.createContents();
    }
});