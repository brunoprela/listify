import React, { Component } from 'react';
import { withRouter } from 'react-router';


class RankingNavigationOptions extends Component {

  render() {
  		var is_unlocked = this.props.editRanking;

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
      <div className = "RankingNavigationOptions">
        <p>{"This was your ranking for this list"}</p>
        <button style = {greenButtonStyle} onClick = {this.props.viewConsensus}>View Consensus</button>
        {is_unlocked &&
          <button style = {redButtonStyle} onClick = {this.props.editRanking}>Edit Ranking
        </button>}
      </div>
    );
  }
}

export default withRouter(RankingNavigationOptions);
