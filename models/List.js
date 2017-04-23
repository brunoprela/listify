/**
 * Created by spencerkim on 11/18/16.
 */

/*
 * Model representing a Consensus ranking.
 * key: value pairs are key = title of the consensus and value =
 * the object representing the consensus.
 */

var mongoose = require('mongoose');
var Ranking = require('../models/Ranking');
var Items = require('../models/Items');
var ObjectId = require('mongoose').Types.ObjectId;

var listSchema = mongoose.Schema({

    title: String,

    creator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    upvoters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    downvoters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    upvotes: Number,

    creator: String,

    description: String,

    items : [],

    rankings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ranking'
    }],

    isPublic: Boolean,

    locked: Boolean,

    maxLength: Number,

    usersSharedWith: [String]

}, { timestamps: true });

var listModel = mongoose.model('List', listSchema);

/**
 * An object that encapsulates functions that work with the User database
 */
var list = (function(listModel) {

    var that = {};

    /**
     * Gets all the rankings that point to a list
     * @param listId {string} - the list object id
     * @param callback
     */
    that.getRankings = function (listId, callback) {
        listModel.findById(listId, function (err, list) {
            if (err) callback({ msg: err });
            if (list != null) {
                callback(null, list.rankings);
            } else {
                callback({ msg: 'The list does not exist!'});
            }
        });
    };

    /**
     * Upvote a list
     * @param listId {string} - the list object id
     * @param userId {string} - the user object id
     * @param callback
     */
    that.upvote = function(listId,userId, callback) {
      listModel.findById(listId, function(err, list){
          if(err) callback({msg:err});
          if(list != null) {
            var downvoters = list.downvoters ? list.downvoters : [];
            var downvoteIndex = downvoters.indexOf(userId);

            if (downvoteIndex > -1) {
              downvoters.splice(downvoteIndex,1);
            }

            var upvoters = list.upvoters ? list.upvoters : [];
            var upvoteIndex = upvoters.indexOf(userId);
            if (upvoteIndex === -1) {
              upvoters.push(userId);
            }

            var upvotes = upvoters.length - downvoters.length;

            listModel.update({_id:list._id},
                            {upvoters:upvoters,downvoters:downvoters, upvotes:upvotes},
                            {upsert:true, new:true},
                            function(error, newList) {
                              if (!error) {
                                callback(null, newList);
                              } else {
                                calback(error,null);
                              }
                            }
                          );
          } else{
              callback({msg: 'The list does not exist!'});
          }
      });
    };

    /**
     * Downvote a list
     * @param listId {string} - the list object id
     * @param userId {string} - the user object id
     * @param callback
     */
    that.downvote = function(listId,userId, callback) {
      listModel.findById(listId, function(err, list){
          if(err) callback({msg:err});
          if(list != null) {
            var downvoters = list.downvoters ? list.downvoters : [];
            var downvoteIndex = downvoters.indexOf(userId);

            if (downvoteIndex === -1) {
              downvoters.push(userId);
            }

            var upvoters = list.upvoters ? list.upvoters : [];
            var upvoteIndex = upvoters.indexOf(userId);
            if (upvoteIndex > -1) {
              upvoters.splice(upvoteIndex,1);
            }

            var upvotes = upvoters.length - downvoters.length;

            listModel.update({_id:list._id},
                            {upvoters:upvoters,downvoters:downvoters, upvotes:upvotes},
                            {upsert:true, new:true},
                            function(error, newList) {
                              if (!error) {
                                callback(null, newList);
                              } else {
                                calback(error,null);
                              }
                            }
                          );
          } else{
              callback({msg: 'The list does not exist!'});
          }
      });
    };

    /**
     * Create a list
     * @param listObject {List} - a list
     * @param callback
     */
    that.createList = function (listObject, callback) {
        var newList = new listModel({
            title : listObject.title,
            creator : listObject.creator,
            creator_id : listObject.creator_id,
            items : listObject.items,
            rankings : listObject.rankings,
            isPublic : listObject.isPublic,
            upvotes : listObject.upvotes,
            locked : listObject.locked,
            maxLength : listObject.maxLength,
            description : listObject.description,
            usersSharedWith : listObject.usersSharedWith
        });

        newList.save(function(err, list) {
            if (err) callback({ msg: err}, null);
            else {
                callback(null, list);
            }
        });
    };

    /**
     * Locks a consensus to make sure that no more rankings can be submitted
     * @param listId {string} - the list object id
     * @param callback
     */
    that.lockList = function (listId, callback) {
        listModel.findById(listId, function (err, list) {
            if (err) callback({ msg: err });
            if (list != null) {
                list.locked = true;
                list.save(function(err) {
                    if (err) callback({ msg: err});
                    callback(null);
                });


            } else {
                callback({ msg: 'The list does not exist!'});
            }
        });
    };

    /**
     * Gets an array of all public lists in the database
     * @param callback
     */
    that.getPublicLists = function(callback) {
        listModel.find({}).find({ isPublic: true }).sort({createdAt: -1}).exec(function(err, result) {
            if (err) callback({ msg: err });
            if (result.length > 0) {
                callback(null, result);
            } else {
                callback({ msg: 'No public lists!'})
            }
        });
    };

    /**
     * Gets an array of all public lists ordered by number of upvotes
     * @param callback
     */
    that.getTrendingLists = function(callback) {
      listModel.find({}).find({ isPublic: true }).sort({upvotes: -1}).limit(25).exec(function(err, result) {
          if (err) callback({ msg: err });
          if (result.length > 0) {
              callback(null, result);
          } else {
              callback({ msg: 'No public lists!'})
          }
      });
    };

    /**
     * Get the private lists for a user
     * @param username {string} - the username
     * @param callback
     */
    that.getUserPrivateLists = function(username, callback) {
        listModel.find({ creator:username, isPublic: true }).exec(function(err, result) {
            if (err) callback({ msg: err });
            if (result.length > 0) {
                callback(null, result);
            } else {
                callback({ msg: 'No private consensuses for this user!'})
            }
        });
    };

    /**
     * Gets the lists for a user
     * @param user_id {string} - the user object id
     * @param callback
     */
    that.getUserLists = function(user_id, callback) {
        listModel.find({ creator_id:new ObjectId(user_id)}).exec(function(err, result) {
            if (err) callback({ msg: err });
            if (result.length > 0) {
                callback(null, result);
            } else {
                callback({ msg: 'No private consensuses for this user!'})
            }
        });
    };

    /**
     * Gets the private lists a user has been invited to
     * @param username {string} - the username
     * @param callback
     */
    that.getInvitedLists = function(username, callback) {
      listModel.find().exec(function(err, result) {
        if (err) callback({ msg: err });
        //TODO: FIND PROPER WAY TO QUERY
        var invitedLists = result.filter(function(list) {
          return list.usersSharedWith.indexOf(username) > -1;
        });
        if (invitedLists.length > 0) {
            callback(null, invitedLists);
        } else {
            callback({ msg: 'No lists for this user'})
        }
       });
    };

    /**
     * Add a ranking to a list
     * @param listId {string} - the list object id
     * @param rankingId {string} - the ranking object id
     * @param callback
     */
    that.updateRankingsArray = function (listId, rankingId, callback) {
        listModel.findOneAndUpdate(
            {_id : listId}, {$push: { rankings: rankingId} }, function(err) {
                if (err) callback({msg: err});
                else {
                    callback(null);
                }
        });
    };

    /**
     * Adds items to a list
     * @param listId {string} - the list object id
     * @param newItems {array} - the items to add
     * @param callback
     */
    that.addMoreItems = function(listId, newItems, callback) {
      listModel.findOneAndUpdate(
        {_id : listId}, {$pushAll: {items:newItems} },{upsert:false}, function(err,newList) {
            if (err) callback({msg: err});
            else {
              callback(null,newList);
            }
      });
    };

    /**
     * Gets the lists in a search
     * @param searchString {string} - the string searched for
     * @param callback
     */
    that.search = function(searchString, callback) {
      listModel.find({ "title": { "$regex": new RegExp(searchString, "i")}, isPublic:true  }).exec(function(err, result) {
        if (err) callback({ msg: err });
        if (result !== null) {
            callback(null, result);
        } else {
            callback(null, []);
        }
      });
    };

    /**
     * Get a list
     * @param listId {string} - the list object id
     * @param callback
     */
    that.getListById = function (listId, callback) {
        listModel.findById(listId, function (err, list) {
            if (err) callback({ msg: err }, null);
            if (list != null) {
                callback(null, list);
            } else {
                callback({ msg: 'The list does not exist!'});
            }
        })
    };

    /**
     * Get a ranking by user id
     * @param userId {string} - the user object id
     * @param listId {string} - the list object id
     * @param callback
     */
    that.getRankingByUserId = function (userId, listId, callback) {
        listModel.findById(listId, function (err, list) {
            if (err) callback({ msg: err }, null);
            if (list != null) {
                var rankings = list.rankings;

            } else {
                callback({ msg: 'The list does not exist!'});
            }
        })
    };


    Object.freeze(that);
    return that;

})(listModel);

module.exports = list;
