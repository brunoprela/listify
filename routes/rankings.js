var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');

var Rankings = require('../models/Ranking');
var Items = require('../models/Items');
var List = require('../models/List');
var User = require('../models/Users');
var Users = User.Users;

// var rankingServices = require('../services/rankingServices');


/**
 * Requires authentication on all access to logged-in Listify features.
 */
var requireAuthentication = function(req, res, next) {
    if (!req.currentUser){
        utils.sendErrorResponse(res, 403, 'Please log in to use this feature.');
    } else {
        next();
    }
};


/**
 * Requires ownership whenever accessing a particular ranking.
 */
var requireRankingOwnership = function(req, res, next) {
    if (!(req.currentUser.username === req.body.ranking.user)) {
        utils.sendErrorResponse(res, 400, 'Please make well-formed requests.');
    } else{
        next();
    }
};


/**
* Requires ownership whenever accessing a particular consensus.
*/
var requireListOwnership = function(req, res, next) {
    if (!(req.currentUser.username === req.body.list.creator)) {
        utils.sendErrorResponse(res, 400, 'Please make well-formed requests.');
    } else{
        next();
    }
};

/*
 For create requests, require that the request body
 contains a 'content' field. Send error code 400 if not.
 */
var requireContent = function(req, res, next) {
    if (!req.body.content) {
        utils.sendErrorResponse(res, 400, 'Content required in request.');
    } else {
        next();
    }
};


// Register the middleware handlers above.
router.get('/', requireAuthentication);
router.get('/:listId', requireAuthentication);
router.post('/lock/:listId', requireAuthentication);
router.post('*', requireContent);

/**
 * Gets a ranking
 */
router.get('/get/:rankingId', function(req, res){
    Rankings.getRankingByID(req.params.rankingId, function (err, ranking) {
        if(err){
            utils.sendErrorResponse(res, 404, 'No such ranking.');
        } else{
            utils.sendSuccessResponse(res, { ranking : ranking});
        }
    });
});

/**
 * Gets a list
 */
router.get('/:consensus_id', function(req, res){
    List.getListById(req.params.listId, function(err, list){
        if(err){
            utils.sendErrorResponse(res, 404, 'No such list.');
        } else{
            utils.sendSuccessResponse(res, { list : list});
        }
    });
});

/**
 * Gets a user's rankings
 */
router.get('/user/:user_id', function(req, res){
    Rankings.getUserRankings(req.params.user_id, function(err, rankings){
        if(err){
            utils.sendErrorResponse(res, 404, 'No such list.');
        } else{
            utils.sendSuccessResponse(res, { rankings : rankings});
        }
    });
});


/**
 * Locks the consensus.
 */
router.post('/lock/:listId', function(req, res){
    List.getListById(req.params.listId, function(err, list){
        if(err){
            utils.sendErrorResponse(res, 404, 'No such list.');
        } else{
            utils.sendSuccessResponse(res, { list : list});
        }
    })
});

/**
 * Submits a ranking
 */
router.post('/submit', function(req, res) {
    var rankingData = req.body.content;
    rankingData["user"] = req.session.user.username;
    rankingData["user_id"] = req.session.user._id;
    Rankings.addRanking(rankingData, function(err, ranking){
        if (err) {
            utils.sendErrorResponse(res, 500, err);
        } else {
            Users.hasSubmittedRanking(req.session.user._id, ranking, function(err, user) {
                if (err) {
                    utils.sendErrorResponse(res, 500, err);
                } else {
                    var listId = rankingData.list;
                    List.updateRankingsArray(listId, ranking._id, function(err) {
                        if (err) {
                            utils.sendErrorResponse(res, 500, err);
                        } else {
                            utils.sendSuccessResponse(res);
                        }
                    });
                }
            });
        }
    });
});

/**
 * Gets the consensus to allow non-creator users to post responses to
 */
router.get('/edit/:listId', function(req, res){
    List.getListById(req.params.listId, function(err, list){
        if(err){
            utils.sendErrorResponse(res, 404, 'No such list.');
        } else {
            // load the edit page
            // rankingServices.loadEditPage(consensus);
            utils.sendSuccessResponse(res, {list : list});
        }
    })
});

/**
 * Updates a ranking
 */
router.put('/update/:rankingId', function (req, res) {
    var rankingData = req.body.content;
    Rankings.updateRanking(req.params.rankingId, rankingData.order, rankingData.comment, function (err, ranking) {
        utils.sendSuccessResponse(res, {ranking : ranking});
    });

});

module.exports = router;
