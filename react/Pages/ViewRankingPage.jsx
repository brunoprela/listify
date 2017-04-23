import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import ViewableItemsList from '../Elements/Lists/ViewableItemsList.jsx';
import Navbar from '../Elements/Navbar.jsx';
import BottomRightButton from '../Elements/BottomRightButton.jsx';
import RankingNavigationOptions from '../Elements/RankingNavigationOptions.jsx';
import { withRouter } from 'react-router';
import Items from '../../models/Items.js'
import rankingServices from '../../services/rankingServices.js';
import listServices from '../../services/listServices.js';

const uuid = require('uuid');

//This page allows you to View a ranking
class ViewRankingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {ranking:null, is_locked : false};
  }

  componentWillMount() {
    var rankingId = this.props.params.id;

    rankingServices.getRankingById(rankingId).then((response) => {
      var ranking = response.content.ranking;
      if (response.success) {
        listServices.getListDataFromId(ranking.list).then((response2) => {
          this.setState({
            ranking : ranking,
            is_locked : response2.content.list.locked
          });
        });
      } else {
        console.log(response.err);
      }
    });

  }

  viewConsensus() {
    //GET LIST ID;
    var list_id = this.state.ranking.list;
    var path = "lists/"+list_id+"/consensus";
    this.props.router.push(path);
  }

  editRanking() {
    var path = "rankings/edit/"+this.state.ranking.list;
    this.props.router.push(path);
  }

  render() {
    if (this.state.list === '') {
      return null;
    }

    var ranking = this.state.ranking;
    var is_locked = this.state.is_locked;

    var editRankingButton = is_locked ? null : this.editRanking.bind(this);
    return (
      <div>
        <div className = "EditRankingsPage">
          {ranking &&
          <div className = "EditRankingRankingList" >


            <div className = "RankingTitleContainer">
              <h1 className = "RankingTitle">{ranking.listTitle}</h1>
            </div>
            <div className = "TitleSecondRow" id = "RankingPageSecondRow">
              <h2 className = "RankingAuthor">{"created by "+ranking.listCreatorUsername}</h2>
            </div>
            <ViewableItemsList id={1} items = {ranking.order} showRankingNumber = {true}/>
          </div>
        }
      </div>
      <RankingNavigationOptions
        editRanking = {editRankingButton}
        viewConsensus = {this.viewConsensus.bind(this)}/>
    </div>
    );
  }
}

export default withRouter(ViewRankingPage);
