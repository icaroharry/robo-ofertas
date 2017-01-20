const request = require('request-promise');
const co = require('co');
const config = require('./../config');

const API_ADDRESS = 'http://sandbox.buscape.com.br/service/v2'

function buildRequest(endpoint) {
  return `${API_ADDRESS}/${endpoint}/lomadee/${config.appToken}/BR/?sourceId=${config.sourceId}&format=json&categoryId=77&page=1&program=lomadee`;
}

const topOffers = co.wrap(function *() {
  console.log(buildRequest('topOffers'));
  let options = {
    uri: buildRequest('topOffers'),
    json: true
  };
  let result = yield request(options);
  return result;
});

module.exports = {
  topOffers
};
