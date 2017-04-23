var assert = require("assert");
var mongoose = require("mongoose");
var moment = require("moment");
var ObjectId = require('mongoose').Types.ObjectId;

var list = require("../models/List.js");

mongoose.connect('mongodb://localhost/tests');


// Test List.
describe("List", function() {

    // Test createList.
    describe("#createList", function () {

        // Test create valid new list.
        it("Should create a new list with no issues.", function (done) {
            list.createList("{ 'title':'top nba players'," +
                                    "'creator':'Bruno'," +
                                    "'creator_id':'123'," +
                                    "'items':[]," +
                                    "'rankings':[]," +
                                    "'isPublic':true," +
                                    "'upvotes':0," +
                                    "'locked':false," +
                                    "'maxLength':2," +
                                    "'description':'rate your favorite players'," +
                                    "'userSharedWith':[]}", function(err, resList){
                console.log(resList._id);
                assert.deepEqual(err, null);
                list_id = resList._id;
                done();
            });
        });

    });

    // Test lockList.
    describe("#lockList", function () {

        // Test lock valid new list.
        it("Should lock a new list with no issues.", function (done) {
            list.lockList(ObjectId(list_id), function(err, resList){
                assert.deepEqual(err, null);
                assert.deepEqual(resList, null);
                done();
            });
        });
    });

    // Test getPublicLists.
    describe("#getPublicLists", function () {
        // Test get valid public lists.
        it("Should return no public lists.", function (done) {
            list.getPublicLists(function(err, resList){
                assert.deepEqual(err, { msg:'No public lists!'});
                assert.deepEqual(resList, null);
                done();
            });
        });

    });

    // Test getTrendingLists.
    describe("#getTrendingLists", function () {
        // Test get valid trending lists.
        it("Should return no trending lists.", function (done) {
            list.getTrendingLists(function(err, resList){
                assert.deepEqual(err, { msg:'No public lists!'});
                assert.deepEqual(resList, null);
                done();
            });
        });
    });

    // Test getUserPrivateLists.
    describe("#getUserPrivateLists", function () {
        // Test get user private lists.
        it("Should return no private lists.", function (done) {
            list.getUserPrivateLists('Bruno', function(err, resList){
                assert.deepEqual(err, { msg:'No private consensuses for this user!'});
                assert.deepEqual(resList, null);
                done();
            });
        });
    });

    // Test getUserLists.
    describe("#getUserLists", function () {
        // Test get user lists.
        it("Should return no private lists.", function (done) {
            list.getUserLists(ObjectId('284e5ac3acb27f611ad965c4'), function(err, resList){
                assert.deepEqual(err, { msg:'No private consensuses for this user!'});
                assert.deepEqual(resList, null);
                done();
            });
        });
    });

    // Test getInvitedLists.
    describe("#getInvitedLists", function () {
        // Test get user invited lists.
        it("Should return no invited lists.", function (done) {
            list.getInvitedLists('Bruno', function(err, resList){
                assert.deepEqual(err, { msg:'No lists for this user'});
                assert.deepEqual(resList, null);
                done();
            });
        });
    });

    // Test updateRankingsArray.
    describe("#updateRankingsArray", function () { // TODO
        // Test updating a ranking to a list.
        it("Should return no invited lists.", function (done) {
            list.updateRankingsArray(ObjectId(list_id),ObjectId('284e5ac3acb27f611ad965c4'), function(err, resList){
                assert.deepEqual(resList, null);
                done();
            });
        });
    });


    // Test search.
    describe("#search", function () {
        // Test search for lists.
        it("Should return empty array of rankings.", function (done) {
            list.search("nba", function(err, resList){
                assert.deepEqual(resList, []);
                done();
            });
        });
    });

    // Test getListById.
    describe("#getListById", function () {
        // Test get list by its id
        it("Should return the list with the corresponding id.", function (done) {
            list.getListById(ObjectId(list_id), function(err, resList){
                assert.deepEqual(err, null);
                assert.deepEqual(resList._id, list_id);
                done();
            });
        });
    });

    // Test getRankings.
    describe("#getRankings", function () {
        // Test get list's rankings.
        it("Should return empty array of rankings.", function (done) {
            list.getInvitedLists(ObjectId(list_id), function(err, resList){
                // console.log(resList);
                done();
            });
        });
    });

    // Test upvote.
    describe("#upvote", function () {
        // Test user upvotes a list.
        it("Should successfully upvote a list.", function (done) {
            list.downvote(ObjectId(list_id),ObjectId('484e5ac3acb27f611ad965c4'), function(err, resList){
                // correctly upvotes a list
                assert(resList.n === 1);
                done();
            });
        });
    });

    // Test downvote.
    describe("#downvote", function () {
        // Test user downvotes a list.
        it("Should successfully downvote a list.", function (done) {
            list.downvote(ObjectId(list_id),ObjectId('284e5ac3acb27f611ad965c4'), function(err, resList){
                // correctly downvotes a list
                assert(resList.n === 1);
                done();
            });
        });
    });
});