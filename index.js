'use strict';

const tweet = require('./twitter/tweet');
const lomadee = require('./lomadee');
const twitter = require('./twitter').loginTwitter();
const co = require('co');
const http = require('http');

http.createServer(function (request, response) {}).listen(process.env.PORT || 5000);

let usedOffers = {};

let count = 0;

let categories = [77];

const postTweet = co.wrap(function *(msg, image) {
  let img = yield twitter.post('media/upload', {media: image});
  let result = yield twitter.post('statuses/update', {status: msg, media_ids: img.media_id_string});
  return result;
});

(function execute(){
  co(function *() {
    try {
      let random = categories[0];
      let randomPage = categories[Math.floor(Math.random() * 100)];
      let offers = yield lomadee.topOffers(random, randomPage);
      offers = offers.offer;
      let offersIndex = tweet.randomOffer(offers);
      while(usedOffers[offers[offersIndex]]) {
        offersIndex = tweet.randomOffer(offers);
      }
      tweet.getImage(offers[offersIndex].thumbnail.url, function (img) {

        tweet.buildTweetMessage(offers[offersIndex]).then((msg) => {
          try { let result = postTweet(msg, img); } catch(err) {console.log(err)};
          count++;
          usedOffers[offers[offersIndex].id] = true;
        });
      });
    } catch(err) {
      console.log(err);
    }
    setTimeout(execute, 60000 * 45);
  });
})();
