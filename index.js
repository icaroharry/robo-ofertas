const twitter = require('./twitter').loginTwitter();
const lomadee = require('./lomadee');
const co = require('co');
const googl = require('goo.gl');
const base64 = require('node-base64-image');

googl.setKey('AIzaSyB820n6JnhRVAVAt3UliN9W3Z7oXcj4kY4');

const getOffers = co.wrap(function *() {
  let offers = yield lomadee.topOffers();
  offers = offers.offer;
  return offers;
});

const buildTweetMessage = co.wrap(function *(offer) {
  console.log(offer);
  let smallName = offer.offerName.split(' ', 3).join(' ');
  let link = yield googl.shorten(offer.links.link[0].url);
  let tweet = `${smallName} na promoção! ${link} #oferta #desconto #game #games #jogos #ps4 #xbox`;
  return tweet;
});

const tweet = co.wrap(function *(msg, image) {
  console.log(msg, image);
  let img = yield twitter.post('media/upload', {media: image});
  let result = yield twitter.post('statuses/update', {status: msg, media_ids: img.media_id_string});
  return result;
});

const encode = (url) => {
  return new Promise(function(resolve, reject) {
    base64.encode(url, {}, resolve);
  });
};

const getImage = (url, fn) => {
  base64.encode(url, {}, (err, result) => {
    fn(result);
  });
}

// let offers = lomadee.topOffers();
// offers = offers.offer;
let count = 0;


(function execute(){
  co(function *() {
    offers = yield getOffers();
    console.log(offers);
    if(count > 29) {
      count = 0;
    }
    getImage(offers[count].thumbnail.url, function (img) {
      try {
        buildTweetMessage(offers[count]).then((msg) => {
          let result = tweet(msg, img);
          count++;
        });
      } catch(err) {
        console.log(err);
      }
    });
    setTimeout(execute, 60000 * 60 * 5);
  });
})();
