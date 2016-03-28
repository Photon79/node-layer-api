var utils = require('../utils');

module.exports = function(request) {
  return {
    /**
     * @description Get badges (unread count) for user
     * @param  {Int}        userId  UserId for get badges
     * @param  {Function}   callback  Callback function for request
     * @return {None}
     */
    getUnreadData: function(userId, callback) {
      if (!userId) return callback(new Error("User ID isn't defined"));
      utils.debug('Get unread information for user ' + userId);

      request.get({
        path: '/users/' + userId + '/badge'
      }, callback);
    },
  }
};
