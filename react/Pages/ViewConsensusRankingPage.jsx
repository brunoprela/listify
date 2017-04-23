import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import ViewableItemsList from '../Elements/Lists/ViewableItemsList.jsx';
import CommentsList from '../Elements/Lists/CommentsList.jsx';
import Navbar from '../Elements/Navbar.jsx';
import BottomRightButton from '../Elements/BottomRightButton.jsx';
import ConsensusRankingDescription from '../Elements/ConsensusRankingDescription.jsx';
import { withRouter } from 'react-router';
import Items from '../../models/Items.js'
import listServices from '../../services/listServices.js';
import userServices from '../../services/userServices.js';

//This page allows you to View a consensus ranking
class ViewConsensusRankingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {list:null, order:[], showComments: false, user : null};
    }

    componentWillMount() {

        var listId = this.props.params.listId;
        listServices.getListDataFromId(listId).then((res) => {
            var list = res.content.list;
            var capacity = list.maxLength;
            listServices.calculateOrdering(list._id).then((res) => {
                var order = res.content.order;
                var capped_order = order.slice(0, capacity);
                this.setState({list:list, order:capped_order});
            });

            listServices.getComments(listId).then((res) => {
              var comments = res.content.comments;
              this.setState({comments:comments});
            });


        });

        userServices.getCurrentUser()
            .then((res) => {
                this.setState({user : res.content.user});
            });
    }

    //returns null if there isn't one
    getSubmittedRankingId() {
        if (this.state.list === null) {
            return false;
        }
        var current_user = this.state.user;
        // var current_user = this.props.user;
        // find intersection of list.rankings and current_user.rankings
        var ranking_ids = this.state.list.rankings.filter(function(ranking) {
            return current_user.rankings.indexOf(ranking) != -1;
        });
        return ranking_ids.length > 0 ? ranking_ids[0] : null;
    }

    currentUserIsCreatorOfConsensus() {
        if (this.state.list === null) {
            return false;
        }
        var creator = this.state.list.creator;
        var current_user = this.state.user.username;
        if (creator === current_user) {
            return true;
        } else {
            return false;
        }
    }

    hasUserSubmittedThisRanking() {
      var already_submitted = this.getSubmittedRankingId() ? true : false;
      return already_submitted;
    }

    //lock consensus
    lockList() {
        if (this.state.list && !this.state.list.locked) {
            var listId = this.props.params.listId;
            listServices.lockList(listId).then((res) => {
                if (res.success) {
                    var list = this.state.list;
                    list.locked = true;
                    this.setState({list:list});
                } else {
                    console.log("unsuccessful lock");
                }
            });
        }
    }

    viewYourRanking() {
        var ranking_id = this.getSubmittedRankingId();
        var path = "rankings/"+ranking_id;
        this.props.router.push(path);
    }

    submitRanking() {
        var list_id = this.state.list._id;
        var path = "rankings/edit/"+list_id;
        this.props.router.push(path);
    }

    addNewItems() {
      var path = "lists/"+this.state.list._id+"/add_items";
      this.props.router.push(path);
    }

    showComments() {
      this.setState({showComments:!this.state.showComments});
    }

    render() {
        const list = this.state.list;
        const order = this.state.order;

        var buttonTitle = "";

        if (list && list.locked) {
            buttonTitle = "Voting Closed";
        } else {
            if (this.currentUserIsCreatorOfConsensus()) {
                buttonTitle = "Close Voting";
            }
        }

        var buttonColor = (list && list.locked) ? "#E52F4F" : "#66B110";
        var buttonStyle = {
            background:buttonColor
        }

        var showCommentButtonTitle = this.state.showComments ? "Hide Comments" : "Show Comments";

        var badgeIcon = require("../../public/assets/Badge.svg");
        var badgeStyle = {
          float:"left",
          marginTop:"30px",
          marginLeft:"5px"
        }

        return (
            <div>
                <div className = "EditRankingsPage">
                    {list &&
                    <div className = "EditRankingRankingList" >
                        <div className = "RankingTitleContainer">
                            <h1 className = "RankingTitle">{list.title}</h1>
                            <h1 className = "RankingLimit"> {" | Top "+list.maxLength}</h1>

                        </div>
                        <img src = {badgeIcon} style= {badgeStyle}/>
                        <div className = "TitleSecondRow">
                            <h2 className = "RankingAuthor">{"created by "+list.creator}</h2>
                            {this.currentUserIsCreatorOfConsensus() && <button className = "CloseVotingButton"
                                    onClick = {this.lockList.bind(this)}
                                    style = {buttonStyle}>{buttonTitle}</button>}
                        </div>
                        <ViewableItemsList id={1} items = {order} showRankingNumber = {true}/>
                    </div>
                    }
                </div>
                {list && list.description &&
                <div className = "ConsensusRankingDescription">
                    {list.description}
                </div>
                }
                  {list &&
                    <ConsensusRankingDescription viewYourRanking = {this.viewYourRanking.bind(this)}
                                                 addNewItems = {this.addNewItems.bind(this)}
                                                 lock = {list.locked}
                                                 title = {list.title}
                                                 votes = {list.rankings ? list.rankings.length : 0}
                                                 showAddItems = {this.currentUserIsCreatorOfConsensus()}
                                                 already_submitted = {this.hasUserSubmittedThisRanking()}
                                                 submitRanking = {this.submitRanking.bind(this)}
                    />
                  }


                {this.state.comments &&
                  <div className = "CommentsContainer">
                    <button className = "ShowCommentsButton" onClick = {this.showComments.bind(this)}>{showCommentButtonTitle}</button>
                    {this.state.showComments &&
                      <div>
                        <div className = "Separator"></div>
                        <h3>Comments</h3>
                        <CommentsList comments = {this.state.comments} author = {this.props.user.username}/>
                      </div>
                    }
                  </div>
                }




            </div>
        );
    }
}

export default withRouter(ViewConsensusRankingPage);
