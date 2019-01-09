let ini = new class {
  constructor() {
    //Default settings
    this.settings = {
      "common" : {
        "toggle": {"tgglIcon": -1, "tgglOpenTab": 1, "tgglWebSearch":-1},
        "radio": {"theme": "tmFlatLight"},
        "text": { "txtScale": ""},
      },
      "sub" : {
        "text" : {"txtRegExpPattern":"", "range":{ "sliderLower": "", "sliderUpper": ""}},
        "select": {"autoThemeMode1": "tmFlatLight", "autoThemeMode2": "tmFlatDark"}
      }
    },
    this.contentsData = "",
    this.initData()
  }
  // save
  saveData() { chrome.storage.local.set({ settings: this.settings }) }
  // load
  initData() {
    chrome.storage.local.get((a) => {
      a.settings === undefined ? (this.saveData(), this.init()) : (this.settings = a.settings, this.contentsData = a.contentsData, this.init())
    })
  }
  // called initData()
  // Initialization
  init() {
    this.addContents()
    this.walkJson(this.settings.common)
    this.evListener()
  }

  // called init() 
  addContents() {
    this.funcMacy();
    document.getElementById('bodyMain').innerHTML = this.contentsData;
    rippleEffect();
    this.contentsData = "";
  }

  // called addContents()
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

  // called init() 
  walkJson(data) {
    for (var key in data) {
      if (typeof data[key] === "object") {
        this.walkJson(data[key])
      } else {
        this[key](data[key])
      }
    }
  }

  tgglIcon(a) {
    a === 1 ? $('.favicon').css('border-radius', '0%') : $('.favicon').css('border-radius', '50%');
  }
  tgglOpenTab(a) {
    if (a === 1) { $('head').append('<base target="_blank">'); }
  }
  txtScale(a) {
    if (!isNaN(a) && a !== '') { $('html').css('zoom', a + '%'); }
  }
  theme(a) {
    $('head').append('<link id="ssTheme" rel="stylesheet" type="text/css" href="css/theme/' + a + '.css">');
    $('input[name="theme"]').val([a]);
  }
  tgglWebSearch(a) {
    a === 1 ? $('#sArea').removeClass('displayNone') : $('#sArea').addClass('displayNone');
    // a === 1 ? $('#sArea').css('display', 'block') : $('#sArea').css('display', 'none');
  }
  // sliderLower() {}
// sliderUpper() {}
// autoThemeMode1() {}
// autoThemeMode2() {}
// txtRegExpPattern(){}

  // Dynamic Elements AddEventListener
  evListener() {
    document.getElementById('tggl1').addEventListener('click', (event)=>{
      const element = event.target;
      element.classList.toggle('form_tggl_on');
      const items = document.getElementsByClassName('hideModule');
      for (let i = items.length - 1 ; i >= 0; i--) {
        items[i].classList.toggle('hide');
      }
    });
  }
}

