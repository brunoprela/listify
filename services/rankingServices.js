var dev = 'http://localhost:3000/api/rankings';
var prod = 'https://listify-team-phil.herokuapp.com/api/rankings';
const BASE_URL = dev;
var Cookie = require('js-cookie'); 

var request = require('request-promise-native');

/**
 * Services to link the front end to the ranking models
 */
export default {
	submitRanking : (content) => {
	    return request({
	        uri : BASE_URL + '/submit',
	        method: 'POST',
	        json : true,
	        body : {
	        	content : content,
	        	_csrf: Cookie.get('XSRF-TOKEN')
	        }
	    });
	},

	loadEditPage : (list_id) => {
		return request({
			uri : BASE_URL + '/edit' + `/${list_id}`,
			method : 'GET',
			json : true
		})
	},

	getRankingById : (ranking_id) => {
		return request({
			uri : BASE_URL + '/get' + `/${ranking_id}`,
			method: 'GET',
			json: true
		})
	},

	getUserRankings : (user_id) => {
		return request({
			uri : BASE_URL + '/user' + `/${user_id}`,
			method: 'GET',
			json: true
		})
	},

    updateRanking : (content) => {
        return request({
            uri : BASE_URL + '/update' + `/${content.ranking_id}`,
            method: 'PUT',
            json : true,
            body : {
            	content : content,
            	_csrf: Cookie.get('XSRF-TOKEN')
            }
        });
    },
	// ,
	// getListById : (consensus_id) => {
	//     return request({
	//         uri : BASE_URL + `/${consensus_id}`,
	//         method: 'GET',
	//         json : true
	//     });
	// },

	// getRankingsByUser : (username) => {
	//     return request({
	//         uri : BASE_URL + `/rankings/${username}`,
	//         method: 'GET',
	//         json : true
	//     });
	// },

	// getHomepage : () => {
	//     return request({
	//         uri : BASE_URL + '/users/following',
	//         method: 'GET',
	//         json : true
	//     });
	// }
}
