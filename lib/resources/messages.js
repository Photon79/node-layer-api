'use strict';
/**
 * Messages resource
 * @module resources/messages
 */

var querystring = require('querystring');
var axios = require('axios');
var utils = require('../utils');

function markMessage(messageId, type, session_token, version) {
  version = version || '1.0';

  var headers = {
    'Accept': 'application/vnd.layer+json; version=' + version,
    'Authorization': 'Layer session-token="' + session_token + '"',
    'Content-Type': 'application/json'
  };

  return axios({
    baseURL: 'https://api.layer.com',
    data: {
      type: type
    },
    headers: headers,
    method: 'post',
    url: '/messages/' + messageId + '/receipts',
  });
}

module.exports = function(request) {
  var utilsResource = require('./utils')(request);

  return {

    /**
     * Send a message
     *
     * @param  {String}   conversationId  Conversation ID
     * @param  {Object}   body            Message body
     * @param  {Function} callback        Callback function
     */
    send: send.bind(null, null),

    /**
     * Send a message with de-duplicating UUID
     *
     * @param  {String}   dedupe          UUID
     * @param  {String}   conversationId  Conversation ID
     * @param  {Object}   body            Message body
     * @param  {Function} callback        Callback function
     */
    sendDedupe: send,

    /**
     * Send a plain text message from `userId`
     *
     * @param  {String}   conversationId Conversation ID
     * @param  {String}   userId         User ID
     * @param  {String}   text           Message text
     * @param  {Function} callback       Callback function
     */
    sendTextFromUser: function(conversationId, userId, text, callback) {
      send(null, conversationId, utils.messageText('user_id', userId, text), callback);
    },

    /**
     * Send a plain text message from `name`
     *
     * @param  {String}   conversationId Conversation ID
     * @param  {String}   name           Sender name
     * @param  {String}   text           Message text
     * @param  {Function} callback       Callback function
     */
    sendTextFromName: function(conversationId, name, text, callback) {
      send(null, conversationId, utils.messageText('name', name, text), callback);
    },

    /**
     * Retrieve messages in a conversation
     *
     * @param  {String}   conversationId  Conversation ID
     * @param  {String}   [params]        Query parameters
     * @param  {Function} callback        Callback function
     */
    getAll: function(conversationId, params, callback) {
      conversationId = utils.toUUID(conversationId);
      if (!conversationId) { return callback(new Error(utils.i18n.messages.cid)); }
      utils.debug('Message getAll: ' + conversationId);
      var queryParams = '';

      if (typeof params === 'function') {
        callback = params;
      }
      else {
        queryParams = '?' + querystring.stringify(params);
      }

      request.get({
        path: '/conversations/' + conversationId + '/messages' + queryParams
      }, callback);
    },

    /**
     * Retrieve messages in a conversation from a user
     *
     * @param  {String}   userId          User ID
     * @param  {String}   conversationId  Conversation ID
     * @param  {String}   [params]        Query parameters
     * @param  {Function} callback        Callback function
     */
    getAllFromUser: function(userId, conversationId, params, callback) {
      if (!userId) { return callback(new Error(utils.i18n.messages.userId)); }
      conversationId = utils.toUUID(conversationId);
      if (!conversationId) { return callback(new Error(utils.i18n.messages.cid)); }
      utils.debug('Message getAllFromUser: ' + userId + ', ' + conversationId);
      var queryParams = '';

      if (typeof params === 'function') {
        callback = params;
      }
      else {
        queryParams = '?' + querystring.stringify(params);
      }

      request.get({
        path: '/users/' + querystring.escape(userId) + '/conversations/' + conversationId + '/messages' + queryParams
      }, callback);
    },

    /**
     * Retrieve a message in a conversation from a user
     *
     * @param  {String}   userId          User ID
     * @param  {String}   messageId       Message ID
     * @param  {Function} callback        Callback function
     */
    getFromUser: function(userId, messageId, callback) {
      if (!userId) { return callback(new Error(utils.i18n.messages.userId)); }
      messageId = utils.toUUID(messageId);
      if (!messageId) { return callback(new Error(utils.i18n.messages.mid)); }
      utils.debug('Message getFromUser: ' + userId + ', ' + messageId);

      request.get({
        path: '/users/' + querystring.escape(userId) + '/messages/' + messageId
      }, callback);
    },

    setRead: function(messageId, callback) {
      if (!messageId) return callback(new Error("Message ID isn't defined"));
      if (!request.session_token) return callback(new Error("Session Token isn't defined"));
      if (request.session_token && request.token_expire < new Date()) return callback(new Error("Session Token is expired"));

      utils.debug('Mark message ' + messageId + ' as read');
      messageId = utils.toUUID(messageId);

      markMessage(messageId, 'read', request.session_token)
        .then(function(result) { return callback(null, result); })
        .catch(function(err) { return callback(err); });
    },

    setDelivered: function(messageId, callback) {
      if (!messageId) return callback(new Error("Message ID isn't defined"));
      if (!request.session_token) return callback(new Error("Session Token isn't defined"));
      if (request.session_token && request.token_expire < new Date()) return callback(new Error("Session Token is expired"));

      utils.debug('Mark message ' + messageId + ' as delivered');
      messageId = utils.toUUID(messageId);

      markMessage(messageId, 'delivery', request.session_token)
        .then(function(result) { return callback(null, result); })
        .catch(function(err) { return callback(err); });
    },
  };

  function send(dedupe, conversationId, body, callback) {
    if (dedupe !== null && !utils.toUUID(dedupe)) { return callback(new Error(utils.i18n.dedupe)); }
    conversationId = utils.toUUID(conversationId);
    if (!conversationId) { return callback(new Error(utils.i18n.messages.cid)); }
    if (!body || typeof body !== 'object') { return callback(new Error(utils.i18n.messages.body)); }
    utils.debug('Message send: ' + conversationId);

    request.post({
      path: '/conversations/' + conversationId + '/messages',
      body: body,
      dedupe: dedupe
    }, callback || utils.nop);
  }
};
