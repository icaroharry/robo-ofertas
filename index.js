const tweet = require('./twitter/tweet');
const lomadee = require('./lomadee');
const twitter = require('./twitter').loginTwitter();
const co = require('co');

let usedOffers = {};

let count = 0;

let categories = [77, 6424, 2852, 3671, 6058, 3661];

const postTweet = co.wrap(function *(msg, image) {
  let img = yield twitter.post('media/upload', {media: image});
  let result = yield twitter.post('statuses/update', {status: msg, media_ids: img.media_id_string});
  return result;
});

(function execute(){
  co(function *() {
    try {
      let random = categories[Math.floor(Math.random() * categories.length)];
      let randomPage = categories[Math.floor(Math.random() * 15)];
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
      execute();
    }
    setTimeout(execute, 60000 * 45);
  });
})();
