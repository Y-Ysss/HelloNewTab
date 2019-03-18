try {
let ev = new class {
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
    this.initData()
  }
  // save
  saveData() {
    chrome.storage.local.set({ settings: this.settings });
    this.toast();
  }
  // load
  initData() {
    chrome.storage.local.get((a) => {
      a.settings === undefined ? (this.saveData(), this.init()) : (this.settings = a.settings, this.init())
    })
  }
  // called initData()
  // Initialization
  init() {
    this.walkJson(this.settings)
    this.pageFunc()
    this.versionInfo()
    this.gitCommitsInfo()
    rippleEffect();
  }
  // called init() 
  walkJson(data) {
    for(const s in data) {
      for(const type in data[s]){
      if(typeof data[s][type] === "object") {
        this.setState(type, data[s][type])
      }
    }
    }
  }
  // called walkJson()
  setState(type, data) {
    for(const key in data) {
      this[type](data, key);
    }
  }
  // called setState()
  toggle(data, key) {
    if(data[key] === 1) {
      $('#' + key).addClass('toggle_on');
    }
  }
  // called setState()
  text(data, key) {
    if(key === 'range') {
      for(const a in data[key]){
        $('.' + a).val([data[key][a]]);
        $('#' + a + 'Range').val([data[key][a]]);
      }
    }else{
      $('#' + key).val(data[key]);
    }
  }
  // called setState()
  radio(data, key) {
    $('input[name="' + key + '"]').val([data[key]]);
  }
  // called setState()
  select(data, key) {
    $('select[name="' + key + '"]').val([data[key]]);
  }

  // called init()
  pageFunc() {
    $('.toggle').click(function() {
      $(this).toggleClass('toggle_on');
      ev.settings.common.toggle[$(this)[0].id] *= -1;
      ev.saveData();
    });
    $('#txtScale').blur(function() {
      ev.settings.common.text[$(this)[0].id] = $(this)[0].value;
      ev.saveData();
    });
    $('input[type="radio"]').click(function() {
      ev.settings.common.radio[$(this)[0].name] = $(this)[0].id;
      ev.saveData();
    });
    $('#txtRegExpPattern').blur(function() {
      // let pattern = ;
      // if(!pattern.match(/^[\/]/)) {
      //   pattern = "/" + pattern;
      // }
      // if(!pattern.match(/.\/$/)) {
      //   pattern = pattern + "/";
      // }
      ev.settings.sub.text[$(this)[0].id] = $(this)[0].value;
      ev.saveData();
    });
    $('input[type="range"]').change(function() {
      ev.settings.sub.text.range[$(this)[0].name] = $(this)[0].value;
      $('.' + $(this)[0].name).val($(this)[0].value);
      ev.saveData();
    });
    $('.textTime').change(function() {
      let value = $(this)[0].value;
      $('.' + $(this)[0].name).val(value);
      $('#' + $(this)[0].name + 'Range').val(value);
      ev.settings.sub.text.range[$(this)[0].name] = value;
      ev.saveData();
    });
    $('select').change(function() {
      ev.settings.sub.select[$(this)[0].name] = $(this)[0].value;
      ev.saveData();
    });

    $('#testReload').click(function(){
      // 設定変更時 バックグラウンド更新
      chrome.runtime.sendMessage({type: 'reload'}, function(response) {});
    })
  }

  versionInfo() {
    const manifestData = chrome.runtime.getManifest();
    document.getElementById('ExtensionInfo').insertAdjacentHTML('beforeend', '<div class="cardContents"><b>Installed Version</b><br>' + manifestData.version + '</div>');
    fetch('https://api.github.com/repos/Y-Ysss/HelloNewTab/releases/latest').then(resp => {return resp.json();})
    .then(latestRelease => {
      let str = ''; 
      if(manifestData.version !== latestRelease.name) {
        str += '<h2>#Latest Release</h2><div class="cardContents"><b>Version</b><br>' + latestRelease.name + '</div><div class="cardContents"><b>What\'s New</b><br>' + latestRelease.body + '</div><div class="cardContents"><b>URL</b><br><a href="' + latestRelease.html_url + '"></a></div>';
        str = str.replace(/\r?\n/g, '<br>');
      }
    document.getElementById('ExtensionInfo').insertAdjacentHTML('beforeend', str);
    });
  }

  gitCommitsInfo() {
    let str = '';
    fetch('https://api.github.com/repos/Y-Ysss/HelloNewTab/commits').then(resp => {return resp.json();})
    .then(commitsData => {
      for(let i = 0; i < 5; i++) {
        str += '<div class="cardContents"><b>' + commitsData[i].commit.message + '</b><br><span>' +
          (commitsData[i].commit.author.date).replace('T', ', ').slice(0, -1) +
          ' (UTC)</span><br><a href="' + commitsData[i].html_url + '"></a></div>';
      }
      document.getElementById('gitCommitsInfo').insertAdjacentHTML('beforeend', str);
    });
  }

  toast() {
    $('#toast').css('bottom', '1rem');
    setTimeout(()=> { $('#toast').css('bottom', '-5rem'); }, 3000);
  }
}
} catch(e) {
console.error(e)
}