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

// =================================================================================
$(function() {
    
    $(".toggle").each(function() {
        getData($(this).attr('id'), setValueTggl);
    });
    $(".textBox").each(function() {
        getData($(this).attr('id'), setValueInput);
    });
    $(".textBox").blur(function() {
        setData({[$(this)[0].id]: $(this)[0].value});
    });
    chrome.storage.local.get(null, function(items) {
        let allKeys = Object.keys(items);
        let str = '';
        let i = 0;
        allKeys.forEach(function(key) {
            // i++;
            if (typeof(items[key]) === "string") {
                str += '<tr id="' + key + '"><td></td><td>' + key + '</td><td>"' + items[key] + '"</td></tr>';
            } else {
                str += '<tr id="' + key + '"><td></td><td>' + key + '</td><td>' + items[key] + '</td></tr>';
            }
        });
        $('#dataTable').append(str);
    });

    $('.button').click(function() {
        let keyRK = $('#txtRemoveKey').val();
        if ($(this).attr("id") === 'btnRemoveApply' && keyRK !== '' && keyRK < $('tr').length) {
            if(!isNaN(keyRK)){
                keyRK = $('tr').eq(keyRK).attr("id");
            }
            chrome.storage.local.remove(keyRK);
            $('#' + keyRK).remove();
            $('#txtRemoveKey').val('');
        }
        if ($(this).attr("id") === 'btnAllClear'){
            chrome.storage.local.clear();
            $("tr:not(:first)").remove();
        }
    });

    $('.toggle').click(function() {
        const id = $(this)[0].id;
        $(this).toggleClass('toggle_on');
        if ($(this).hasClass('toggle_on')) {
            setData({
                [id]: 1
            });
        } else {
            setData({
                [id]: -1
            });
        }
    });

// $("#textEditor").append(data.replace(/;(?!\*\/)|\*\/|\{|\}/g, '$&<br>'));

    rippleEffect();
});