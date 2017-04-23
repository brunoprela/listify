var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');

var Rankings = require('../models/Ranking');
var Items = require('../models/Items');
var List = require('../models/List');
var User = require('../models/Users');
var Users = User.Users;

/**
 * Creates a user
 */
router.post('/create', function(req, res) {
    var listObject = {
        title : req.body.content.title,
        creator : req.session.user.username,
        creator_id:req.session.user._id,
        items : req.body.content.items,
        rankings : [],
        isPublic : req.body.content.isPublic,
        upvotes : 0,
        locked : false,
        description : req.body.content.description,
        // TO DO, hardcoded
        maxLength : req.body.content.maxLength,
        usersSharedWith : req.body.content.usersSharedWith
    };
    List.createList(listObject, function(err, list) {
        if (err) {
            console.log(err);
            utils.sendErrorResponse(res, 500, err);
        } else {
            var user_id = req.session.user._id;
            Users.hasCreatedList(user_id, list, function(err, user) {
                req.session.user.lists.push(list._id);
                utils.sendSuccessResponse(res, list);
            });
        }
    });

});

/**
 * Gets the ordering for the list based on the rankings submitted thus far
 */
router.get('/consensus/:listId', function (req, res) {
    List.getListById(req.params.listId, function(err, list) {
        var items = list.items;      
        List.getRankings(req.params.listId, function (err, listRankingIds) {
            if(err){
                utils.sendErrorResponse(res, 404, 'No such list.');
            } else {
                Rankings.getRankingObjectsFromListOfIds(listRankingIds, function (err, listRankings) {
                    if(err){
                        utils.sendErrorResponse(res, 500, err);
                    } else {

                        var sums = {}; //{itemId:Sum of ranks}
                        var itemMap = {}; // {item.id : item}

                        listRankings.forEach(function (ranking) {
                            var order = ranking.order;
                            var orderIds = order.map(function(item){
                                return item.id;
                            });

                            order.forEach(function (item) {
                              itemMap[item.id] = item;
                               if (!(item.id in sums)) {
                                 sums[item.id] = item.rank;
                               } else {
                                 sums[item.id] += item.rank;
                               }
                            });
                            items.forEach(function(item) {
                                itemMap[item.id] = item;
                                if (orderIds.indexOf(item.id) < 0) {
                                    console.log("index of");
                                    if (item.id in sums) {
                                        sums[item.id] += list.maxLength + 1;
                                    } else {
                                        sums[item.id] = list.maxLength + 1;
                                    }
                                }
                            });
                            console.log(sums);
                        });

                        var itemIds = Object.keys(sums);
                        var sumObjects = itemIds.map(function(itemId) {
                          var sumObject = {itemId:itemId, rank:sums[itemId]};
                          return sumObject;
                        });

                        sumObjects.sort(function(a,b) { return a.rank - b.rank; });

                        var updated_order = sumObjects.map(function(sumObject) {
                          return itemMap[sumObject.itemId];
                        });

                        utils.sendSuccessResponse(res, {order : updated_order});
                    }
                })
            }
        })
    })
});

/**
 * Gets the comments to a particular list
 */
router.get('/comments/:listId', function (req, res) {
    List.getRankings(req.params.listId, function (err, listRankingIds) {
        if(err){
            utils.sendErrorResponse(res, 404, 'No such list.');
        } else {
            Rankings.getRankingObjectsFromListOfIds(listRankingIds, function (err, listRankings) {
                if(err){
                    utils.sendErrorResponse(res, 500, err);
                } else {
                  var comments = listRankings.map(function (ranking) {
                    return ranking.comment;
                  }).filter(function(object) {
                    return object ? true : false;
                  });
                  utils.sendSuccessResponse(res, {comments : comments});
                }
            })
        }
    })
});

/**
 * Gets the consensus to allow non-creator users to post responses to
 */
router.get('/find/:listId', function(req, res){
    List.getListById(req.params.listId, function(err, list){
        if(err){
            utils.sendErrorResponse(res, 404, 'No such list.');
        } else {
            utils.sendSuccessResponse(res, {list : list});
        }
    })
});

