let aaa = new class {
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
        });}

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
        $('head').append('<link rel="stylesheet" type="text/css" href="css/theme/' + a + '.css">');
    }

}
// $('#search').on('input', function(){});
$('#search').keypress(function(e) {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        searchView($('#search').val());
    }
});