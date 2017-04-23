
/*
 * Model representing a user.
 */

var mongoose = require('mongoose');
var Ranking = require('../models/Ranking');
var List = require('../models/List');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        index: {unique: true}
    },

    password: String,

    rankings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ranking'
    }],

    lists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
    }],

    last_viewed_invitations_date: {type: Date, default: Date.now}

});

userSchema.index({username: 'text'});

/**
 * hashes a password
 * @param password {string} - password
 * @returns the hashed password
 */
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * Validate a hashed password
 * @param password {string} - password
 * @returns {*}
 */
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


var userModel = mongoose.model('Users', userSchema);

/**
 * An object that encapsulates functions that work with the User database
 */
var Users = (function(userModel) {

    var that = {};

    /**
     *  Returns an array of rankings submitted by user with username
     * @param username {String} - the username to query
     * @param callback
     */
    that.getAllRankings = function (username, callback) {
        userModel.findOne({ username: username }, function(err, user) {
            if (err) callback({ msg: err });
            if (user != null) {
                var rankings = user.rankings.slice();
                callback(null, rankings);
            } else {
                callback({ msg: 'The user does not exist!'});
            }
        });
    };

    /**
     * Returns an array of lists created by user with username
     * @param username {String} - the username to query
     * @param callback
     */
    that.getAllLists = function (username, callback) {
        userModel.findOne({ username: username }, function(err, user) {
            if (err) callback({ msg: err });
            if (user != null) {
                var lists = user.lists.slice();
                callback(null, lists);
            } else {
                callback({ msg: 'The user does not exist!'});
            }
        });
    };

    /**
     *  If the username is valid, returns the user object.
     *  Otherwise, returns an error message
     * @param username {String} - the username to query
     * @param callback
     */
    that.findUser = function(username, callback) {
        userModel.findOne({ username: username }, function(err, result) {
            if (err) callback({ msg: err });
            if (result !== null) {
                callback(null, result);
            } else {
                callback({ msg: 'This user does not exist!' });
            }
        });
    };

    /**
     *  If the id is valid, returns the user object.
     *  Otherwise, returns an error message
     * @param id {ObjectId} - ObjectId to query
     * @param callback
     */
    that.findById = function(user_id, callback) {
        userModel.findById(user_id, function(err, result) {
            if (err) callback({ msg: err });
            if (result !== null) {
                callback(null, result);
            } else {
                callback({ msg: 'This user does not exist!' });
            }
        });
    };

    /**
     *  Find users given a search string. If no users are found an empty array is returned
     * @param searchString {String} - the search string to query
     * @param callback
     */
    that.search = function(searchString, callback) {
        userModel.find({ "username": { "$regex": new RegExp(searchString, "i")} }).exec(function(err, result) {
            if (err) {
              callback({ msg: err });
            }
            if (result !== null) {
                callback(null, result);
            } else {
                callback(null, []);
            }
        });
    };


    /**
     * If the user exists and the password matches the user's real password return true.
     * Otherwise, return false (to the callback).
     * @param username {String} - the username
     * @param password {String} - the password to check
     * @param callback
     */
    that.checkPassword = function(username, password, callback) {
        userModel.findOne({ username: username }, function(err, user) {
            if (err) callback({ msg: err });
            if (user !== null && user.validPassword(password)) {
                callback(null, user);
            } else {
                callback(null, false);
            }
        });
    };

    /**
     * Mutates the list property of the user with user_id
     * @param user_id {String} - the user to query
     * @param list {O bject} - the list object whose _id will be added to the user's list property
     * @param callback
     */
    that.hasCreatedList = function(user_id, list, callback) {
      userModel.findOneAndUpdate({_id:user_id}, {$push: {lists:list._id}}, {new : true}).exec(function(error, user) {
        if (error) callback({msg:error});
        if (user !== null) {
          callback(null, user);
        } else {
          callback(null, false);
        }
      });
    };

    /**
     * Mutates the rankings property of the user with user_id
     * @param user_id {String} - the user to query
     * @param ranking {Object} - the list object whose _id will be added to the user's ranking property
     * @param callback
     */
    that.hasSubmittedRanking = function(user_id, ranking, callback) {
      userModel.findOneAndUpdate({_id:user_id}, {$push: {rankings:ranking._id}}, {new : true}).exec(function(error, user) {
        if (error) callback({msg:error});
        if (user !== null) {
          callback(null, user);
        } else {

          callback(null, false);
        }
      });
    };


    /**
     * Mutates the last_viewed_invitations_date property of the user with user_id so the ProfilePage
     * provide correct notifications about the user's private list invites
     * @param user_id {String} - the user to query
     * @param callback
     */
    that.updateLastViewedInvitationsDate = function(user_id, callback) {
      userModel.findOneAndUpdate({_id:user_id}, {last_viewed_invitations_date:Date.now()}, {new : true}, function(error ,user) {
        if (error) callback({msg:error});
        if (user !== null) {
          callback(null, user);
        } else {

          callback(null, false);
        }
      });

    };


    /**
     * Checks that the passed username has not been used before, and is not larger than 15 characters long.
     * If either of those conditions are not met, return with the error
     * @param username {String} - the username
     * @param password {String} - the password to check
     * @param callback
     */
    that.createUser = function(username, password, callback) {
        userModel.findOne({ username: username}, function(err, result) {
            if (result !== null) {
                callback({ taken: true});
            } else if (username.length > 15 || username.length < 3) {
                callback({ msg: 'Usernames should be at most 15 characters and at least 3!' });
            } else if (password.length < 5) {
                callback({ msg: 'Please select a longer password!' });
            } else if (username.indexOf(' ') >= 0) {
              callback({ msg: 'Usernames should not contain spaces!'});
            } else {
                var user = new userModel();
                user.username = username;
                user.password = user.generateHash(password);

                user.save(function(err, user) {
                    if (err) callback({ msg: err });
                    callback(null, user);
                });
            }
        });
    };

    Object.freeze(that);
    return that;

})(userModel);

module.exports = {
    Users: Users,
    userModel: userModel
};
