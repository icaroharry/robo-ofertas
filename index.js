const twitter = require('./twitter').loginTwitter();
const lomadee = require('./lomadee');
const co = require('co');

const getOffers = co.wrap(function *() {
  let offers = yield lomadee.topOffers();
  offers = offers.offer;
  console.log(buildTweetMessage(offers[0]));
});

const buildTweetMessage = co.wrap(function *(offer) {
  let smallName = offer.offerName.split(',')[0];
  let discount = offer.discountPercent;
  let link = offer.links.link[0].url;
  let tweet = `${smallName} com ${discount}% de desconto! ${link} #oferta #desconto #smartphone`;
  return tweet;
});

(function execute(){
  getOffers();
  console.log('test');
  setTimeout(execute, 60000 * 5);
})();
