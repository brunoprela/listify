import React, { Component } from 'react';
import { withRouter } from 'react-router';

class UserCard extends Component {

  deletePressed() {
    this.props.deleteInvitedUser(this.props.user);
  }

  render() {
		const { user, index } = this.props;
    var trashIcon = require('../../../public/assets/TrashCan.svg');
    var iconStyle = {
      width:"15px",
      height:"15px",
    }
		return(
        <div className = "UserCard">
          <button className = "UserDeleteButton" onClick={this.deletePressed.bind(this)}>
            <img src = {trashIcon} style = {iconStyle}/>
          </button>
          <p className = "UserCardTitle">{"@"+user.username}</p>
        </div>
    );
  }
}

export default withRouter(UserCard);
