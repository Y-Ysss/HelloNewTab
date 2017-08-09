// setData( [object] );
function setData(data) {
    chrome.storage.local.set(data, function() {});
}
// getData( [string, array of string, object] , [function] );
function getData(data, func){
    chrome.storage.local.get(data, function(value) {
        func(value[data]);    
    });
}

// closure test
function addContent() {
    let str = '';
    return function(num, run) {
        $.getJSON('https://api.github.com/repos/Yoseatlly/HelloNewTab/commits').then(function(json) {
            // console.log(json[num].commit.message + ',' + json[num].commit.author.date);
            str += '<div class="card_cntnt"><h4>' + json[num].commit.message + '</h4>Date : ' 
            + (json[num].commit.author.date).replace('T', '<br>Time : ').slice(0, -1) 
            + ' (UTC)<br><a href="' + json[num].html_url + '"></a></div>';
            if (run)
                $('#gitCommitsInfo').append(str);
        });
    }
}

$(function() {
    rippleEffect();

    
    $('#btnMode').click(function() {
        // setData({'sample':123}); 
        // getData('sample', console.log); //console.log()を実行

    });

    let $msnry = $('#bodyMain').masonry({
        itemSelector: '.cardArea',
        percentPosition: true,
        fitWidth: true
    });

    $.getJSON('manifest.json').then(function(manifest) {
        let str = '<div class="card_cntnt"><h4>Installed Release Version</h4>' + manifest.version + '</div>';
        $.getJSON('https://api.github.com/repos/Yoseatlly/HelloNewTab/releases/latest').then(function(data) {
            if (manifest.version != data.name) {
                str += '<h2>#Latest Release</h2><div class="card_cntnt"><h4>Version</h4>' 
                + data.name + '</div><div class="card_cntnt"><h4>What\'s New</h4>' 
                + data.body + '</div><div class="card_cntnt"><h4>URL</h4><a href="' + data.html_url + '"></a></div>';
                str = str.replace(/\r?\n/g, '<br>');
            }
            $('#ExtensionInfo').append(str);
            $msnry.masonry('layout');
        });
    });

    let func = addContent();
    func(0, 0);
    func(1, 0);
    func(2, 0);
    func(3, 0);
    func(4, 1);
    $msnry.masonry('layout');
    // console.log(getData('sample'));

    // $.getJSON('https://api.github.com/repos/Yoseatlly/HelloNewTab/commits').then(function(commitsList) {
    // var lastCmmtManifest = 'https://raw.githubusercontent.com/Yoseatlly/HelloNewTab/' + commitsList[0].sha + '/manifest.json';
    // $.getJSON(lastCmmtManifest).then(function(manifest) {
    //     console.log(manifest.version);
    // });
    // });

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