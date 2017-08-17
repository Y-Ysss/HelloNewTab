//call > setData( [object] );
function setData(data) {
    chrome.storage.local.set(data, function() {
        // getData(Object.keys(data), console.log);
    });
}
// call > getData( [string, array of string, object] , [function] );
function getData(data, func) {
    chrome.storage.local.get(data, function(value) {
        func(value);
    });
}

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
        $.getJSON('https://api.github.com/repos/Yoseatlly/HelloNewTab/commits?per_page=100&sha=c2a24a50ad0852f6e7cc61cfc66cf69fa6a70cc4').then(function(json) {
            str += '<div class="card_cntnt"><h4>' + json[num].commit.message + '</h4>Date : ' +
                (json[num].commit.author.date).replace('T', '<br>Time : ').slice(0, -1) +
                ' (UTC)<br><a href="' + json[num].html_url + '"></a></div>';
            if (run)
                $('#gitCommitsInfo').append(str);
            num++;
        });
    }
}

$(function() {

    let $msnry = $('#bodyMain').masonry({
        itemSelector: '.cardArea',
        percentPosition: true,
        fitWidth: true
    });

    $.getJSON('manifest.json').then(function(manifest) {
        let str = '<div class="card_cntnt"><h4>Installed Release Version</h4>' + manifest.version + '</div>';
        $.getJSON('https://api.github.com/repos/Yoseatlly/HelloNewTab/releases/latest').then(function(data) {
            if (manifest.version !== data.name) {
                str += '<h2>#Latest Release</h2><div class="card_cntnt"><h4>Version</h4>' +
                    data.name + '</div><div class="card_cntnt"><h4>What\'s New</h4>' +
                    data.body + '</div><div class="card_cntnt"><h4>URL</h4><a href="' + data.html_url + '"></a></div>';
                str = str.replace(/\r?\n/g, '<br>');
            }
            $('#ExtensionInfo').append(str);
            $msnry.masonry('layout');
        });
    });

    let func = addContent();
    for (let i = 0; i < 7; i++) {
        func(0);
    }
    func(1);

    $msnry.masonry('layout');

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
        if ($(this).attr("id") === 'Button1') {
            console.log('Click Button1');
            for (let i = 0; i < 7; i++) {
                func(0);
            }
            func(1);
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

// =================================================================================
function rippleEffect() {
    let ripple, ripples, RippleEffect, loc, cover, coversize, style, x, y, i, num;

    ripples = document.querySelectorAll('.ripple');
    //位置を取得
    RippleEffect = function(e) {
        ripple = this; //get item
        cover = document.createElement('span'); //create span
        coversize = ripple.offsetWidth; //get width
        loc = ripple.getBoundingClientRect(); //get absolute position
        x = e.pageX - loc.left - window.pageXOffset - (coversize / 2);
        y = e.pageY - loc.top - window.pageYOffset - (coversize / 2);
        pos = 'top:' + y + 'px; left:' + x + 'px; height:' + coversize + 'px; width:' + coversize + 'px;';

        //Append span
        ripple.appendChild(cover);
        cover.setAttribute('style', pos);
        cover.setAttribute('class', 'rp-effect'); //add class

        //4s delete span
        setTimeout(function() {
            let list = document.getElementsByClassName("rp-effect");
            for (var i = list.length - 1; i >= 0; i--) { //latest delete
                list[i].parentNode.removeChild(list[i]);
            }
        }, 4000)
    };
    for (i = 0, num = ripples.length; i < num; i++) {
        ripple = ripples[i];
        ripple.addEventListener('mousedown', RippleEffect);
    }
}
// =================================================================================