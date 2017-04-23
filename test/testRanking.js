var assert = require("assert");
var mongoose = require("mongoose");
var moment = require("moment");
var ObjectId = require('mongoose').Types.ObjectId;

var ranking = require("../models/Ranking.js");
var list = require("../models/List.js");



mongoose.connect('mongodb://localhost/tests');


// Test List.
describe("Ranking", function() {

    // Test addRanking.
    describe("#addRanking", function () {

        var rankingData = {
            order : [],
            list : ObjectId('284e5ac3acb27f611ad965c4'),
            comment : "comment",
            listTitle : "title",
            listCreatorUsername : "test_username",
            user : "test_username",
            user_id : "test_user_id"
        };

        it("Should create a new ranking with no issues.", function (done) {
            ranking.addRanking(rankingData, function(err, ranking){
                assert.deepEqual(err, null);
                assert.deepEqual(ranking.comment, "comment");
                assert.deepEqual(ranking.listTitle, "title");
                ranking_id = ranking._id;
                done();
            });
        });

    });

    // Test updateRanking.
    describe("#updateRanking", function () {
        it("Should update a ranking with no issues.", function (done) {
            ranking.updateRanking(ranking_id, [],"updated comment", function(err, ranking){
                assert.deepEqual(err, null);
                assert.deepEqual(ranking.comment, "updated comment");
                assert.deepEqual(ranking.listTitle, "title");
                done();
            });
        });
    });


    // Test getUserRankings.
    describe("#getUserRankings", function () {
        it("Should update a ranking with no issues.", function (done) {
            ranking.getUserRankings(ObjectId("test_user_id"), function(err, ranking){
                assert.deepEqual(err, null);
                console.log(ranking);
                done();
            });
        });
    });

    // Test addItemToRanking.
    describe("#addItemToRanking", function () {
        it("Should add an item to a ranking with no issues.", function (done) {
            ranking.addItemToRanking("test_item", ObjectId(ranking_id), function(err, ranking){
                assert.deepEqual(err, null);
                done();
            });
        });
    });

    // Test getRankingByID.
    describe("#getRankingByID", function () {
        it("Should get a ranking by its id.", function (done) {
            ranking.getRankingByID(ObjectId(ranking_id), function(err, ranking){
                assert.deepEqual(err, null);
                assert.deepEqual(ranking._id, ranking_id);
                done();
            });
        });
    });
});