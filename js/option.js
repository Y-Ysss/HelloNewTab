//call >> setData( [set item data ... object] );
function setData(data) {
    chrome.storage.local.set(data, function() {
        // getData(Object.keys(data), console.log);
    });
}
// call >> getData( [get item name ... string, array of string, object] , [action ... function] );
function getData(data, func) {
    chrome.storage.local.get(data, function(value) {
        func(value);
    });
}
// call >> sendData( [sending data ... string, number, etc] , [action ... function] );
function sendData(message, func) {
    chrome.runtime.sendMessage(message,function(response){
        func === undefined ? console.log('response : ' + response) : func(response);
    });
}

// ============================

// set value .toggle
function setValueTggl(data) {
    const key = Object.keys(data)[0];
    if (data[key] === 1) {
        $('#' + key).addClass('toggle_on');
    }
}

// set value input
function setValueInput(data) {
    const key = Object.keys(data)[0];
    $('#' + key).val(data[key]);
}

// closure test
function addContent() {
    let str = '';
    let num = 0;
    return function(run) {
        // 改善必要箇所 --> sha 取得・適用
        // $.getJSON('https://api.github.com/repos/Yoseatlly/HelloNewTab/commits?per_page=100&sha=c2a24a50ad0852f6e7cc61cfc66cf69fa6a70cc4').then(function(json) {
        $.getJSON('https://api.github.com/repos/Yoseatlly/HelloNewTab/commits').then(function(json) {
            str += '<div class="cardContents"><h4>' + json[num].commit.message + '</h4>Date : ' +
                (json[num].commit.author.date).replace('T', '<br>Time : ').slice(0, -1) +
                ' (UTC)<br><a href="' + json[num].html_url + '"></a></div>';
            if (run)
                $('#gitCommitsInfo').append(str);
            num++;
        });
    }
}
// =================================================================================
$(function() {
    sendData('aaaa');
    $.getJSON('manifest.json').then(function(manifest) {
        let str = '<div class="cardContents"><h4>Installed Release Version</h4>' + manifest.version + '</div>';
        $.getJSON('https://api.github.com/repos/Yoseatlly/HelloNewTab/releases/latest').then(function(data) {
            if (manifest.version !== data.name) {
                str += '<h2>#Latest Release</h2><div class="cardContents"><h4>Version</h4>' +
                    data.name + '</div><div class="cardContents"><h4>What\'s New</h4>' +
                    data.body + '</div><div class="cardContents"><h4>URL</h4><a href="' + data.html_url + '"></a></div>';
                str = str.replace(/\r?\n/g, '<br>');
            }
            $('#ExtensionInfo').append(str);
        });
    });

    let func = addContent();
    for (let i = 0; i < 7; i++) {
        func(0);
    }
    func(1);

    $(".toggle").each(function() {
        getData($(this).attr('id'), setValueTggl);
    });
    $("input").each(function() {
        getData($(this).attr('id'), setValueInput);
    });
    $("input").blur(function() {
        setData({[$(this)[0].id]: $(this)[0].value});
    });

    $('.button').click(function() {
        if ($(this).attr("id") === 'btnTest1') {
            chrome.storage.local.get(null, function(items) {
                let allKeys = Object.keys(items);
                allKeys.forEach(function(key){
                    console.log(key +' : ' + items[key]);
                })
            });
        }
    });



    $('.toggle').click(function() {
        const id = $(this)[0].id;
        $(this).toggleClass('toggle_on');
        if ($(this).hasClass('toggle_on')) {
            setData({[id]: 1});
        } else {
            setData({[id]: -1});
        }
    });

    rippleEffect();
});
