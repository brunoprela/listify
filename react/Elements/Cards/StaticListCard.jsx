import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Vote from '../Vote.jsx'
import listServices from '../../../services/listServices.js';

class StaticListCard extends Component {

  constructor(props) {
    super(props);
    var currentUserVoteScore = this.calculateCurrentUserVoteScore(props.list,props.user);
    var hasContributedToList = this.hasContributedToList(props.list,props.user);
    this.state = {list : props.list,
                  currentUserVoteScore : currentUserVoteScore,
                  upvotes: props.list.upvotes,
                  hasContributedToList:hasContributedToList};
  }

  componentWillReceiveProps(props) {
    var currentUserVoteScore = this.calculateCurrentUserVoteScore(props.list,props.user);
    var hasContributedToList = this.hasContributedToList(props.list,props.user);
    this.state = {list : props.list,
                  currentUserVoteScore : currentUserVoteScore,
                  upvotes: props.list.upvotes,
                  hasContributedToList:hasContributedToList};
  }

  calculateCurrentUserVoteScore(list, user) {
    if (!user || !user._id) {
      return 0;
    }
    if (list.upvoters.indexOf(user._id) > -1) {
      return 1;
    } else if (list.downvoters.indexOf(user._id) > -1) {
      return -1;
    }
    return 0;
  }

  hasContributedToList(list, user) {
    if (!user || !user.rankings) {
      return false;
    }
    var ranking_ids = list.rankings.filter(function(ranking) {
        return user.rankings.indexOf(ranking) != -1;
    });

    var user_has_submitted_this_ranking = ranking_ids.length >= 1 ? true : false;

    return user_has_submitted_this_ranking;
  }

  handleClick(event) {
    this.props.didClickOnListCard(this.state.list);
    return true;
  }

  handleUpvote(event) {
      var listId = this.props.list._id;
      var currentUserVoteScore = this.state.currentUserVoteScore;
      var upvotes = this.state.upvotes;

      if (this.state.currentUserVoteScore ===  -1) {
          this.setState({currentUserVoteScore: currentUserVoteScore + 2, upvotes:upvotes+2 });
      } else if (this.state.currentUserVoteScore === 0) {
          this.setState({currentUserVoteScore: currentUserVoteScore + 1, upvotes:upvotes+1});
      } else if (this.state.currentUserVoteScore === 1) {
          //hitting upvote again returns currentUserVoteScore to 0
          this.setState({currentUserVoteScore : 0, upvotes:upvotes - 1});
      }
      listServices.upvote(listId).then((res) => {
      });
  }

  handleDownvote(event) {
      var listId = this.props.list._id;
      var currentUserVoteScore = this.state.currentUserVoteScore;
      var upvotes = this.state.upvotes;

      if (this.state.currentUserVoteScore ===  -1) {
          //hitting downvote again returns currentUserVoteScore to 0
          this.setState({currentUserVoteScore:0, upvotes:upvotes+1});
      } else if (this.state.currentUserVoteScore === 0) {
          this.setState({currentUserVoteScore: currentUserVoteScore - 1, upvotes:upvotes-1});
      } else if (this.state.currentUserVoteScore === 1) {
          //hitting upvote again returns currentUserVoteScore to 0
          this.setState({currentUserVoteScore : currentUserVoteScore - 2, upvotes:upvotes-2});
      }
      listServices.downvote(listId).then((res) => {
      });
  }

  render() {
		const { list } = this.props;
    //when user clicks on a list, you navigate him to EditRankingsPage if he hasn't voted yet
    // else you navigate him to ViewRankingPage
		return (
      <a href = "#" onClick = {this.handleClick.bind(this)}>
        <div className = "StaticListCard" >
          <Vote
              upvotes = {this.state.upvotes}
              currentUserVoteScore = {this.state.currentUserVoteScore}
              handleUpvote = {this.handleUpvote.bind(this)}
              handleDownvote = {this.handleDownvote.bind(this)}/>
          <div className = "StaticListCardFirstLineContainer">
            {this.props.showRankingNumber && <p className = "StaticListCardRanking">{this.props.index+1 + "."}</p>}
            <p className = "StaticListCardTitle">{list.title}</p>
          </div>
          <p className = "StaticListCardCreator">{"Created by "+list.creator}</p>
            {list.locked &&
              <div className="LockedListMarker"></div>
            }
            {this.state.hasContributedToList &&
              <div className="ContributedMarker"></div>
            }
        </div>
      </a>
    );
  }
}

export default withRouter(StaticListCard);
