class Reflector {
	tggl_icon(value) {
		const br = value ? '0%' : '50%';
		for(const item of document.getElementsByClassName('favicon')) {
			item.style.borderRadius = br;
		}
	}
	tggl_open_tab(value) {
		if(value){document.head.insertAdjacentHTML('beforeend', '<base target="_blank">')}
	}
	txt_scale(value) {
		if(isFinite(value) && value !== '') {document.documentElement.style.zoom = value + '%'}
	}
	theme(value) {
		document.head.insertAdjacentHTML('beforeend', `<link id="ssTheme" rel="stylesheet" type="text/css" href="css/theme/${value}.css">`)
		document.getElementById(value).checked = true
	}
	tggl_web_search(value) {
		value ? document.getElementById('sArea').classList.remove('displayNone') : document.getElementById('sArea').classList.add('displayNone');
	}
}

class AddContents extends DefaultSettings {
	constructor(classEventFunctions) {
		super()
		this.eventFunc = classEventFunctions
		this.contentModule = document.getElementById('contentModuleTemplate')
		this.contentModuleList = document.getElementById('liTemplate')
		this.fragment = document.createDocumentFragment()
	}
	init() {
		console.log('{loaded}')
		this.addContents()
		deSVG('.faviconBig', true);
	}
	async addContents() {
		const data = await getStorage('jsonBookmarks');
		for(let i in data.jsonBookmarks) {
			this.generate(data.jsonBookmarks[i].children);
		}
		this.funcMacy();
		document.getElementById('bodyMain').appendChild(this.fragment);

		this.reflect()
		this.addElementsEventListener()
	}

	generate(items, listData) {
		items.forEach((item) => {
			if("children" in item) {
				let contentModuleClone = document.importNode(this.contentModule.content, true),
				cntntModule = contentModuleClone.querySelector('.cntntModule'),
				header = contentModuleClone.querySelector('.cntntHead'),
				ul = contentModuleClone.querySelector('ul'),
				listData = document.createDocumentFragment();
				if(!item.visible) {
					cntntModule.classList.add('hideModule', 'hide');
				}
				header.textContent = item.title;
				this.generate(item.children, listData);
				const count = listData.childElementCount;
				if(count > 0) {
					let span = document.createElement('span');
					span.className = "bkmrkNum"
					span.textContent = `${count} bookmarks`;
					listData.appendChild(span)
					ul.appendChild(listData);
					this.fragment.appendChild(contentModuleClone);
				}
			} else {
				let liClone = document.importNode(this.contentModuleList.content, true),
				img = liClone.querySelector('img'),
				a = liClone.querySelector('a');
				a.appendChild(document.createTextNode(item.title));
				a.href = item.url;
				img.src = `chrome://favicon/${item.url}`;
				listData.appendChild(liClone);
			}
		})
	}

	reflect() {
		const data = this.settings
		for(const type in data){
			if(typeof data[type] === "object") {
				this.setState(type, data[type])
			}
		}
	}
	setState(type, data) {
		const reflector = new Reflector()
		for(const key in data) {
			const func = reflector[key]
			if(typeof func === 'function') {
				func(data[key])
			}
		}
	}

	wrapper(key, action, func) {
		const all = document.querySelectorAll(key)
		for(const item of all) {
			item.addEventListener(action, (event) => {func(event), this.saveData()})
		}
	}

	addElementsEventListener() {
		this.wrapper('.actionItems', 'click', (event) => {
			this.eventFunc[event.target.id]()
		})
		this.wrapper('input[type=radio]', 'click', (event) => {
			this.settings.radio.theme = event.target.id
		})
		this.wrapper('.createTabLink', 'click', (event) => {
			chrome.tabs.create({ url: event.target.dataset.href });
  // ev.moreMenu(1);
  			document.getElementById('mFilter').classList.remove('filter');
		})
		// this.wrapper('#tgglVisible', 'click', (event) => {
		// 	console.log(event)
		// 	const element = event.target;
		// 	element.classList.toggle('form_tggl_on');
		// 	const items = document.getElementsByClassName('hideModule');
		// 	for (let i = items.length - 1 ; i >= 0; i--) {
		// 		items[i].classList.toggle('hide');
		// 	}
		// })
		this.wrapper('#search', 'keyup', (event) => {
			this.eventFunc.searchView()
		})
		this.wrapper('html', 'click', (event) => {

		})
		this.wrapper('html', 'keydown', (event) => {
			if (event.altKey && event.keyCode === 66) { // [ Alt + B ]
				console.log('Alt + B')
			}
			if (event.keyCode === 27 && $('#search').focus()) { // [ Esc ]
				console.log('Esc')
			}
		})
	}

