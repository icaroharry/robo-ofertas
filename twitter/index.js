'use strict';

const Twitter = require('twitter');
const config = require('./../config');
const twitterPin = require('./auth');

module.exports = {
  loginTwitter: () => {
    var client = {};
    if(config.accessTokenKey && config.accessTokenSecret) {
      client = new Twitter({
        consumer_key: config.consumerKey,
        consumer_secret: config.consumerSecret,
        access_token_key: config.accessTokenKey,
        access_token_secret: config.accessTokenSecret
      });
      return client;
    } else {
      twitterPin.getAuth(function(authData) {
        client = new Twitter({
          consumer_key: config.consumerKey,
          consumer_secret: config.consumerSecret,
          access_token_key: authData.accessTokenKey,
          access_token_secret: authData.accessTokenSecret
        });
        callback(client);
      });
    }
    return client;
  }
};
