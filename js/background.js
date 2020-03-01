class ContentsController {
	constructor() {
		this.saveBookmarks()
	}
	async saveBookmarks() {
		const itemTree = await getBookmarksTree();
			itemTree.forEach((items) => {
				if ('children' in items) {
						items.children.forEach((bookmark) => {this.FormatBookmarks(bookmark)})
				}
			})
			chrome.storage.local.set({'jsonBookmarks': itemTree[0].children});
	}
	FormatBookmarks(item) {
		const el = ['children', 'id', 'parentId', 'title', 'url']
		this.OrganizeElementsKey(el, item)
	}

	OrganizeElementsKey(el, item) {
		for(let key in item) {
			if(el.indexOf(key) < 0) {
				delete item[key]
			}
			if("children" in item && item.children.length > 0) {
				item['visible'] = !item.title.match(/^'/);
				item.children.forEach((sub) => {
						this.OrganizeElementsKey(el, sub);
				});
			}
		}
	}
}
class bgService {
		constructor() {
				this.joinBkmrk = '';
				this.appendData = '';
				this.regExpPattern = '';
				// this.createContents();
		}
		async createContents() {
				// (async () => {
				//     await chrome.storage.local.get((data) => {
				//         console.log('getRegExp ->');
				//         if(data !== undefined) {
				//             this.regExpPattern = new RegExp(data.settings.sub.text.txt_regexp_pattern);
				//             console.log(this.regExpPattern)
				//         }
				//         console.log('getRegExp -|');
				//     });
				// })();
				const data = await getStorage('settings');
						if(data !== undefined) {
								const regexp = data.settings.sub.text.txt_regexp_pattern;

								this.regExpPattern = regexp === '' ? null : new RegExp(regexp);
						}
				// console.log(data.settings.sub.text.txt_regexp_pattern);
				const itemTree = await getBookmarksTree();
				// chrome.bookmarks.getTree((itemTree) => {
						itemTree.forEach((items) => {
								if ('children' in items) {
										items.children.forEach((bookmark) => {this.FormatBookmarks(bookmark); this.BookmarkNode(bookmark); });
								}
						});
						console.log(itemTree[0].children)
						chrome.storage.local.set({'contentsData': this.appendData});
						chrome.storage.local.set({'jsonBookmarks': itemTree[0].children});
						this.appendData = "";
				// });
				// this.autoTheme();
				// 設定変更時 バックグラウンド更新
				// chrome.runtime.sendMessage({type: 'reload'}, function(response) {});
				// console.log('create -|')

		}
		FormatBookmarks(item) {
				const el = ['children', 'id', 'parentId', 'title', 'url']
				this.OrganizeElementsKey(el, item)
		}

		OrganizeElementsKey(el, item) {
				for(let key in item) {
						if(el.indexOf(key) < 0) {
								delete item[key]
						}
						if("children" in item && item.children.length > 0) {
								item['visible'] = !item.title.match(/^'/);
								item.children.forEach((sub) => {
										this.OrganizeElementsKey(el, sub);
								});
						}
				}
		}

		BookmarkNode(bookmark) {
				if("children" in bookmark && bookmark.children.length > 0) {
						bookmark.children.forEach((subBookmark) => {
								this.BookmarkNode(subBookmark);
						});
						if(this.joinBkmrk !== "") {
								if(bookmark.title.match(/^'/)) {
										this.appendData += ('<div class="cntntModule hideModule hide"><div class="cntntHead">' + bookmark.title + '</div><ul>' + this.joinBkmrk + '<li    class="bkmrkNum">' + bookmark.children.length + ' bookmarks</li></ul></div>');
								} else
								if(!bookmark.title.match(this.regExpPattern)){
										this.appendData += ('<div class="cntntModule"><div class="cntntHead">' + bookmark.title + '</div><ul>' + this.joinBkmrk + '<span class="bkmrkNum">'    + bookmark.children.length + ' bookmarks</span></ul></div>');
								}                
								// else {
								//     this.appendData += ('<div class="cntntModule"><div class="cntntHead">' + bookmark.title + '</div><ul>' + this.joinBkmrk + '<span class="bkmrkNum">'    + bookmark.children.length + ' bookmarks</span></ul></div>');
								// }
								this.joinBkmrk = "";
						}
				} else if(bookmark.url !== undefined) {
						let title = bookmark.title.length > 0 ? bookmark.title : bookmark.url;
						this.joinBkmrk += '<li><a href="' + bookmark.url + '" title=" ' + title + ' "><img class="favicon" src="chrome://favicon/' + bookmark.url + '">' + title + '</a></li>';
						// this.joinBkmrk += '<li data-bookmarks-id="' + bookmark.id + '"><a href="' + bookmark.url + '"><img class="favicon" src="chrome://favicon/' +  bookmark.url + '">' + title + '</a></li>';
				}
		}

		// autoTheme() {
		//     chrome.storage.local.get((a) => {
		//         if(a !== undefined) {
		//             let nowTime = new Date().getHours();
		//             let range = [a.settings.sub.text.range.slider_lower, a.settings.sub.text.range.slider_upper];
		//             if(range[0] !== "" && range[1] !== "") {
		//                 if(range[0] <= nowTime && nowTime < range[1]) {
		//                     a.settings.common.radio.theme = a.settings.sub.select.auto_theme_mode_primary;
		//                 } else {
		//                     a.settings.common.radio.theme = a.settings.sub.select.auto-theme-mode-secondary;
		//                 }
		//                 chrome.storage.local.set({ settings: a.settings })
		//             }
		//         }
		//     });
		// }

}

class Handler extends DefaultSettings {
	constructor() {
		super()
	}
	async loadData() {
		const data = await getStorage(null)
		data.settings === undefined ? this.saveData() : this.settings = data.settings
		this.init()
	}
	init() {
		console.log('Handler')
	}
}
const handler = new Handler()
const con = new ContentsController()
// const bgservice = new bgService();

// chrome.runtime.onInstalled.addListener(async () => {
// 		let settings = {
// 				"common" : {
// 						"toggle": {"tggl_icon": -1, "tggl_open_tab": 1, "tggl_web_search":-1},
// 						"radio": {"theme": "tmFlatLight"},
// 						"text": { "txt_scale": ""},
// 				},
// 				"sub" : {
// 						"text" : {"txt_regexp_pattern":"", "range":{ "slider_lower": "", "slider_upper": ""}},
// 						"select": {"auto_theme_mode_primary": "tmFlatLight", "auto-theme-mode-secondary": "tmFlatDark"}
// 				}
// 		}
// 		// chrome.storage.local.set({ settings: settings }, ()=>{
// 				await setStorage({'settings':settings});
// 				bgservice.createContents();
// 		// });
// }),
// // chrome.tabs.onCreated.addListener((a) => {bgservice.autoTheme();}),
// chrome.bookmarks.onChanged.addListener((a) => {bgservice.createContents();}),
// chrome.bookmarks.onMoved.addListener((a) => {bgservice.createContents();}),
// chrome.bookmarks.onChildrenReordered.addListener((a) => {bgservice.createContents();}),
// chrome.bookmarks.onRemoved.addListener((a) => {bgservice.createContents();})

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
// 		if(request.type === 'reload') {
// 				bgservice.createContents();
// 		}
// });