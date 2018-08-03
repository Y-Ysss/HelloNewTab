let ev = new class {
  constructor() {
    //Default settings
    this.settings = {
      "toggle": {"tgglIcon": -1,"tgglOpenTab": -1},
      "text": { "txtScale": "", "range":{ "sliderLower": "0", "sliderUpper": "0"}},
      "radio": {"theme": "tmLight"
      }
    },
    this.initData()
  }
  // save
  saveData() {
    chrome.storage.local.set({ settings: this.settings });
    this.toast();
    // 設定変更時 バックグラウンド更新
    // chrome.runtime.sendMessage({type: 'reload'}, function(response) {});
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
    for(var key in data) {
      if(typeof data[key] === "object") {
        this.setState(key, data[key])
      }
    }
  }
  // called walkJson()
  setState(type, data) {
    for(const key in data) {
      if(type === 'toggle' && data[key] === 1) {
        $('#' + key).addClass('toggle_on');
      } else if(type === 'text') {
        if(key === 'range') {
        for(const a in data[key]){
          $('.' + a).val([data[key][a]]);
          $('#' + a + 'Range').val([data[key][a]]);
        }
      }else{
        $('#' + key).val(data[key]);
      }
      } else if(type === 'radio') {
        $('input[name="' + key + '"]').val([data[key]]);
      }
      
    }
  }
  // called init()
  pageFunc() {
    $('.toggle').click(function() {
      $(this).toggleClass('toggle_on');
      ev.settings.toggle[$(this)[0].id] *= -1;
      ev.saveData();
    });
    $('#txtScale').blur(function() {
      ev.settings.text[$(this)[0].id] = $(this)[0].value;
      ev.saveData();
    });
    $('input[type="radio"]').click(function() {
      ev.settings.radio[$(this)[0].name] = $(this)[0].id;
      ev.saveData();
    });
    $('input[type="range"]').change(function() {
      ev.settings.text.range[$(this)[0].name] = $(this)[0].value;
      $('.' + $(this)[0].name).val($(this)[0].value);
      ev.saveData();
    });
    $('.textTime').blur(function() {
      let id = $(this)[0].id;
      $('#' + id + 'Range').val($(this)[0].value);
      ev.settings.text.range[$(this)[0].id] = $(this)[0].value;
      ev.saveData();
    });
  }

  versionInfo() {
    $.getJSON('manifest.json').then(function(manifest) {
      let str = '<div class="cardContents"><b>Installed Version</b><br>' + manifest.version + '</div>';
      $.getJSON('https://api.github.com/repos/Yoseatlly/HelloNewTab/releases/latest').then(function(data) {
        if(manifest.version !== data.name) {
          str += '<h2>#Latest Release</h2><div class="cardContents"><b>Version</b><br>' +
            data.name + '</div><div class="cardContents"><b>What\'s New</b><br>' +
            data.body + '</div><div class="cardContents"><b>URL</b><br><a href="' + data.html_url + '"></a></div>';
          str = str.replace(/\r?\n/g, '<br>');
        }
        $('#ExtensionInfo').append(str);
      });
    });
  }

  gitCommitsInfo() {
    let str = '';
    $.getJSON('https://api.github.com/repos/Yoseatlly/HelloNewTab/commits').then(function(json) {
      for(let i = 0; i < 5; i++) {
        str += '<div class="cardContents"><b>' + json[i].commit.message + '</b><br><span>' +
          (json[i].commit.author.date).replace('T', ', ').slice(0, -1) +
          ' (UTC)</span><br><a href="' + json[i].html_url + '"></a></div>';
      }
      $('#gitCommitsInfo').append(str);
    });
  }

  toast() {
    $('#toast').css('bottom', '1rem');
    setTimeout(function() { $('#toast').css('bottom', '-5rem'); }, 3000);
  }
}
