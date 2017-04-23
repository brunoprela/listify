const uuid = require('uuid');

/*
 * Model representing an Item.
 * @constructor
 * @param {string} title - The title of the item.
 * @param {string} description - A description of the item
 * @param {string} photo - An option photo
 */
var Items = function(title, description, photo) {
   var that = Object.create(Items.prototype);
   that.id = uuid.v1();
   that.title = title;
   that.description = description;
   that.photo = photo;
   Object.freeze(that);
   return that;
};

Items.prototype.equal = function (item2) {
     return this.id == item2.id && this.title == item2.title;
};

module.exports = Items;
