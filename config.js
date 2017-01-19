'use strict'

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));

module.exports = config;
