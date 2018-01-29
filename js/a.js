// call >> getData( [get item name ... string, array of string, object] , [action ... function] );
let getData = function(data, func) {
    chrome.storage.local.get(data, function(value) {
        func(value);
    });
}

let funcSetCSS = function(data) {
    // if(data.theme !== undefined) {
    tm = data.theme === undefined ? 'tmLight' : data.theme;
    $('head').append('<link rel="stylesheet" type="text/css" href="css/theme/' + tm + '.css">');
    // }
}
// $(function() {
//     getData('theme', funcSetCSS);
// });