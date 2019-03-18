const asyncFunc = callbackFunc => (...args) => new Promise((resolve, reject) => {
  callbackFunc(...args, result => {
    if (chrome.runtime.lastError) {
      reject(new Error(chrome.runtime.lastError.message));
      return;
    }
    resolve(result); // return result
  });
});

const getStorage = asyncFunc((keys, callback) => {
  chrome.storage.local.get(keys, callback);
});
const setStorage = asyncFunc((keys, callback) => {
  chrome.storage.local.set(keys, callback);
});
const getBookmarksTree = asyncFunc((callback) => {
	chrome.bookmarks.getTree(callback);
});