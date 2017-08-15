let joinBkmrk = "";
let indexBkmrk = 0;
let bkmrkNum = 0;
chrome.bookmarks.getTree(function(itemTree) {
    itemTree.forEach(function(items) {
        if ("children" in items) {
            items.children.forEach(function(bookmark) {
                BookmarkNode(bookmark);
            });
        }
    });

    $('#bodyMain').masonry({
        itemSelector: '.cntntModule',
        percentPosition: true
    });
    rippleEffect();
});
// ============================
function BookmarkNode(bookmark) {
    if ("children" in bookmark) {
        if (bookmark.children.length > 0) {
            indexBkmrk++;
            bookmark.children.forEach(function(subBookmark) {
                BookmarkNode(subBookmark);
            });
            if (joinBkmrk !== "") {
                if (bookmark.title.slice(0, 1) === "'") {
                    $('#bodyMain').append('<div class="cntntModule hideModule"><div class="cntntHead ripple">' 
                        + bookmark.title + '</div><ul id="cntntId_' + indexBkmrk + '">' 
                        + joinBkmrk + '<li class="bkmrkNum">' + bkmrkNum + ' bookmarks</li></ul></div>');
                } else {
                    $('#bodyMain').append('<div class="cntntModule"><div class="cntntHead ripple">' 
                        + bookmark.title + '</div><ul id="cntntId_' + indexBkmrk + '">' 
                        + joinBkmrk + '<span class="bkmrkNum">' + bkmrkNum + ' bookmarks</span></ul></div>');
                }
                joinBkmrk = "";
                bkmrkNum = 0;
            }
        }
    } else {
        bkmrkNum++;
        let title = bookmark.title.length > 0 ? bookmark.title : bookmark.url;
        joinBkmrk += '<li class="ripple"><a href="' + bookmark.url + '"><img class="favicon" src="chrome://favicon/' 
        + bookmark.url + '">' + title + '</a></li>';
    }
}
// =================================================================================
// =================================================================================
function searchView() {
    let type_old = type_new = $('#search').val();
    return function() {
        let sR = $('#searchResult');
        type_new = $('#search').val();
        if (type_new === "") {
            $('#searchReset').css('color', '#678');
            sR.css('top', '0px').css('height', '0px');
        } else {
            $('#searchReset').css('color', '#fff');
            sR.css('top', '50px').css('height', '400px');
            $('#systemLinkArea').css('top', '-5px');
            $('#sysMenu').removeClass('sysMenuView');
        }
        if (type_old !== type_new) {
            type_old = type_new;

            sR.empty();
            let joinResult = "";
            chrome.bookmarks.search($('#search').val(), function(results) {
                for(let i = 0, len = results.length; i < len; i++ ){
                    joinResult += searchNode(results[i]);
                }
                // results.forEach(function(searchItem) {
                //     joinResult += searchNode(searchItem);
                // });
                sR.append(joinResult);
                joinResult = "";
                sR.append('<div style="margin:5px">Search Result : ' + $('#searchResult a').length + '</div>');
            });
        }
    }
}
// ============================
function searchNode(node) {

    if (node.children) {
        // node.children.forEach(function(child) {
        //     searchNode(child);
        // });
        for(let i = 0, len = node.children.length; i < len; i++){
            searchNode(node.children[i]);
        }
    }
    if (node.url) {
        const title = node.title == "" ? node.url : node.title;
        // joinResult += '<a href="' + node.url + '"><img class="favicon" src="chrome://favicon/' + node.url + '">' + title + '</a>';
        return '<a href="' + node.url + '"><img class="favicon" src="chrome://favicon/' + node.url + '">' + title + '</a>';
    }
}

// =================================================================================
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
            for (let i = list.length - 1; i >= 0; i--) { //latest delete
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
// =================================================================================
function hideSearchResult() {
    $('#search').val("");
    $('#searchReset').css('color', '#678');
    $('#searchResult').css('top', '0px').css('height', '0px');

}
function getData(data, func) {
    chrome.storage.local.get(data, function(value) {
        console.log(value);
        func(value);
    });
}
// =================================================================================
// =================================================================================

$(function() {
    getData('tgglIcon', function(data){if(data.tgglIcon===1){$('.favicon').css('border-radius', '0%');}else{$('.favicon').css('border-radius', '50%');}});

    $(document).keydown(function(event) {
        if (event.altKey) {
            if (event.keyCode === 66 && $('#search').val() === '') {
                $('#search').focus();
            }
        }
        if (event.keyCode === 27 && $('#search').focus()) {
            $('#search').blur();
                hideSearchResult();
        }
    });
    $('#search').keyup(searchView()); //call function searchView()

    $(document).click(function(event) {
        if ($('#search').val() !== '') {
            $('#search').focus();
        }
    });

    $('#searchReset').click(function() {
        hideSearchResult();
    });

    $('#sysMenu').click(function() {
        let sLA = $('#systemLinkArea');
        if (sLA.css("top") === "-5px") {
            sLA.css('top', '50px');
            $('#sysMenu').addClass('sysMenuView');
            hideSearchResult();
        } else {
            sLA.css('top', '-5px');
            $('#sysMenu').removeClass('sysMenuView');
        }
    });

    $('.systemLink').click(function() {
        chrome.tabs.create({ url: $(this).attr('href') });
    });

    $('#tggl1').click(function() {
        $(this).toggleClass('form_tggl_on');
        if ($(this).hasClass('form_tggl_on')) {
            $('.hideModule').css('visibility', 'visible').css('opacity', '1');
        } else {
            $('.hideModule').css('visibility', 'hidden').css('opacity', '0');
        }
    });
    // $('body').chromeContext({
    //     items: [{
    //         title: 'Menu_01',
    //         onclick: function() {

    //         }
    //     }, {
    //         title: 'Menu_02',
    //         onclick: function() {

    //         }
    //     }, { separator: true }, {
    //         title: 'Menu_03',
    //         onclick: function() {

    //         }
    //     }, {
    //         title: 'Menu_04',
    //         onclick: function() {

    //         }
    //     }]
    // });

});