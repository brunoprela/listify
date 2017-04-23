import React, { Component } from 'react';
import { withRouter } from 'react-router';


class ConsensusRankingDescription extends Component {

  render() {
    var isLocked = this.props.lock;
    var description = "This is the consensus ranking for "+ this.props.title +" according to "+this.props.votes+" votes.";
    var buttonText = this.props.already_submitted ? "View Your Ranking" : "Submit a Ranking";

    var viewOrSubmitRankingFunction = null;
    if (this.props.already_submitted) {
      viewOrSubmitRankingFunction = this.props.viewYourRanking;
    } else {
      if (!isLocked) {
        viewOrSubmitRankingFunction = this.props.submitRanking;
      }
    }

    if (isLocked) {
      description += " Voting has finished for this list."
    }

    var GREEN = "#66B110";
    var RED = "#E52F4F";
    var greenButtonStyle = {
      height:"20px",
      background:GREEN,
      marginRight:"5px"
    }

    var redButtonStyle = {
      height:"20px",
      background:RED,
      marginRight:"5px"
    }

		return (
      <div className = "ConsensusRankingDescription">
        <p>{description}</p>
        {viewOrSubmitRankingFunction &&
          <button style = {greenButtonStyle} onClick = {viewOrSubmitRankingFunction}>{buttonText}</button>
        }
        {this.props.showAddItems && !isLocked &&
          <button style = {redButtonStyle} onClick = {this.props.addNewItems}>Add New Items</button>
        }
      </div>
    );
  }
}

export default withRouter(ConsensusRankingDescription);
