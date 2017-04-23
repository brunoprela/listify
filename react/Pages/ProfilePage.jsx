import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import ViewableList from '../Elements/Lists/ViewableList.jsx';
import ViewableRankingsList from '../Elements/Lists/ViewableRankingsList.jsx';
import Navbar from '../Elements/Navbar.jsx';
import BottomRightButton from '../Elements/BottomRightButton.jsx';
import SwitchableHeader from '../Elements/SwitchableHeader.jsx';
import ProfileDescription from '../Elements/ProfileDescription.jsx';
import { withRouter } from 'react-router';
import listServices from '../../services/listServices.js';
import userServices from '../../services/userServices.js';
import rankingServices from '../../services/rankingServices.js';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {lists:[],rankings:[], invitedLists:[],unseenInvites:0, headerSide: "LEFT"};
  }

  componentWillMount() {
    this.getInvitedLists();
    rankingServices.getUserRankings(this.props.user._id).then((res) => {
      var rankings = res.content.rankings;
      this.setState({headerSide:"LEFT", rankings:rankings});
    });
  }

  getInvitedLists() {
    listServices.getInvitedLists(this.props.user.username).then((res) => {
      var invitedLists = res.content.lists;
      var lastViewdInvitationsDate = this.props.user.last_viewed_invitations_date;
      var unseenInvites = invitedLists.reduce(function(i,list) {
        return i + (new Date(list.createdAt).getTime() > new Date(lastViewdInvitationsDate).getTime());
      },0);
      this.setState({invitedLists:res.content.lists, unseenInvites:unseenInvites});
    });
  }

  invitedAfterLastView(list) {
    return list.createdAt > this.props.user.last_viewed_invitations_date;
  }

  //navigate to create rankings page
  navigateToCreateRankingsPage() {
    this.props.router.push("lists/create");
  }

  didSwitchHeader(headerSide) {
    if (headerSide === "LEFT") {
      rankingServices.getUserRankings(this.props.user._id).then((res) => {
        var rankings = res.content.rankings;
        console.log(rankings);
        this.setState({headerSide:"LEFT", rankings:rankings});
      });
    } else if (headerSide === "CENTER") {
      listServices.getUserLists(this.props.user._id).then( (res) => {
        this.setState({headerSide:"CENTER", lists:res.content.lists});
      });

    }
    else {
      this.setState({headerSide:"RIGHT"});
      userServices.updateLastViewedInvitationsDate().then((res) => {
        this.setState({unseenInvites:0});
      });

      console.log("fetch lists you're invited to");
    }
    //TODO: ISSUE GET REQUEST TO UPDATE LIST
  }

  determineCorrectPathForUser(list) {
    var current_user = this.props.user;
    var is_creator_of_list = current_user.lists.indexOf(list._id) > -1;

    // find intersection of list.rankings and current_user.rankings
    var ranking_ids = list.rankings.filter(function(ranking) {
      return current_user.rankings.indexOf(ranking) != -1;
    });
    var has_submitted_ranking_for_list = ranking_ids.length > 0;
    if (has_submitted_ranking_for_list) {
      return "rankings/"+ranking_ids[0];
    } else {
      return "rankings/edit/"+list._id;
    }
  }

  didClickOnListCard(list) {
    var path = this.determineCorrectPathForUser(list);
    this.props.router.push(path);
  }

  didClickOnRankingCard(ranking) {
    var path = "rankings/"+ranking._id;
    this.props.router.push(path);
  }

  render() {
    const lists = this.state.lists;
    const invitedLists = this.state.invitedLists;
    const rankings = this.state.rankings;
		return (
      <div>
  			<div className = "EditRankingsPage">
          <div className = "EditRankingRankingList" >
            <div className = "RankingTitleContainer">
              <SwitchableHeader leftTitle = "Your Rankings"
                                centerTitle = "Your Lists"
                                rightTitle = "Lists Invited To"
                                didSwitchHeader = {this.didSwitchHeader.bind(this)}
              />
            {this.state.unseenInvites > 0 &&
              <h2 className = "InviteNumber">{"("+this.state.unseenInvites+")"}</h2>
            }
            </div>
            {this.state.headerSide === "LEFT" && rankings &&
              <ViewableRankingsList id={1}
                                    rankings = {rankings}
                                    showRankingNumber = {false}
                                    didClickOnRankingCard = {this.didClickOnRankingCard.bind(this)}/>
            }
            {this.state.headerSide !== "LEFT" &&
              <ViewableList id={1}
                            lists = {this.state.headerSide === "CENTER" ? lists : invitedLists}
                            showRankingNumber = {false}
                            didClickOnListCard = {this.didClickOnListCard.bind(this)}
                            user = {this.props.user}
                            />
            }
          </div>
      </div>
      <ProfileDescription user = {this.props.user}/>
      <button className = "Logout" onClick = {this.props.logout}>Logout</button>
      <BottomRightButton title = {"Create Ranking"} onClick = {this.navigateToCreateRankingsPage.bind(this)}/>
    </div>
		);
	}
}

export default withRouter(ProfilePage);
