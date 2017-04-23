var assert = require('assert');
var mongoose = require('mongoose');
var app = require('../app');
var User = require('../models/Users');
var Users = User.Users;
var Ranking = require('../models/Ranking');
var List = require('../models/List');

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// User Model Tests /////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

describe('Users', function() {

	var test_username;
	var test_user_id;
	var test_list_id;
	var test_ranking_id;
	var test_user_date;

    describe('#createUser', function () {

    	// drop Users table
    	mongoose.model('Users').remove({}, function(err) {
		   console.log('Users collection removed');
		});

		mongoose.model('Ranking').remove({}, function(err) {
		   console.log('Rankings collection removed');
		});

		mongoose.model('List').remove({}, function(err) {
		   console.log('Lists collection removed');
		});

		it('Create a valid new user', function (done) {

            Users.createUser("my_username", "password", function (err, user) {
            	assert.	equal(user.username, "my_username");
            	test_username = user.username;
            	test_user_id = user._id;
            	test_user_date = user.last_viewed_invitations_date.getTime();
            	done();
            });
        });

		var listData = {
			title : "list_title",
	        creator : test_username,
	        creator_id : test_user_id,
	        items : [],
	        rankings : [],
	        isPublic : true,
	        upvotes : 0,
	        locked : false,
	        maxLength : 5,
	        description : "",
	        usersSharedWith : []
		};
		List.createList(listData, function(err, list){
	        Users.hasCreatedList(test_user_id, list, function(err, user) {
	        	if (err) {
	        		console.log(err);
	        	} else {
	        		test_list_id = list._id;
	        	}
	        });
	    });

        it('Create an invalid user with username too short', function (done) {

            Users.createUser("hi", "password", function (err, user) {
                assert.equal(err.msg, "Usernames should be at most 15 characters and at least 3!");
                done();
            });
        });

        it('Create an invalid user with username too long', function (done) {

            Users.createUser("this_is_more_than_fifteen_characters", "password", function (err, user) {
                assert.equal(err.msg, "Usernames should be at most 15 characters and at least 3!");
                done();
            });
        });

        it('Create an invalid user with already taken username', function (done) {

            Users.createUser("my_username", "password", function (err, user) {
                assert(err.taken);
                done();
            });
        });

    });

	describe('#findUser', function () {

        it('Find a user by username', function (done) {

            Users.createUser("maxlancaster", "password", function (err, original_user) {
            	Users.findUser("maxlancaster", function(err, user){
            		assert.equal(user.username, original_user.username);
            		assert.equal(String(user._id), String(original_user._id));
            		done();
            	});
            });
        });

        it('Find a non-existing user by username', function (done) {

        	Users.findUser("i_dont_exist", function(err, user){
        		assert.equal(err.msg, "This user does not exist!");
        		done();
        	});
        });

    });

    describe('#findById', function () {

        it('Find a user by Id', function (done) {

        	Users.findById(test_user_id, function(err, user){
        		assert.equal(user.username, test_username);
        		assert.equal(String(user._id), String(test_user_id));
        		done();
        	});
        });

    });

    describe('#getAllRankings', function () {

        it('Get all rankings by username', function (done) {
        	var rankingData = {
        		order : [],
                list : test_list_id,
                comment : "comment",
                listTitle : "title",
                listCreatorUsername : "test_username",
                user : "test_username",
    			user_id : "test_user_id"
        	}
        	Ranking.addRanking(rankingData, function(err, ranking){
	            Users.hasSubmittedRanking(test_user_id, ranking, function(err, user) {
	            	Users.getAllRankings(test_username, function(err, rankings){
		        		assert.equal(rankings.length, 1);
		        		assert.equal(user.rankings[0], String(rankings[0]));
		        		done();
		        	});
	            });
		    });
        });

    });

    describe('#getAllLists', function () {

        it('Get all lists by username', function (done) {
        	var listData = {
        		title : "new_list_title",
	            creator : test_username,
	            creator_id : test_user_id,
	            items : [],
	            rankings : [],
	            isPublic : true,
	            upvotes : 0,
	            locked : false,
	            maxLength : 5,
	            description : "",
	            usersSharedWith : []
        	}
        	List.createList(listData, function(err, list){
	            Users.hasCreatedList(test_user_id, list, function(err, user) {
	            	Users.getAllLists(test_username, function(err, lists){
		        		assert.equal(lists.length, 1);
		        		assert.equal(user.lists[0], String(lists[0]));
		        		done();
		        	});
	            });
		    });
        });

    });

    describe('#search', function () {

        it('Search for a user', function (done) {
        	Users.search("my_username", function(err, user){
        		var user = user[0];
        		assert.equal(user.username, test_username);
        		assert.equal(String(user._id), String(test_user_id));
        		done();
        	});
        });

    });

    describe('#checkPassword', function () {

        it('Check correct password', function (done) {
        	Users.checkPassword(test_username, "password", function(err, user){
        		assert.equal(user.username, test_username);
        		assert.equal(String(user._id), String(test_user_id));
        		done();
        	});

        });

        it('Check incorrect password', function (done) {
        	Users.checkPassword(test_username, "wrong", function(err, user){
        		assert.equal(err, null);
        		assert.equal(user, false);
        		done();
        	});

        });

    });

    describe('#hasCreatedList', function () {

    	it('this function is tested with #getAllLists', function (done) {
        	done()
        });

    });

    describe('#hasSubmittedRanking', function () {

    	it('this function is tested with #getAllRankings', function (done) {
        	done()
        });

    });

    describe('#updateLastViewedInvitationsDate', function () {

    	it('update last viewed invitations date with current date', function (done) {
        	Users.updateLastViewedInvitationsDate(test_user_id, function(err, user) {
        		assert(user.last_viewed_invitations_date.getTime() > test_user_date);
        		done();
        	});
        });

    });
});