let ev = new class {
  // data
  constructor() {
    this.systemLinkArea = 0;
    this.searchArea = 0;
    this.filter = 0;
    this.floatMenu = { theme: 0, visible: 0 }
  }
  moreMenu(a = this.systemLinkArea) {
    this.modeFilter(a);
    const sla = document.getElementById('systemLinkArea');
    if (a === 0) { // visible
      this.searchMenu(1);
      this.selectTheme(1);
      this.vsbltyMenu(1);
      sla.style.width = '19rem';
      this.systemLinkArea = 1;
    } else { // hidden
      sla.style.width = '4rem';
      this.systemLinkArea = 0;
    }
  }

  searchMenu(a = this.searchArea) {
    const searchGroup = document.getElementById('searchGroup');
    const searchMenu = document.getElementById('searchMenu');
    const search = document.getElementById('search');
    if (a === 0) { // visible
      this.moreMenu(1);
      this.selectTheme(1);
      this.vsbltyMenu(1);
      searchGroup.style.left = '4rem';
      searchMenu.classList.add('bg-searchMenu');
      search.focus();
      this.searchArea = 1;
    } else { // hidden
      searchGroup.style.left = '-34rem';
      searchMenu.classList.remove('bg-searchMenu');
      search.blur();
      this.searchArea = 0
      this.searchReset();
    }
  }

  modeFilter(a = this.filter) {
    const mF = document.getElementById('mFilter');
    if (a === 0) {
      mF.classList.add('filter');
      this.filter = 1;
    } else {
      mF.classList.remove('filter');
      this.filter = 0;
    }
  }

  searchReset() {
    document.getElementById('search').value = "";
    document.getElementById('searchReset').classList.remove('searchResetView');
    document.getElementById('searchResult').innerHTML = '';
  }

  searchView() {
    const words = document.getElementById('search').value;
    if (words == "") {
      document.getElementById('searchReset').classList.remove('searchResetView');
    }
    else{
      document.getElementById('searchReset').classList.add('searchResetView');
      chrome.bookmarks.search(words, function(results) {
        let joinResult = "";
        results.forEach(function(item) {
          if (item.url) {
            const title = item.title == "" ? item.url : item.title;
            joinResult += '<a href="' + item.url + '"><img class="favicon" src="chrome://favicon/' + item.url + '">' + title + '</a>';
          }
        });
        // $('#searchResult').append(joinResult + '<div id="resultNum">Search Result : ' + results.length + '</div>');
        document.getElementById('searchResult').innerHTML = joinResult + '<div id="resultNum">Search Result : ' + results.length + '</div>';
      });
    }
    // $('#searchResult').empty();
    document.getElementById('searchResult').innerHTML = '';
  }
  cssFloatMenu(obj, a) {
    obj.style.margin = a === 0 ? '-3rem 0 0 3rem' : '-3rem 0 0 4rem';
    obj.style.visibility = a === 0 ? 'hidden' : 'visible';
    obj.style.opacity = a;
  }
  selectTheme(a = this.floatMenu.theme) {
    const fmTheme = document.getElementById('fmTheme');

    if (a === 0) {
      this.moreMenu(1);
      this.vsbltyMenu(1);

      this.cssFloatMenu(fmTheme, 1);
      // $('#fmTheme').css({ margin: '-3rem 0 0 4rem', visibility: 'visible', opacity: '1' });
      this.floatMenu.theme = 1;
    } else {
      this.cssFloatMenu(fmTheme, 0);
      // $('#fmTheme').css({ margin: '-3rem 0 0 3rem', visibility: 'hidden', opacity: '0' });
      this.floatMenu.theme = 0;
    }
  }

  applyTheme() {
    ini.saveData();
    location.reload();
  }

  vsbltyMenu(a = this.floatMenu.visible) {
    // this.moreMenu();
    const fmVsblty = document.getElementById('fmVsblty');
    if (a === 0) {
      this.moreMenu(1);
      this.selectTheme(1);
      this.cssFloatMenu(fmVsblty, 1);
      // $('#fmVsblty').css({ margin: '-3rem 0 0 4rem', visibility: 'visible', opacity: '1' });
      this.floatMenu.visible = 1;
    } else {
      this.cssFloatMenu(fmVsblty, 0);
      // $('#fmVsblty').css({ margin: '-3rem 0 0 3rem', visibility: 'hidden', opacity: '0' });
      this.floatMenu.visible = 0;
    }
  }
}

deSVG('.faviconBig', true);

document.getElementById('search').addEventListener('keyup',ev.searchView);
document.addEventListener('keydown', (event) => {
  if (event.altKey && event.keyCode === 66) { // [ Alt + B ]
    ev.searchMenu(ev.searchArea);
  }
  if (event.keyCode === 27 && $('#search').focus()) { // [ Esc ]
    ev.searchMenu(1);
  }
});

document.addEventListener('click', ()=>{
  if ($(event.target).closest('#mFilter').length) {
    ev.moreMenu(1);
  }
});

$('.actionItems').click(function() {
  ev[this.id]();
});
$('.createTabLink').click(function() {
  chrome.tabs.create({ url: $(this).attr('data-href') });
  ev.moreMenu(1);
  document.getElementById('mFilter').classList.remove('filter');
});

$('input[type="radio"]').click(function() {
  ini.settings.common.radio[$(this)[0].name] = $(this)[0].id;
});

$(window).resize(function() {
  let timer;
  if (timer !== false) {
    clearTimeout(timer);
  }
  timer = setTimeout(function() {
    ini.funcMacy();
  }, 200);
});

// window.addEventListener('click', e => {
//   const eD = e.srcElement;
//   // console.log(eD)
// });
// chrome.runtime.sendMessage({type: 'create'}, function(response) {});
// 設定変更時 バックグラウンド更新
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.type === 'reload') {
//     location.reload(true)
//   }
// });

$('#s').keyup(function(e) {
  if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
    chrome.tabs.create({ url: "https://www.google.com/search?q=" + $('#s').val()});
    $('#s').val("");
  }
});

$('#sEnter').click(function() {
  chrome.tabs.create({ url: "https://www.google.com/search?q=" + $('#s').val()});
  $('#s').val("");
});