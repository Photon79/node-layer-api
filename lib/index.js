'use strict';

var Promise = require('bluebird');

var pkg = require('../package.json');
var utils = require('./utils');

var Request = require('./request');

var RESOURCES = [
  'conversations',
  'messages',
  'announcements',
  'blocklist',
  'identities',
  'utils',
];

/**
 * Layer API constructor
 *
 * @class
 * @param  {Object} config Configuration values
 * @param  {String} config.token Layer Platform API token
 * @param  {String} config.appId Layer Application ID
 * @param  {String} config.keyId Layer Key ID (for use Client API)
 * @param  {String} config.providerId Layer Provider ID (for use Client API)
 * @param  {String} [config.version] Platform API version
 * @param  {Number} [config.timeout] Request timeout in ms
 */
module.exports = function(config) {
  config = config || {};
  if (!config.token) throw new Error(utils.i18n.layerapi.token);
  config.appId = utils.toUUID(config.appId);
  if (!config.appId) throw new Error(utils.i18n.layerapi.appId);

  var request = new Request(config);

  RESOURCES.forEach(function(type) {
    this[type] = Promise.promisifyAll(require('./resources/' + type)(request));
  }, this);

  process.env.LAYER_API_DEBUG = config.debug || false;
  utils.debug('Initialized v' + pkg.version + ' with appId: ' + config.appId);
};