/**
 * Gets the lists of created by a user given his user_id
 */
 router.get('/user/:userId', function(req, res){
     List.getUserLists(req.params.userId, function(err, lists){
         if(err){
             utils.sendErrorResponse(res, 500, err);
         } else {
             utils.sendSuccessResponse(res, {lists : lists});
         }
     })
 });

/**
 * Gets the lists a user is invited to
 */
router.get('/invited/:username', function(req, res){
  console.log("yoo");
    List.getInvitedLists(req.params.username, function(err, lists){
        if(err){
            utils.sendErrorResponse(res, 500, err);
        } else {
            utils.sendSuccessResponse(res, {lists : lists});
        }
    })
});

/**
 * Processes a search request
 */
router.post('/search/:searchString', function(req, res){
    List.search(req.params.searchString, function(err, lists){
        if(err){
            utils.sendErrorResponse(res, 500, err);
        } else {
            utils.sendSuccessResponse(res, {lists : lists});
        }
    })
});

/**
 * Gets all public lists sorted by most recent
 */
router.get('/most_recent', function(req, res) {
    List.getPublicLists(function(err, lists) {
        if(err){
            utils.sendErrorResponse(res, 500, err);
        } else {
            utils.sendSuccessResponse(res, {lists : lists});
        }
    });
});

/**
 * Get trending lists
 */
router.get('/trending', function(req, res) {
    List.getTrendingLists(function(err, lists) {
        if(err){
            utils.sendErrorResponse(res, 500, err);
        } else {
            utils.sendSuccessResponse(res, {lists : lists});
        }
    });
});

/**
 * Lock a list
 */
router.put('/lock/:listId', function(req, res) {
    List.lockList(req.params.listId, function(err) {
        if(err){
            utils.sendErrorResponse(res, 404, 'No such list.');
        } else {
            utils.sendSuccessResponse(res);
        }
    });
});

/**
 * Add items to a list
 */
router.put('/add_items/:listId', function(req,res) {
  List.addMoreItems(req.params.listId, req.body.newItems, function(error, list) {
    if(error){
        utils.sendErrorResponse(res, 500, error);
    } else {
        utils.sendSuccessResponse(res, {list : list});
    }
  });
});

/**
 * Adds the user's id to the List's array of upvoters and updates net upvotes.
 */
router.post('/upvote/:listId', function(req, res){
    List.upvote(req.params.listId, req.session.user._id, function(err, newList){
        if(err){
            utils.sendErrorResponse(res, 404, 'unable to update with upvote');
        } else{
            utils.sendSuccessResponse(res);
        }
    });
});

/**
 * Adds the user's id to the List's array of downvoters and updates net upvotes.
 */
router.post('/downvote/:listId', function(req, res){
    List.downvote(req.params.listId, req.session.user._id, function(err){
        if(err){
            utils.sendErrorResponse(res, 404, 'unable to update with downvote');
        } else{
            utils.sendSuccessResponse(res);
        }
    });
});

/**
 * Removes the user's id from the List's upvoters or downvoters arrays.
 */
router.post('removevote/:listId', function(req, res){
    if(req.body.voteType === "downvote"){
        List.removeFromDownvoters(req.params.listId, req.session.user._id, function(err){
            if(err){
                utils.sendErrorResponse(res, 404, 'No such list.');
            } else{
                utils.sendSuccessResponse(res);
            }
        });
    } else if(req.body.voteType === "upvote"){
        List.removeFromUpvoters(req.params.listId, req.session.user._id, function(err){
            if(err){
                utils.sendErrorResponse(res, 404, 'No such list.');
            } else{
                utils.sendSuccessResponse(res);
            }
        });
    }
});

/**
 * Reterns the net number of upvotes associated with the list.
 */
router.get('/votes/:listId', function(req, res){
    List.getNumberOfUpvotes(req.params.listId, function(err){
        if(err){
            utils.sendErrorResponse(res, 404, 'No such list.');
        } else {
            utils.sendSuccessResponse(res);
        }
    });
});



module.exports = router;
