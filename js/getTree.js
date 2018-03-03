//call > setData( [object] );
let setData = function (data) {
    chrome.storage.local.set(data, function() {
        getData(Object.keys(data), console.log);
    });
}
// call > getData( [string, array of string, object] , [function] );
let getData = function(data, func) {
    chrome.storage.local.get(data, function(value) {
        func(value);
    });
}
// ==================================
let joinBkmrk = "";
let indexBkmrk = 0;
let bkmrkNum = 0;
let appendData = "";
let BookmarkNode = function(bookmark) {
    if ("children" in bookmark) {
        if (bookmark.children.length > 0) {
            indexBkmrk++;
            bookmark.children.forEach(function(subBookmark) {
                BookmarkNode(subBookmark);
            });
            if (joinBkmrk !== "") {
                if (bookmark.title.slice(0, 1) === "'") {
                    appendData += ('<div class="cntntModule hideModule"><div class="cntntHead ripple">' +
                        bookmark.title + '</div><ul id="cntntId_' + indexBkmrk + '">' +
                        joinBkmrk + '<li class="bkmrkNum">' + bkmrkNum + ' bookmarks</li></ul></div>');
                } else {
                    appendData += ('<div class="cntntModule"><div class="cntntHead ripple">' +
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
        setData({'contentsData' : appendData});
        appendData = "";
        // console.log('created');  
    } else {
        // console.log('not doing');
    }
}