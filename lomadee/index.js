'use strict';

const request = require('request-promise');
const co = require('co');
const config = require('./../config');

const API_ADDRESS = 'http://bws.buscape.com.br/service/v2';

function buildRequest(endpoint, categoryId, page) {
  return `${API_ADDRESS}/${endpoint}/lomadee/${config.appToken}/BR/?sourceId=${config.sourceId}&format=json&categoryId=${categoryId}&page=${page}`;
}

const topOffers = co.wrap(function *(categoryId, page) {
  let options = {
    uri: buildRequest('topOffers', categoryId, page),
    json: true
  };
  let result = yield request(options);
  return result;
});

const mockOffers = () => {
  let fs = require('fs');
  let result = JSON.parse(fs.readFileSync('offers.json'));
  return result;
}

module.exports = {
  topOffers,
  mockOffers
};
