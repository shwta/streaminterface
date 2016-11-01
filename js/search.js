var page;
var offset;
var queryString;

function callApi() {

    window.jsonpCallback = function(data) {
        console.log(data);
        var streamArray = [];
        var totalStreams = data._total;
        if (totalStreams === 0) {
            page = 0;
        }
        for (var i = 0; i < data.streams.length; i++) {
            var stream = {};
            stream.displayName = data.streams[i].channel.display_name;
            stream.game = data.streams[i].channel.game;
            stream.views = data.streams[i].channel.views;
            stream.preview = data.streams[i].preview.small;
            stream.followers = data.streams[i].channel.followers;
            stream.viewers = data.streams[i].viewers;
            streamArray.push(stream);
        }

        showStreams(streamArray, totalStreams);
    };
    var jSonPCallScript = document.createElement('script');
    jSonPCallScript.async=true;
    jSonPCallScript.type = 'text/javascript';
    jSonPCallScript.setAttribute('src', 'https://api.twitch.tv/kraken/search/streams?callback=jsonpCallback&client_id=euavmelq006t9osbd7nw0uc5jdyard&q='+ queryString+'&offset='+offset);

    document.body.appendChild(jSonPCallScript);
};

function showStreams(streamArray, totalStreams) {

    var pageNumber = Math.ceil(totalStreams / 10);
    document.getElementById("list").innerHTML = "";
    document.getElementById("list").innerHTML += '<div class="content"><div id ="totalResults"><p>Total results: '
                                                  +totalStreams + '</p></div><div id="pagination"><button id="leftButton" class="page"><</button><p id="pageNumber" class="page">'
                                                  +page + '/' + pageNumber + '</p><button id="rightButton" class="page">></button></div></div>';



    if (pageNumber === 0 || page === 1) {
        document.getElementById("leftButton").disabled = true;
    }
    if (page === pageNumber) {
        document.getElementById("rightButton").disabled = true;
    }

    for (var i = 0; i < streamArray.length; i++) {
        var list = document.createElement('div');
        document.getElementById("list").innerHTML += '<div class="streamContent"><img src=" '
                                                      +streamArray[i].preview + '"><div id="streamDetails"><h4>Name: &nbsp;</h4>'
                                                      + streamArray[i].displayName +'</br><h4>Game: &nbsp;</h4>' + streamArray[i].game + ' - <h4>'
                                                      + streamArray[i].views +'</h4> viewers. </br>This stream has '
                                                      + streamArray[i].followers +' followers and '+ streamArray[i].viewers +' viewers.</div></div>';
    }
    document.getElementById("list").style.border = "5px outset";

};


document.getElementById("searchButton").onclick = function() {
    queryString = document.getElementById("searchInput").value;
    if (queryString.length > 0) {
        offset = 0;
        page = 1;
        callApi();
    } else {
        alert("Invalid value");
    }

};
document.addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {
        document.getElementById("searchButton").click();
    }

});

document.addEventListener('click', function(e) {


    if (e.target.getAttribute("id") === "rightButton") {
        page += 1;
        offset += 10;
        callApi();
    } else if (e.target.getAttribute("id") === "leftButton") {
        page -= 1;
        offset -= 10;
        callApi();
    }


});
