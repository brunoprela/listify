var dev = 'http://localhost:3000/api/users';
var prod = 'https://listify-team-phil.herokuapp.com/api/users';
const BASE_URL = dev;
var Cookie = require('js-cookie'); 

var request = require('request-promise-native');

/**
 * Services to link the front-end to the user models
 */
export default {
  register : (username, password) => {
    return request({
      uri : BASE_URL,
      method: 'POST',
      json : true,
      body : {
        username : username,
        password : password,
        _csrf: Cookie.get('XSRF-TOKEN')
      }
    });
  },

  login : (username, password) => {
    return request({
      uri : BASE_URL + '/login',
      method: 'POST',
      body : {
        username : username,
        password : password,
        _csrf: Cookie.get('XSRF-TOKEN')
      },
      json : true
    });
  },

  getCurrentUser: () => {
    return request({
      uri : BASE_URL + '/current',
      method: 'GET',
      json : true
    });
  },

  logout : () => {
    return request({
      uri : BASE_URL + '/logout',
      method: 'PUT',
      json : true,
      body : {
        _csrf: Cookie.get('XSRF-TOKEN')
      }
    });
  },

  updateLastViewedInvitationsDate : () => {
    return request({
      uri : BASE_URL + '/update_last_viewed_invitations_date',
      method: 'PUT',
      json : true,
      body : {
        _csrf: Cookie.get('XSRF-TOKEN')
      }
    });
  },

  search : (username) => {
    return request({
      uri: BASE_URL + '/search' + `/${username}`,
      method: 'POST',
      json: true,
      body : {
        _csrf: Cookie.get('XSRF-TOKEN')
      }
    });
  }

  // follow : (username, following) => {
  //   return request({
  //     uri : BASE_URL + `/follow/${username}`,
  //     method: 'POST',
  //     json : true,
  //     body: {
  //       following: following
  //     }
  //   });
  // },

  // getWhoImFollowing : () => {
  //   return request(BASE_URL + '/following', {
  //     method: 'GET',
  //     json : true
  //   });
  // }
}
