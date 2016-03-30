var axios = require('axios');
var utils = require('../utils');
var jsrsasign = require('jsrsasign');

module.exports = (request) => {
  return {
    /**
     * @description Get badges (unread count) for user
     * @param  {Int}        userId  UserId for get badges
     * @param  {Function}   callback  Callback function for request
     * @return {None}
     */
    getUnreadData: (userId, callback)=> {
      if (!userId) return callback(new Error("User ID isn't defined"));
      utils.debug('Get unread information for user ' + userId);

      request.get({
        path: '/users/' + userId + '/badge'
      }, callback);
    },

    getSessionToken: (userId, callback)=> {
      if (request.session_token && new Date() < request.token_expire) {
        return callback(null, request.session_token);
      }

      const headers = {
        'Accept': 'application/vnd.layer+json; version=' + request.version,
        'Content-Type': 'application/json'
      };

      axios({
        baseURL: 'https://api.layer.com',
        headers: headers,
        method: 'post',
        url: '/nonces',
      })
        .then(result => result.data.nonce)
        .then(nonce => {
          const header = JSON.stringify({
            alg: 'RS256',
            cty: 'layer-eit;v=1',
            kid: request.keyId,
            typ: 'JWT',
          });

          const currentTimeInSeconds = Math.round(new Date() / 1000);
          const expirationTime = currentTimeInSeconds + 10000;

          const claim = JSON.stringify({
            exp: expirationTime,
            iat: currentTimeInSeconds,
            iss: request.providerId,
            nce: nonce,
            prn: userId,
          });

          return {
            identity_token: jsrsasign.jws.JWS.sign('RS256', header, claim, request.privateKey),
            expires: new Date(expirationTime * 1000),
          };
        })
        .then(result => {
          return axios({
            baseURL: 'https://api.layer.com',
            data: {
              app_id: request.appId,
              identity_token: result.identity_token,
            },
            headers: headers,
            method: 'post',
            url: '/sessions',
          })
          .then(res => {
            request.session_token = res.data.session_token;
            request.token_expire = result.expires;
            callback(null, res.data.session_token);
          });
        })
        .catch(err => callback(err));
    }
  }
};
