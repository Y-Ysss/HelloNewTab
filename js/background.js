chrome.runtime.onInstalled.addListener(function (){
    // console.log('installed');
    // chrome.tabs.create({url:chrome.extension.getURL("hello.html")},function(){});
    createContents();
});

chrome.bookmarks.onChanged.addListener(function(a) {
    // console.log('changed');
    createContents();
}),
chrome.bookmarks.onMoved.addListener(function(a) {
    // console.log('moved');
    createContents();
}),
chrome.bookmarks.onChildrenReordered.addListener(function(a) {
    // console.log('childrenReordered');
    createContents();
}),
chrome.tabs.onCreated.addListener(function(a) {
    // console.log('tabCreate');
    createContents();
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    // console.log('message : ' + message);
    sendResponse(message);
});

