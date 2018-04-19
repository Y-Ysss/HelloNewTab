let ini = new class {
    constructor() {
        //Default settings
        this.settings = {
            "toggle": {
                "tgglIcon": -1,
                "tgglOpenTab": -1
            },
            "text": {
                "txtScale": ""
            },
            "radio": {
                "theme": "tmLight"
            }
        },
        this.contentsData = "",
        this.initData()
    }
    // save
    saveData() {
        chrome.storage.local.set({ settings: this.settings })
    }
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
        // console.log(this.settings)
    }

    // called init() 
    addContents() {
        $('#bodyMain').append(this.contentsData);
        this.funcMacy();
        rippleEffect();
    }

    // called addContents()
    funcMacy() {
        let mw = parseInt($('#bodyMain').width() / 190);
        let macy = Macy({
            container: '#bodyMain',
            trueOrder: false,
            waitForImages: true,
            columns: mw,
            margin: {
                x: 30,
                y: 15
            },
            breakAt: {
                1200: 5,
                940: 3,
                520: 2,
                400: 1
            }
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
    // called walkJson()
    tgglIcon(a) {
        a === 1 ? $('.favicon').css('border-radius', '0%') : $('.favicon').css('border-radius', '50%');
    }
    // called walkJson()
    tgglOpenTab(a) {
        if (a === 1) { $('head').append('<base target="_blank">'); }
    }
    // called walkJson()
    txtScale(a) {
        if (!isNaN(a) && a !== '') { $('html').css('zoom', a + '%'); }
    }
    // called walkJson()
    theme(a) {
        $('head').append('<link id="ssTheme" rel="stylesheet" type="text/css" href="css/theme/' + a + '.css">');
    }

}

let ev = new class {
    // data
    constructor() {
        this.systemLinkArea = 0;
        this.searchArea = 0;
        this.filter = 0;
    }
    moreMenu(a = this.systemLinkArea) {
        this.modeFilter(a);
        if (a === 0) { // visible
            this.searchMenu(1);
            $('#systemLinkArea').css('width', '19rem');
            this.systemLinkArea = 1;
        } else { // hidden
            $('#systemLinkArea').css('width', '4rem');
            this.systemLinkArea = 0;
        }
    }

    searchMenu(a = this.searchArea) {
        if (a === 0) { // visible
            this.moreMenu(1);
            $('#searchGroup').css('width', '30rem');
            $('#searchMenu').addClass('bg-searchMenu');
            $('#search').focus();
            this.searchArea = 1;
        } else { // hidden
            $('#searchGroup').css('width', '0rem');
            $('#searchMenu').removeClass('bg-searchMenu');
            $('#search').blur();
            this.searchArea = 0
            this.searchReset();
        }
    }

    vsbltyMenu() {
        this.moreMenu();
    }

    modeFilter(a = this.filter) {
        const mF = $('#mFilter');
        if (a === 0) {
            mF.addClass('filter');
            this.filter = 1;
        } else {
            mF.removeClass('filter');
            this.filter = 0;
        }
    }

    searchReset() {
        $('#search').val("");
        $('#searchReset').removeClass('searchResetView');
        $('#searchResult').empty();
    }

    searchView() {
        $('progressBar').css('display', 'block');
        const words = $('#search').val();
        chrome.bookmarks.search(words, function(results) {
            let joinResult = "";
            results.forEach(function(item) {
                if (item.url) {
                    const title = item.title == "" ? item.url : item.title;
                    joinResult += '<a href="' + item.url + '"><img class="favicon" src="chrome://favicon/' + item.url + '">' + title + '</a>';
                }
            });
            $('#searchResult').append(joinResult + '<div id="resultNum">Search Result : ' + results.length + '</div>');
        });
        $('progressBar').css('display', 'none');
        $('#searchResult').empty();
    }
    switchTheme() {
        let tm = ini.settings.radio.theme;
        if(tm == 'tmLight') {
            tm = 'tmDark';
        } else {
            tm = 'tmLight';
        }
        ini.settings.radio.theme = tm;
        ini.saveData();
        location.reload();
    }
}

deSVG('.faviconBig', true);

$('#search').keyup(function(e) {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        ev.searchView();
    }
    this.value !== "" ? $('#searchReset').addClass('searchResetView') : $('#searchReset').removeClass('searchResetView');
});
$(document).keydown(function(event) {
    if (event.altKey) { // [ Alt + B ]
        if (event.keyCode === 66 && $('#search').val() === '') {
            ev.searchArea(0);
        }
    }
    if (event.keyCode === 27 && $('#search').focus()) { // [ Esc ]
        ev.searchArea(1);
    }
});
$(document).click(function(event) {
    if ($(event.target).closest('#mFilter').length) {
        ev.moreMenu(1);
    }
});

$('.actionItems').click(function() {
    ev[this.id]();
});

$('.createTabLink').click(function() {
    chrome.tabs.create({ url: $(this).attr('href') });
    ev.linkArea(1);
    $('#mFilter').removeClass('filter');
});

$('#tggl1').click(function() {
    $(this).toggleClass('form_tggl_on');
    if ($(this).hasClass('form_tggl_on')) {
        $('.hideModule').css('visibility', 'visible').css('opacity', '1');
    } else {
        $('.hideModule').css('visibility', 'hidden').css('opacity', '0');
    }
});