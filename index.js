require('newrelic');

const twitter = require('./twitter').loginTwitter();
const lomadee = require('./lomadee');
const co = require('co');
const googl = require('goo.gl');
const base64 = require('node-base64-image');
const emoji = require('node-emoji');
const http = require('http');

http.createServer(function (request, response) {}).listen(process.env.PORT || 5000);

googl.setKey('AIzaSyB820n6JnhRVAVAt3UliN9W3Z7oXcj4kY4');

let usedOffers = {};

const getOffers = co.wrap(function *() {
  let offers = yield lomadee.topOffers();
  offers = offers.offer;
  return offers;
});

function randomizeMsg() {
  let sentences = [];
  sentences.push('Não perca tempo');
  sentences.push('Aproveite');
  sentences.push('Alerta');
  sentences.push('Promoção na área');
  sentences.push('Olha a oferta');
  sentences.push('Quebra o porquinho');
  sentences.push('Ótima oportunidade');

  return sentences[Math.floor(Math.random() * sentences.length)];
};

function randomizePriceMsg(discount, price) {
  let sentences = [];
  let result;
  let splitPrice = price.toString().split('.');
  if(splitPrice[1].length === 1) {
    splitPrice[1] += '0';
  }

  let correctPrice = splitPrice.join(',');

  sentences.push(`com até ${discount}% de desconto!`);
  sentences.push(`por apenas R$${correctPrice}`);

  if(!discount) {
    result = sentences[1]
  } else if(!price) {
    result = sentences[0];
  } else {
    result = sentences[Math.floor(Math.random() * sentences.length)];
  }

  return result
}

function buildHashtags(category) {
  let result;
  switch (category) {
    case 77: result = '#smartphone #oferta #desconto';
      break;

    case 6424: result = '#notebook #oferta #desconto';
      break;

    case 2852: result = '#smarttv #tv #desconto';
      break;

    case 3671: result = '#maquinadelavar #oferta';
      break;

    case 2376: result = '#gamer #games #console';
      break;

    case 6058: result = '#gamer #jogos #game';
      break;

    case 3661: result = '#arcondicionado #oferta #desconto';
      break;
  }
  return result;
}

const buildTweetMessage = co.wrap(function *(offer) {
  console.log(offer);
  let sentence = randomizeMsg();
  let smallName = offer.offerName.split(' ', 5).join(' ');

  let link = yield googl.shorten(offer.links.link[0].url);
  let tweet = `${emoji.get('moneybag')} ${sentence}! ${emoji.get('blush')} \n\n${link} \n\n${smallName} ${randomizePriceMsg(offer.discountPercent, offer.priceValue)} \n${buildHashtags(offer.categoryId)}`;
  console.log(tweet);
  return tweet;
});

const tweet = co.wrap(function *(msg, image) {
  console.log(msg);
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
};

const randomOffer = (offers) => {
  return Math.floor(Math.random() * offers.length);
}

let count = 0;

let categories = [77, 6424, 2852, 3671, 2376, 6058, 3661];

(function execute(){
  co(function *() {
    let offers = yield lomadee.topOffers(categories[Math.floor(Math.random() * categories.length)]);
    offers = offers.offer;
    let offersIndex = randomOffer(offers);
    while(usedOffers[offers[offersIndex]]) {
      offersIndex = randomOffer(offers);
    }
    getImage(offers[0].thumbnail.url, function (img) {
      try {
        buildTweetMessage(offers[0]).then((msg) => {
          //let result = tweet(msg, img);
          count++;
          usedOffers[offers[offersIndex].id] = true;
        });
      } catch(err) {
        console.log(err);
      }
    });
    setTimeout(execute, 60000 * 30);
  });
})();
