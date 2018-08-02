chrome.runtime.onInstalled.addListener(function() {
    // chrome.tabs.create({url:chrome.extension.getURL("hello.html")},function(){});
    createContents();
}),
chrome.bookmarks.onChanged.addListener(function(a) {
    createContents();
}),
chrome.bookmarks.onMoved.addListener(function(a) {
    createContents();
}),
chrome.bookmarks.onChildrenReordered.addListener(function(a) {
    createContents();
}),
chrome.tabs.onCreated.addListener(function(a) {
    createContents();
}),
chrome.bookmarks.onRemoved.addListener(function(a) {
    createContents();
})
// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     sendResponse(message);
// });
