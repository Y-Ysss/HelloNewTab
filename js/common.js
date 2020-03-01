const asyncFunc = callbackFunc => (...args) => new Promise((resolve, reject) => {
  callbackFunc(...args, result => {
    if (chrome.runtime.lastError) {
      reject(new Error(chrome.runtime.lastError.message));
      return;
    }
    resolve(result);
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

class DefaultSettings {
  constructor() {
    this.settings = {
      "toggle": {"tggl_icon": false, "tggl_open_tab": true, "tggl_web_search":false},
      "radio": {"theme": "tmFlatLight"},
      "text": { "txt_scale": "", "txt_regexp_pattern":""},
      "range":{ "slider_lower": "", "slider_upper": ""},
      "select": {"auto_theme_mode_primary": "tmFlatLight", "auto-theme-mode-secondary": "tmFlatDark"}
    }
    this.loadData()
  }
  async loadData() {
    const data = await getStorage(null)
    data.settings === undefined ? this.saveData() : this.settings = data.settings
    this.init()
  }
  saveData() {
    setStorage({'settings': this.settings})
  }
  init(){}
}