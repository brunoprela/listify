import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import ViewableList from '../Elements/Lists/ViewableList.jsx';
import Navbar from '../Elements/Navbar.jsx';
import BottomRightButton from '../Elements/BottomRightButton.jsx';
import SwitchableHeader from '../Elements/SwitchableHeader.jsx';
import SearchableNavbar from '../Elements/SearchableNavbar.jsx';
import ProfileDescription from '../Elements/ProfileDescription.jsx';
import DescriptionKey from '../Elements/DescriptionKey.jsx';
import { withRouter } from 'react-router';
import listServices from '../../services/listServices.js';
import userServices from '../../services/userServices.js';

class ViewListsPage extends Component {
  constructor(props) {
    super(props);
    //LOAD COMPLETED CONSENSUSES ONTO COMPLETED RANKINGS
    this.state = {lists:[], user:null};
  }

  componentWillMount() {
    this.props.showNavbar(false);
    listServices.getTrendingLists().then((res) => {
      var lists = res.content.lists;

      this.setState({lists:lists});
    });

    userServices.getCurrentUser()
      .then((res) => {
          this.setState({
            user : res.content.user});
      });
  }

  componentWillUnmount() {
    this.props.showNavbar(true);
  }

  //navigate to create rankings page
  navigateToCreateRankingsPage() {
    this.props.router.push("lists/create");
  }

  didSwitchHeader(headerSide) {
    if (headerSide === "LEFT") {
      listServices.getTrendingLists().then((res) => {
        var lists = res.content.lists;
        this.setState({lists:lists});
      });
    } else {
      listServices.getMostRecentLists().then((res) => {
        console.log(res);
        var lists = res.content.lists;
        this.setState({lists:lists});
      });
    }
    //TODO: ISSUE GET REQUEST TO UPDATE LIST
  }

  //
  // determineCorrectPathForUser(list) {
  //   var current_user = this.props.user;
  //   var is_creator_of_list = current_user.lists.indexOf(list._id) > -1;
  //
  //   // find intersection of list.rankings and current_user.rankings
  //
  //   var ranking_ids = list.rankings.filter(function(ranking) {
  //     return current_user.rankings.indexOf(ranking) != -1;
  //   });
  //
  //   var has_submitted_ranking_for_list = ranking_ids.length > 0;
  //   if (has_submitted_ranking_for_list) {
  //     return "lists/"+list._id+"/consensus";
  //   } else {
  //     return "rankings/edit/"+list._id;
  //   }
  // }


  searchLists(searchString) {
    var path = "/lists/search/"+searchString;
    this.props.router.push(path);
  }

  didClickOnListCard(list) {
    var path = "lists/"+list._id+"/consensus";
    this.props.router.push(path);
  }

  render() {
    const lists = this.state.lists;
		return (
      <div>
        <SearchableNavbar
            logout = {this.props.logout}
            profile = {this.props.profile}
            searchLists = {this.searchLists.bind(this)}
            />
  			<div className = "EditRankingsPage">
          <div className = "EditRankingRankingList" >
            <SwitchableHeader leftTitle = "Trending"
                              rightTitle = "Most Recent"
                              didSwitchHeader = {this.didSwitchHeader.bind(this)}
            />
          <ViewableList id={1}
                        lists = {this.state.lists}
                        showRankingNumber = {false}
                        didClickOnListCard = {this.didClickOnListCard.bind(this)}
                        user = {this.state.user}
                        />
          </div>
      </div>
      {this.state.user &&
        <ProfileDescription user = {this.state.user}/>
      }
      <DescriptionKey />
      <BottomRightButton title = {"Create List"} onClick = {this.navigateToCreateRankingsPage.bind(this)}/>
    </div>
		);
	}
}

export default withRouter(ViewListsPage);
