import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import RankingList from '../Elements/Lists/RankingList.jsx';
import OptionsList from '../Elements/Lists/OptionsList.jsx';
import CommentsList from '../Elements/Lists/CommentsList.jsx';
import AddItemForm from '../Elements/AddItemForm.jsx';
import { DragDropContext } from 'react-dnd';
import { withRouter } from 'react-router';
import ConfirmAlertView from '../Elements/ConfirmAlertView.jsx';
import CommentPopupView from '../Elements/PopupViews/CommentPopupView.jsx';
import BottomRightButton from '../Elements/BottomRightButton.jsx';
import listServices from '../../services/listServices.js';
import rankingServices from '../../services/rankingServices.js';
import Comment from '../../models/Comment.js';
import userServices from '../../services/userServices.js';


class EditRankingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: null,
      items: [],
      showCreateRankingConfirm : false,
      submission: [],
      comment : '',
      showComments : false,
      user : null,
      showStandbyCard : false
    }
  }

    componentWillMount() {
        // var request = this.props.rankingServices.loadEditPage(this.props.params.consensusID);
        // this.props.updateEditPage(request);

        userServices.getCurrentUser()
            .then((res) => {
              if (res.success) {
                var user = res.content.user;
                this.setState({user : user});
                listServices.getListDataFromId(this.props.params.listId).then((response) => {
                    if (response.success) {
                      var list = response.content.list;
                        this.setState({list:list});
                        // find intersection of list.rankings and current_user.rankings
                        var ranking_ids = list.rankings.filter(function(ranking) {
                          return user.rankings.indexOf(ranking) != -1;
                        });

                        if (ranking_ids && ranking_ids.length > 0) {

                            var ranking_id = ranking_ids[0];
                            rankingServices.getRankingById(ranking_id).then((res) => {
                              if (res.success) {
                                var ranking = res.content.ranking;
                                var order = ranking.order;
                                var order_ids = order.map((item) => {
                                  return item.id;
                                });
                                var availableItems = list.items.filter( function( item ) {
                                  return order_ids.indexOf( item.id ) < 0;
                                });

                                //showStandbyCard is set to true by default but that isn't necessary
                                //if the RankingsList is going to be populated
                                this.setState({submission:order,
                                               items:availableItems,
                                               showStandbyCard: order.length === 0});
                              }
                            });
                        } else {
                          //There is nothing in the RankingsList so show StandbyCard
                          this.setState({showStandbyCard:true, items: list.items});
                        }
                      } else {
                        console.log("error");
                      }


                    });
              }

            });
    }

    hasUserSubmittedThisRanking() {
        if (this.state.user === null || this.state.list === null) {
            return false;
        }
        // var current_user = this.props.user;

        var current_user = this.state.user;
        // find intersection of list.rankings and current_user.rankings
        var ranking_ids = this.state.list.rankings.filter(function(ranking) {
            return current_user.rankings.indexOf(ranking) != -1;
        });

        var user_has_submitted_this_ranking = ranking_ids.length >= 1 ? true : false;

        return user_has_submitted_this_ranking;
    }

    submitRanking() {
        var order = [];
        var listId = this.props.params.listId;
        var maxLength = this.state.list.maxLength;
        // var user = req.session.user.username;
        // var user_id = req.session.user._id;
        var comment = this.state.comment;
        var submission = this.state.submission;
        // description, id, photo, title
        this.state.submission.forEach(function(item, index) {
            var itemCopy = item;
            itemCopy.rank = index+1;
            order.push(itemCopy); // start indexing at 1
        });

        rankingServices.submitRanking(
            {
                order : order,
                list : listId,
                comment : comment,
                listTitle:this.state.list.title,
                listCreatorUsername:this.state.list.creator
            }
        ).then((response) => {
            if (response.success) {
                this.props.router.push("/");
            } else {
                console.log("failed to submit ranking.");
            }
        });

        //TODO : submit Ranking to the associated List
    }

    updateRanking() {
        var order = [];
        var listId = this.props.params.listId;
        // var user = req.session.user.username;
        // var user_id = req.session.user._id;
        var comment = this.state.comment;
        var submission = this.state.submission;
        // description, id, photo, title
        this.state.submission.forEach(function(item, index) {
            var itemCopy = item;
            itemCopy.rank = index+1;
            order.push(itemCopy); // start indexing at 1
        });

        listServices.getListDataFromId(this.props.params.listId).then((response) => {
            var listRankingIds = response.content.list.rankings;
            var current_user_rankings = this.state.user.rankings;

            var ranking_ids = listRankingIds.filter(function(ranking) {
                return current_user_rankings.indexOf(ranking) != -1;
            });

            rankingServices.updateRanking({
                ranking_id : ranking_ids[0],
                order : order,
                comment : comment
            }).then((res) => {
                if (res.success) {
                    this.props.router.push("/");
                } else {
                    console.log("failed to update ranking");
                }
            });
        });
    }


    showShareDialog() {
        this.setState({showCreateRankingConfirm: true})
    }

    closeShareDialog() {
        this.setState({showCreateRankingConfirm: false})
    }

    commentClicked() {
      if (!this.state.comment) {
        this.setState({showComments:true});
      }
    }

    closePopup() {
      this.setState({showComments:false});
    }

    comment(text) {
      this.closePopup();
      var comment = new Comment(text,this.props.user.username);
      this.setState({comment:comment});
    }

    render() {
      var hasCommented = this.state.comment && this.state.comment.text.length > 0;
      var commentButtonTitle = hasCommented > 0 ? "Commented Already" : "Comment";
      var updateOrSubmitRankingButtonFunction = this.hasUserSubmittedThisRanking() ? this.updateRanking.bind(this) : this.submitRanking.bind(this);
      var buttonTitle = this.hasUserSubmittedThisRanking() ? "Update" : "Submit";
      var list = this.state.list;
      return (
        <div>
          {
            this.state.showCreateRankingConfirm &&
            <ConfirmAlertView
              showModal = {this.state.showCreateRankingConfirm}
              onClose = {this.closeShareDialog.bind(this)}
              title = {"Share this ranking"}
            />
          }
          {this.state.showComments &&
              <CommentPopupView
                onClose = {this.closePopup.bind(this)}
                comment = {this.comment.bind(this)}
              />
          }
          <div className = "EditRankingsPage">
            {list &&
              <div className = "EditRankingRankingList" >
                <div className = "RankingTitleContainer">
                  <h1 className = "RankingTitle">{list.title}</h1>
                  <h1 className = "RankingLimit"> {" | Top "+list.maxLength}</h1>
                </div>
                <div className = "TitleSecondRow">
                  <h2 className = "RankingAuthor">{"created by "+list.creator}</h2>
                  <button className = "EditRankingCommentButton" onClick = {this.commentClicked.bind(this)}>{commentButtonTitle}</button>
                </div>
                <RankingList id={1}
                             items = {this.state.submission}
                             canEdit = {false}
                             showStandbyCard = {this.state.showStandbyCard}
                             maxLength = {list.maxLength}/>
               {this.state.comment &&
                 <div>
                   <div className = "Separator"></div>
                   <h3>Comments</h3>
                   <CommentsList comments = {[this.state.comment]}/>
                 </div>
               }

              </div>
            }
            <div className = "EditRankingOptionsList" >
              <h1 className = "OptionsListTitle"> Options</h1>
              {this.state.items && this.state.items.length > 0 &&
                <OptionsList  id={2}
                              items={this.state.items}
                              canEdit = {false}
                              defaultBackGroundColor = {"FAF9F9"}
                              canDrop = {true} />
              }
            </div>

          </div>
          <BottomRightButton
            onClick = {updateOrSubmitRankingButtonFunction}
            buttonColor = {"GREEN"}
            buttonIcon = {"Check.svg"}/>
        </div>
      );
    }

    finishEdittingRanking() {
        // console.log(this.state.order);
    }
}

export default withRouter(DragDropContext(HTML5Backend)(EditRankingsPage));
