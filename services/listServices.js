var dev = 'http://localhost:3000/api/lists';
var prod = 'https://listify-team-phil.herokuapp.com/api/lists';
const BASE_URL = dev;
var Cookie = require('js-cookie'); 

var request = require('request-promise-native');


/**
 * Services to link the front-end to the list models
 */
export default {
	createList : (content) => {
	    return request({
	        uri : BASE_URL + '/create',
	        method: 'POST',
	        json : true,
	        body : {
	        	content : content,
	        	_csrf: Cookie.get('XSRF-TOKEN')
	         }
	    });
	},

	search : (searchString) => {
		return request({
			uri : BASE_URL + `/search/${searchString}`,
			method : 'POST',
			json : true,
			body : {
				_csrf: Cookie.get('XSRF-TOKEN')
			}
		})
	},

	getMostRecentLists : () => {
		return request({
			uri : BASE_URL + '/most_recent',
			method : 'GET',
			json : true
		})
	},

	getTrendingLists : () => {
		return request({
			uri : BASE_URL + '/trending',
			method : 'GET',
			json : true
		})
	},

	getListDataFromId : (list_id) => {
		return request({
			uri : BASE_URL + `/find/${list_id}`,
			method : 'GET',
			json : true
		})
	},

	getComments : (list_id) => {
		return request({
			uri : BASE_URL + `/comments/${list_id}`,
			method : 'GET',
			json : true
		})
	},

	getInvitedLists: (username) => {
		return request({
			uri : BASE_URL + `/invited/${username}`,
			method : 'GET',
			json : true
		})
	},

	getUserLists: (user_id) => {
		return request({
			uri : BASE_URL + `/user/${user_id}`,
			method : 'GET',
			json : true
		})
	},

	lockList : (list_id) => {
		return request({
			uri : BASE_URL + `/lock/${list_id}`,
			method: 'PUT',
			json: true,
			body : {
				_csrf: Cookie.get('XSRF-TOKEN')
			}
		})
	},

	addMoreItems : (list_id, newItems) => {
		return request({
			uri : BASE_URL + `/add_items/${list_id}`,
			method: 'PUT',
			json: true,
			body : {
				newItems : newItems,
				_csrf: Cookie.get('XSRF-TOKEN')
			}
		})
	},
    calculateOrdering : (list_id) => {
        return request({
            uri : BASE_URL + `/consensus/${list_id}`,
            method: 'GET',
            json: true
        })
    },

    upvote : (list_id) => {
        return request({
            uri: BASE_URL + `/upvote/${list_id}`,
            method: 'POST',
            json: true,
            body : {
            	_csrf: Cookie.get('XSRF-TOKEN')
            }
        })
    },

    downvote : (list_id) => {
        return request({
            uri: BASE_URL + `/downvote/${list_id}`,
            method: 'POST',
            json: true,
            body : {
            	_csrf: Cookie.get('XSRF-TOKEN')
            }
        })
    },

    removeVote : (list_id, voteType) => {
        return request({
            uri: BASE_URL + `/removevote/${list_id}`,
            method: 'POST',
            json: true,
            body : {
            	voteType: voteType,
            	_csrf: Cookie.get('XSRF-TOKEN')
            }
        })
    },

    getNumUpvotes : (list_id) => {
        return request({
            uri: BASE_URL + `/votes/${list_id}`,
            method: 'GET',
            json: true
        })
    },
}
