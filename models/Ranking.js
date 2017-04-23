
/*
 * Model representing a Ranking.
 * key: value pairs are key = title of the ranking and value =
 * the object representing the ranking.
 */

var mongoose = require('mongoose');
var Items = require('../models/Items');
var List = require('../models/List');
var ObjectId = require('mongoose').Types.ObjectId;


var rankingSchema = mongoose.Schema({

    order: [],

    user: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
    },

    listTitle:String,
    listCreatorUsername:String,

    comment: {}
}, { timestamps: true });


var rankingModel = mongoose.model('Ranking', rankingSchema);

/**
 * Am object that encapsulates functions that work with the rankings database
 */
var Rankings = (function(rankingModel) {

    var that = {};

    /**
     * Update a ranking by sumbitting a new ordering of items
     * @param ranking_id {string} - the ranking id
     * @param order {array} - an array of items
     * @param comment {string} - a comment
     * @param callback
     */
    that.updateRanking = function (ranking_id, order, comment, callback) {
        rankingModel.findOneAndUpdate({_id : new ObjectId(ranking_id)}, {$set : {order : order, comment: comment}}, {new : true})
            .exec(function (err, ranking) {
                if (err) {
                    callback({ msg: err});
                } else {
                    console.log("being updated");
                    callback(null, ranking);
                }
            })
    };


    /**
     * Gets the Ranking Object from a list of corresponding ranking ids
     * @param listOfRankings {array} - the ranking ids
     * @param callback
     */
    that.getRankingObjectsFromListOfIds = function (listOfRankings, callback) {
        rankingModel.find({
            '_id' : { $in:
            listOfRankings
            }
        }, function (err, array) {
            callback(null, array);
        });
    };

    /**
     * Get the rankings for a user
     * @param user_id {string} - the user id
     * @param callback
     */
    that.getUserRankings = function(user_id, callback) {
      rankingModel.find({user_id : new ObjectId(user_id)}).sort({createdAt: -1}).exec(function(err, rankings) {
        if (err) {
          callback({ msg: err});
        } else {
            callback(null, rankings);
        }
      });
    };


    /**
     * Add an item to a ranking
     * @param item {Item} - an item
     * @param rankingId {string} - the ranking id
     * @param callback
     */
    that.addItemToRanking = function (item, rankingId, callback) {

        rankingModel.findByIdAndUpdate(
            rankingId,
            {$push: {"order": item }},
            function (err, ranking) {
                if (err) callback({ msg: err });
                callback(null, ranking);
            }
        )
    };

    /**
     * Adds a ranking to the database
     * @param ranking {Ranking} - a ranking object
     * @param callback
     */
    that.addRanking = function (ranking, callback) {
        console.log(ranking);
        var ranking = new rankingModel({
            order: ranking.order,
            user: ranking.user,
            list: ranking.list,
            user_id: ranking.user_id,
            comment: ranking.comment,
            listTitle: ranking.listTitle,
            listCreatorUsername: ranking.listCreatorUsername
        });

        ranking.save(function (err, newRanking) {
            if (err) callback({ msg: err});
            else {
                // rankingModel.find({}).exec(function(error, ranking) {
                //     console.log("ranking created! : " + JSON.stringify(ranking, null, '\t'));
                // });
                callback(null, newRanking);
            }
        })
    };

    /**
     * Get a list that is referred to by a ranking
     * @param rankingId {string} - the ranking id
     * @param callback
     */
    that.getListByRankingId = function (rankingId, callback) {
        rankingModel.findById(rankingId, function (err, ranking) {
            if (err) callback({ msg: err });
            if (ranking != null) {
                callback(null, ranking.list);
            } else {
                callback({ msg: 'The ranking does not exist!'});
            }
        })
    };

    /**
     * Get a ranking by its id
     * @param rankingId {string} - the ranking id
     * @param callback
     */
    that.getRankingByID = function (rankingId, callback) {
        rankingModel.findById(rankingId, function (err, ranking) {
            if (err) callback({ msg: err });
            if (ranking !== null) {
                callback(null, ranking);
            } else {
                callback({ msg: 'This ranking does not exist!' });
            }
        });
    };


    Object.freeze(that);
    return that;

})(rankingModel);

module.exports = Rankings;
