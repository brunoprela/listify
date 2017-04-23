import React, { Component } from 'react';
import { withRouter } from 'react-router';
import UserCard from './Cards/UserCard.jsx';
import userServices from '../../services/userServices.js';

import Autocomplete from 'react-autocomplete';


class InviteUsersPanel extends Component {
  constructor(props) {
		super(props);
		this.state = { invitedUsers: [],suggestedUsers: [], loading: false};
	}

  handleChange(event, value) {
    var searchText = value;
    this.setState({searchText:value, loading: true});
    userServices.search(value).then( (res) => {
      this.setState({suggestedUsers: res.content.users, loading:false});
    });
  }

  handleSuggestionSelection(username,user) {
    var invitedUsers = this.state.invitedUsers;
    var invitedUserIds = this.state.invitedUsers.map(function(user) {
      return user._id;
    });
    if (invitedUserIds.indexOf(user._id) === -1) {
      invitedUsers.push(user);
    }
    this.props.updateInvitedUsers(invitedUsers);
    this.setState({searchText: "", suggestedUsers: [], invitedUsers:invitedUsers});

  }

  deleteInvitedUser(user) {
    var invitedUsers = this.state.invitedUsers;
    var index = invitedUsers.indexOf(user);
    if (index > -1) {
      invitedUsers.splice(index,1);
    }
    this.setState({invitedUsers:invitedUsers});
  }

	render() {
    var invitedUsers = this.state.invitedUsers;
    var suggestedUsers = this.state.suggestedUsers;
    let styles = {
      item: {
        padding: '6px 6px',
        cursor: 'default'
      },

      highlightedItem: {
        color: 'white',
        background: "#66B110",
        padding: '6px 6px',
        cursor: 'default'
      },

      menu: {
        border: 'solid 1px #ccc'
      }
    }
		return (
      <div className = "InviteUsersPanel">
        <h1 className = "OptionsListTitle"> Invite Users</h1>
        <Autocomplete
          value={this.state.searchText}
          inputProps={{name: "username", id: "UserSearchTextInput", placeholder: "Search usernames"}}
          items={suggestedUsers}
          getItemValue={(user) => user.username}
          onChange={this.handleChange.bind(this)}
          onSelect={this.handleSuggestionSelection.bind(this)}
          renderItem={(user, isHighlighted) => (
            <div
              style={isHighlighted ? styles.highlightedItem : styles.item}
              key={user.username}
            >{"@"+user.username}</div>
          )}
        />
        {invitedUsers.map((user, index) => {
          return (
            <UserCard
              key={index}
              index={index}
              user={user}
              deleteInvitedUser={this.deleteInvitedUser.bind(this)}
            />
          );
        })}
      </div>
		);
  }
}

export default withRouter(InviteUsersPanel);
