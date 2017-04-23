const uuid = require('uuid');

/*
 * Model representing an Comment.
 * @constructor
 * @param {string} text - The text of the comment
 * @param {string} username - The username of the user making the comment
 */
var Comment = function(text, username) {
   var that = Object.create(Comment.prototype);
   that.id = uuid.v1();
   that.text = text;
   that.username = username;
   Object.freeze(that);
   return that;
};

module.exports = Comment;
