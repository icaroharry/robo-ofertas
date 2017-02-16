'use strict';


const googl = require('goo.gl');
const base64 = require('node-base64-image');
const emoji = require('node-emoji');
const co = require('co');

googl.setKey('AIzaSyB820n6JnhRVAVAt3UliN9W3Z7oXcj4kY4');

const buildTweetMessage = co.wrap(function *(offer) {
  let sentence = randomizeMsg();
  let smallName = offer.offerName.split(' ', 5).join(' ');

  let link = yield googl.shorten(offer.links.link[0].url);
  let tweet = `${emoji.get('moneybag')} ${sentence}! ${emoji.get('blush')} \n\n${link} ${emoji.get('arrow_left')} LINK \n\n${smallName} ${randomizePriceMsg(offer.discountPercent, offer.priceValue)} \n${buildHashtags(offer.categoryId)}`;
  console.log(tweet);
  return tweet;
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
  if(splitPrice[1].length && splitPrice[1].length === 1) {
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
    case 77: result = '#oferta';
      break;

    case 6424: result = '#notebook #laptop';
      break;

    case 2852: result = '#smarttv #tv #desconto';
      break;

    case 3671: result = '#maquinadelavar #oferta';
      break;

    case 6058: result = '#gamer #jogos #game';
      break;

    case 3661: result = '#arcondicionado';
      break;
  }
  return result;
}

const randomOffer = (offers) => {
  return Math.floor(Math.random() * offers.length);
}

module.exports = {
  buildTweetMessage,
  encode,
  getImage,
  randomizeMsg,
  randomizePriceMsg,
  buildHashtags,
  randomOffer
};
