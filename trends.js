var twitter = require('twitter');
var config = require('./config');
var geocoderProvider = 'google';
var httpAdapter = 'http';
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter);

var twitterClient = new twitter({
    consumer_key: config.twitterKeys.consumer_key,
    consumer_secret: config.twitterKeys.consumer_secret,
    access_token_key: config.twitterKeys.access_token_key,
    access_token_secret: config.twitterKeys.access_token_secret
});

exports.trendGetter = function(callback) {
twitterClient.get('trends/available', function(error, tweets, response) {
    if (error) throw error;
    var lenOfMessage=2
    var min = Math.min(lenOfMessage, tweets.length);
    trendAvailableList = []
    for (var i = 0; i < 2; i++) {
    	var j = Math.floor(Math.random() * tweets.length);
        obj = {}
        obj.place = tweets[j].name;
        obj.country = tweets[j].country;
        obj.countryCode = tweets[j].countryCode;
        obj.woeid = tweets[j].woeid;
        trendAvailableList.push(obj);
    }
    var counter = 0;
    trendAvailableList.forEach(function(eachLoc) {
        var addr = '';
        addr = addr + eachLoc.place + eachLoc.country;
        geocoder.geocode(addr)
            .then(function(res) {
                eachLoc.lat = res[0].latitude;
                eachLoc.lng = res[0].longitude;
                eachLoc.trendsList = []
                twitterClient.get('trends/place', {
                    id: eachLoc.woeid
                }, function(error, message, response) {
                    if (error) console.log(error);
                    counter++;
                    message[0]['trends'].forEach(function(eachTrend) {
                        eachLoc.trendsList.push(eachTrend.name);
                    });
                    if (counter == lenOfMessage) {
                        console.log(trendAvailableList);
                        callback(trendAvailableList)
                    }
                });

            })
            .catch(function(err) {
                console.log('Error in geo locations');
            });
    });
});
}
