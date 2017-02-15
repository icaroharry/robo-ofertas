'use strict';

const config = require('./../config');
const prompt = require('prompt');
const webkitOpener = require('webkit-opener');
const TwitterPinAuth = require('twitter-pin-auth');
const Twitter = require('twitter');
const fs = require('fs');

const twitterPinAuth = new TwitterPinAuth(config.consumerKey, config.consumerSecret);

exports.getAuth = function(callback) {
  console.log('Para prosseguir você deve fazer login no twitter.');
  console.log('Uma nova tab será aberta no seu navegador padrão...');

  twitterPinAuth.requestAuthUrl()
    .then(function(url) {
      webkitOpener(url);
    }).catch(function(err) {
      console.error(err);
    });

  prompt.start();

  console.log('Insira o PIN recebido no site do Twitter');
  console.log('Não se preocupe, só iremos postar uma mensagem \npara a sua operadora de internet...');
  prompt.get(['pin'], function(err, result) {
    twitterPinAuth.authorize(result.pin)
      .then(function(authData) {
        config.accessTokenKey = authData.accessTokenKey;
        config.accessTokenSecret = authData.accessTokenSecret;
        fs.writeFileSync('config.json', JSON.stringify(config));
        callback(authData);
      }).catch(function(err) {
        console.error(err);
      });
  });
};
