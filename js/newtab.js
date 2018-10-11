let ini = new class {
  constructor() {
    //Default settings
    this.settings = {
      "toggle": {"tgglIcon": -1,"tgglOpenTab": -1, "tgglWebSearch":-1},
      "radio": {"theme": "tmLight"},
      "text": {"txtScale": "","range": {"sliderLower": "0","sliderUpper": "0"}},
      "select": {"autoThemeMode1": "tmLight", "autoThemeMode2": "tmLight"}
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
    this.walkJson(this.settings)
  }

  // called init() 
  addContents() {
    this.funcMacy();
    const startTime = performance.now(); // 開始時間
    // $('#bodyMain').append(this.contentsData);

    let bdyMain = document.getElementById('bodyMain');
    bdyMain.innerHTML = this.contentsData;
    
    const endTime = performance.now(); // 終了時間
    console.log(endTime - startTime); // 表示
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
    for(var key in data) {
      if(typeof data[key] === "object") {
        this.walkJson(data[key])
      } else {
        this[key](data[key])
      }
    }
  }

  // called walkJson()
  tgglIcon(a) {
    a === 1 ? $('.favicon').css('border-radius', '0%') : $('.favicon').css('border-radius', '50%');
  }
  // called walkJson()
  tgglOpenTab(a) {
    if(a === 1) { $('head').append('<base target="_blank">'); }
  }
  // called walkJson()
  txtScale(a) {
    if(!isNaN(a) && a !== '') { $('html').css('zoom', a + '%'); }
  }
  // called walkJson()
  theme(a) {
    $('head').append('<link id="ssTheme" rel="stylesheet" type="text/css" href="css/theme/' + a + '.css">');
    $('input[name="theme"]').val([a]);
  }
  tgglWebSearch(a) {
    a === 1 ? $('#sArea').removeClass('displayNone') : $('#sArea').addClass('displayNone');
    // a === 1 ? $('#sArea').css('display', 'block') : $('#sArea').css('display', 'none');
  }
  sliderLower() {}
  sliderUpper() {}
  autoThemeMode1() {}
  autoThemeMode2() {}
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
    if(a === 0) { // visible
      this.searchMenu(1);
      this.selectTheme(1);
      this.vsbltyMenu(1);
      sla.style.width = '19rem';
      // $('#systemLinkArea').css('width', '19rem');
      this.systemLinkArea = 1;
    } else { // hidden
      sla.style.width = '4rem';
      // $('#systemLinkArea').css('width', '4rem');
      this.systemLinkArea = 0;
    }
  }

  searchMenu(a = this.searchArea) {
    const searchGroup = document.getElementById('searchGroup');
    const searchMenu = document.getElementById('searchMenu');
    const search = document.getElementById('search');
    if(a === 0) { // visible
      this.moreMenu(1);
      this.selectTheme(1);
      this.vsbltyMenu(1);
      searchGroup.style.left = '4rem';
      searchMenu.classList.add('bg-searchMenu');
      search.focus();
      // $('#searchGroup').css('left', '4rem');
      // $('#searchMenu').addClass('bg-searchMenu');
      // $('#search').focus();
      this.searchArea = 1;
    } else { // hidden
      searchGroup.style.left = '-34rem';
      searchMenu.classList.remove('bg-searchMenu');
      search.blur();
      // $('#searchGroup').css('left', '-34rem');
      // $('#searchMenu').removeClass('bg-searchMenu');
      // $('#search').blur();
      this.searchArea = 0
      this.searchReset();
    }
  }

  // hideModule(a, b) {
  //   const hM = document.getElementsByClassName('hideModule');
  //   hM.style.visibility = a;
  //   hM.style.opacity = b;
  // }

  modeFilter(a = this.filter) {
    // const mF = $('#mFilter');
    const mF = document.getElementById('mFilter');
    if(a === 0) {
      mF.classList.add('filter');
      // mF.addClass('filter');
      this.filter = 1;
    } else {
      mF.classList.remove('filter');
      // mF.removeClass('filter');
      this.filter = 0;
    }
  }

  searchReset() {
    document.getElementById('search').value = "";
    document.getElementById('searchReset').classList.remove('searchResetView');
    document.getElementById('searchResult').innerHTML = '';
    // $('#search').val("");
    // $('#searchReset').removeClass('searchResetView');
    // $('#searchResult').empty();
  }

  searchView() {
    // const words = $('#search').val();
    const words = document.getElementById('search').value;
    if(words != "") {
    chrome.bookmarks.search(words, function(results) {
      let joinResult = "";
      console.log(results)
      results.forEach(function(item) {
        if(item.url) {
          const title = item.title == "" ? item.url : item.title;
          joinResult += '<a href="' + item.url + '"><img class="favicon" src="chrome://favicon/' + item.url + '">' + title + '</a>';
        }
      });
      $('#searchResult').append(joinResult + '<div id="resultNum">Search Result : ' + results.length + '</div>');
    });
  }
    $('#searchResult').empty();
    // document.getElementById('searchResult').innerHTML = '';
  }
  cssFloatMenu(obj, a){
      obj.style.margin = a === 0 ? '-3rem 0 0 3rem' : '-3rem 0 0 4rem';
      obj.style.visibility = a === 0 ? 'hidden' : 'visible';
      obj.style.opacity = a;
    }
  selectTheme(a = this.floatMenu.theme) {
    const fmTheme = document.getElementById('fmTheme');
    
    if(a === 0) {
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
    if(a === 0) {
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

$('#search').keyup(function(e) {
  // if((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
    ev.searchView();
  // }
  this.value !== "" ? $('#searchReset').addClass('searchResetView') : $('#searchReset').removeClass('searchResetView');
});
$(document).keydown(function(event) {
  if(event.altKey && event.keyCode === 66) { // [ Alt + B ]
    // if ($('#search').val() === '') {
    ev.searchMenu(ev.searchArea);
    // }
  }
  if(event.keyCode === 27 && $('#search').focus()) { // [ Esc ]
    ev.searchMenu(1);
  }
});
$(document).click(function(event) {
  if($(event.target).closest('#mFilter').length) {
    ev.moreMenu(1);
  }
});

$('.actionItems').click(function() {
  ev[this.id]();
});
$('.createTabLink').click(function() {
  chrome.tabs.create({ url: $(this).attr('href') });
  ev.moreMenu(1);
  document.getElementById('mFilter').classList.remove('filter');
  // $('#mFilter').removeClass('filter');
});

$('#tggl1').click(function() {
  this.classList.toggle('form_tggl_on');
  // $(this).toggleClass('form_tggl_on');
  // if($(this).hasClass('form_tggl_on')) {

  if(this.classList.contains('form_tggl_on')) {
    // ev.hideModule('visible', 1);
    $('.hideModule').css({ visibility: 'visible', opacity: '1' });
  } else {
    // ev.hideModule('hidden', 0);
    $('.hideModule').css({ visibility: 'hidden', opacity: '0' });
  }
});

$('input[type="radio"]').click(function() {
  ini.settings.radio[$(this)[0].name] = $(this)[0].id;
});

$(window).resize(function() {
  let timer;
  if(timer !== false) {
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
//     if (request.type === 'reload') {
//         location.reload(true)
//     }
// });

$('#s').keyup(function(e) {
  if((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
    // chrome.tabs.create({ url: "https://www.google.com/search?q=" + $('#s').val()});
    $('#s').val("");
  }
});

$('#sEnter').click(function() {
  // chrome.tabs.create({ url: "https://www.google.com/search?q=" + $('#s').val()});
    $('#s').val("");
});