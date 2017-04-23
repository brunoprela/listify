import React, { Component } from 'react';
import { withRouter } from 'react-router';


class ProfileDescription extends Component {

  render() {
    var user = this.props.user;
    var listsCreated = user.lists.length;
    var rankingsSubmitted = user.rankings.length;
    var style = {

      background:"#C4BFBF",
      width:"100%",
      height: "80px"
    }
    var profileImageStyle = {
      background:"#E52F4F",
      height:"40px",
      width:"40px",
      padding:"10px",
      float:"left",
      marginTop:"-20px",
      marginLeft:"10px",
      marginRight:"10px",
      borderRadius:"10px"
    }
    var ProfileImage = require('../../public/assets/ProfileIcon.svg');
		return (
      <div className = "ProfileDescription">
        <div style = {style}></div>
        <img src ={ProfileImage} style = {profileImageStyle} />
        <p className = "Username">{"@"+user.username}</p>
        <div className = "StatsContainer">
          <div>
            <p>{"Lists Created"}</p>
            <p>{listsCreated}</p>
          </div>
          <div>
            <p>{"Rankings Submitted"}</p>
            <p>{rankingsSubmitted}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProfileDescription);