	funcMacy() {
		let mw = parseInt($('#bodyMain').width() / 190);
		let macy = Macy({
			container: '#bodyMain',
			trueOrder: false,
			waitForImages: true,
			columns: mw,
			margin: { x: 30, y: 15 },
			breakAt: { 1200: 5, 990: 4, 780: 3, 620: 2, 430: 1 }
		});
	}
}
const NOW_OPEN = true
const NOW_CLOSE = false
const TO_OPEN = false
const TO_CLOSE = true
class EventFunctions {
  constructor() {
    this.linkArea = NOW_CLOSE
    this.searchArea = NOW_CLOSE
    this.filter = NOW_CLOSE
    this.themePopup = NOW_CLOSE
    this.fmVsblty = NOW_CLOSE
  }
  moreMenu(state = this.linkArea) {
  	this.filtering(state);
    const sla = document.getElementById('systemLinkArea');
    if(state) {
      sla.style.width = '4rem';
    } else {
      sla.style.width = '19rem';
      this.searchMenu(TO_CLOSE);
      this.selectThemeMenu(TO_CLOSE);
      this.vsbltyMenu(TO_CLOSE);
    }
    this.linkArea = !state
  }
  filtering(state = this.filter) {
    const mF = document.getElementById('mFilter');
    if (state) {
      mF.classList.remove('filter');
    } else {
      mF.classList.add('filter');
    }
    this.filter = !state
  }
  searchMenu(state = this.searchArea) {
    const searchGroup = document.getElementById('searchGroup');
    const searchMenu = document.getElementById('searchMenu');
    const search = document.getElementById('search');
    if(state) {
      searchGroup.style.left = '-34rem';
      searchMenu.classList.remove('bg-searchMenu');
      search.blur();
      this.searchReset();
    } else {
      this.moreMenu(TO_CLOSE);
      this.selectThemeMenu(TO_CLOSE);
      this.vsbltyMenu(TO_CLOSE);
      searchGroup.style.left = '4rem';
      searchMenu.classList.add('bg-searchMenu');
      search.focus();
    }
    this.searchArea = !state;
  }
  searchReset() {
    document.getElementById('search').value = "";
    document.getElementById('searchReset').classList.remove('searchResetView');
    document.getElementById('searchResult').innerHTML = '';
  }
  searchView() {
    const words = document.getElementById('search').value;
    if(words == "") {
      document.getElementById('searchReset').classList.remove('searchResetView');
    }
    else{
      document.getElementById('searchReset').classList.add('searchResetView');
      chrome.bookmarks.search(words, (results) => {
        let joinResult = '';
        for(const item of results) {
          if(item.url) {
            const title = item.title == "" ? item.url : item.title;
            joinResult += `<a class="searchResultItems" href="${item.url}" title="${title}"><img class="favicon" src="chrome://favicon/${item.url}">${title}</a>`;
          }
        }
        document.getElementById('searchResult').innerHTML = `${joinResult}<div id="resultNum">${results.length}bookmarks</div>`;
      });
    }
    document.getElementById('searchResult').innerHTML = '';
  }
  cssFloatMenu(obj, state) {
    obj.style.margin = state ? '-4rem 0 0 3rem' : '-4rem 0 0 5rem';
    obj.style.visibility = state ? 'hidden' : 'visible';
    obj.style.opacity = state ? 0 : 1;
  }
  selectThemeMenu(state = this.themePopup) {
    const fmTheme = document.getElementById('fmTheme');

    if (state) {
      this.cssFloatMenu(fmTheme, TO_CLOSE);
      // $('#fmTheme').css({ margin: '-3rem 0 0 3rem', visibility: 'hidden', opacity: '0' });   
    } else {
    	this.moreMenu(TO_CLOSE);
      this.vsbltyMenu(TO_CLOSE);
      this.cssFloatMenu(fmTheme, TO_OPEN);
      // $('#fmTheme').css({ margin: '-3rem 0 0 4rem', visibility: 'visible', opacity: '1' });
    }
      this.themePopup = !state;
  }
  applyTheme() {
    location.reload();
  }
  vsbltyMenu(state = this.fmVsblty) {
  	const fmVsblty = document.getElementById('fmVsblty');
  	if (state) {
      this.cssFloatMenu(fmVsblty, TO_CLOSE);
    } else {
    	this.moreMenu(TO_CLOSE);
      this.selectThemeMenu(TO_CLOSE);
      this.cssFloatMenu(fmVsblty, TO_OPEN);
    }
      this.fmVsblty = !state;
  }
  tgglVisible(state) {
  		const tgVsblty = document.getElementById('tgglVisible');
		tgVsblty.classList.toggle('form_tggl_on');
		const items = document.getElementsByClassName('hideModule');
		for (let i = items.length - 1 ; i >= 0; i--) {
			items[i].classList.toggle('hide');
		}
  }
}
// const eventFunc = 
const add = new AddContents(new EventFunctions())


