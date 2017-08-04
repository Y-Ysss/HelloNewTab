$(function() {
    $('#bodyMain').masonry({
        itemSelector: '.cardArea',
        percentPosition: true,
        fitWidth: true
    });
    
    $.getJSON('manifest.json').then(function(manifest) {
        var str = '<div class="card_cntnt"><h4>Installed Version</h4>' + manifest.version + '</div>';
        $.getJSON('https://api.github.com/repos/Yoseatlly/HelloNewTab/releases/latest').then(function(data) {
            if (manifest.version != data.name) {
                str += '<h2>#New Release</h2><div class="card_cntnt"><h4>Version</h4>' + data.name + '</div><div class="card_cntnt"><h4>What\'s New</h4>' + data.body + '</div><div class="card_cntnt"><h4>URL</h4><a href="' + data.html_url + '">' + data.html_url + '</a></div>';
                str = str.replace(/\r?\n/g, '<br>');
            }
            $('#gitInfo').append(str);
        });
    });

    $.getJSON('https://api.github.com/repos/Yoseatlly/HelloNewTab/commits').then(function(commitsList) {
        console.log(commitsList[0].sha);
        var lastCmmtManifest = 'https://raw.githubusercontent.com/Yoseatlly/HelloNewTab/' + commitsList[0].sha + '/manifest.json';
        $.getJSON(lastCmmtManifest).then(function(manifest){
            console.log(manifest.version);
        });
    });
});