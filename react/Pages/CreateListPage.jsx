import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import OptionsList from '../Elements/Lists/OptionsList.jsx';
import AddItemForm from '../Elements/AddItemForm.jsx';
import RankingTitleForm from '../Elements/RankingTitleForm.jsx';
import BottomRightButton from '../Elements/BottomRightButton.jsx';
import Navbar from '../Elements/Navbar.jsx';
import InviteUsersPanel from '../Elements/InviteUsersPanel.jsx';
import { DragDropContext } from 'react-dnd';
import { withRouter } from 'react-router';
import EditRankingsPage from './EditRankingsPage.jsx';
import CreateListPopupView from '../Elements/PopupViews/CreateListPopupView.jsx';
import Items from '../../models/Items.js'
import listServices from '../../services/listServices.js';
import userServices from '../../services/userServices.js';

class CreateListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {items: [], invitedUsers:[], i:0, rankingTitle:'', publicList: true, showPopup:false, errorMessage: ''};
  }

  addItem(itemTitle) {
    var items = this.state.items;
    var item = Items(itemTitle,'','');
    items.push(item);
    this.setState({
      items:items,
      errorMessage:''
    });
  }

  deleteItem(item) {
    var items = this.state.items;
    var index = items.indexOf(item);
    if (index > -1) {
      items.splice(index,1);
    }
    this.setState({items:items});
  }

  didChangeRankingTitle(rankingTitle) {
    this.setState({rankingTitle:rankingTitle});
  }

  createList(capacity, description) {
    const listTitle = this.state.rankingTitle;
    const items = this.state.items;
    const maxLength = capacity;
    const listDescription = description;
    var invitedUsers = this.state.invitedUsers.map(function(user) {
      return user.username;
    });
    const usersSharedWith = this.state.publicList ? [] : invitedUsers;
    listServices.createList(
        {
          title : listTitle,
          items : items,
          isPublic : this.state.publicList,
          maxLength : maxLength,
          description : listDescription,
          usersSharedWith : usersSharedWith

        }
      ).then((res) => {
        if (res.success){
              this.closePopup();
              // navigate to edit page for creator to submit a Ranking
              // uncomment when /rankings/edit/:listId isn't broken!!
              var pathname = '/rankings/edit/' + res.content._id;
              var data = res.content;
              this.props.router.push({
                pathname : pathname,
                state : { data }
              });
            } else {
              console.log("Error on submitOriginalRanking: ",res.err)
        }
      });

  }

  showCapacityPopup() {
    if (this.state.items.length === 0) {
      this.setState({
        errorMessage : 'You haven\'t added any items!'
      });
    } else {
      this.setState({
        showPopup:true,
        errorMessage:''
      });
    }
  }

  closePopup() {
    this.setState({showPopup:false});
  }

  changePrivacySetting() {
    var isPublic = this.state.publicList;
    this.setState({publicList:!isPublic});
  }

  updateInvitedUsers(invitedUsers) {
    this.setState({invitedUsers:invitedUsers});
  }

  render() {
    var has_error = this.state.errorMessage === '';
    const items = this.state.items;
    var lockImage = this.state.publicList ? "Unlock.svg" : "Lock.svg";
    var publicPrivateIcon = require('../../public/assets/'+ lockImage);
    var publicPrivateIconStyle = {
      width:"20px",
      height:"20px"
    }
    const publicPrivateIndicator = (
        <div className = "PublicPrivateIndicator">
          <h3>|</h3>
          <button onClick = {this.changePrivacySetting.bind(this)} style = {{background:"none"}}>
              <img src = {publicPrivateIcon} style = {publicPrivateIconStyle}/>
          </button>
          <h3>{this.state.publicList ? "Public" : "Private"}</h3>
        </div>
    );

		return (
      <div>
        {this.state.showPopup &&
            <CreateListPopupView
              onClose = {this.closePopup.bind(this)}
              title = {this.state.rankingTitle}
              createList = {this.createList.bind(this)}
              itemsCount = {items.length}
            />
        }
        {!this.state.publicList &&
          <InviteUsersPanel updateInvitedUsers = {this.updateInvitedUsers.bind(this)}/>
        }

        <RankingTitleForm placeholder={"Name of List"} didChangeRankingTitle = {this.didChangeRankingTitle.bind(this)} />
        {publicPrivateIndicator}
        <div className = "AddItemForm">
          <AddItemForm placeholder={"Enter a Suggestion"} addItem = {this.addItem.bind(this)} />
        </div>
        <div className = "CreateListOptionsList">
          <OptionsList  id={1} items={items} canEdit = {true}  deleteItem = {this.deleteItem.bind(this)}/>
        </div>
        {items && items.length > 0 &&
          <BottomRightButton onClick = {this.showCapacityPopup.bind(this)}
                             buttonColor = {"GREEN"}
                             buttonIcon = {"Check.svg"}/>
        }
        <div className="errorMessage">
          {this.state.errorMessage &&
            <p style = {{color:"red"}}>{this.state.errorMessage}</p>
          }
        </div>
      </div>
		);
	}
}

export default withRouter(DragDropContext(HTML5Backend)(CreateListPage));
