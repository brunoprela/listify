import React, { Component } from 'react';
import { withRouter } from 'react-router';


class StaticRankCard extends Component {

  //TODO: Implement this
  listIsLocked() {
    return false;
  }

  handleClick(event) {
    console.log(this.props);
    this.props.didClickOnRankingCard(this.props.rank);
    return true;
  }

  render() {
		const { rank } = this.props;

		return (
      <a href="#" onClick = {this.handleClick.bind(this)}>
        <div className = "StaticListCard" >
          {this.listIsLocked() &&
            <div className="CircleMarker"></div>
          }
          <div className = "StaticListCardFirstLineContainer">
            {this.props.showRankingNumber && <p className = "StaticListCardRanking">{this.props.index+1 + "."}</p>}
            <p className = "StaticListCardTitle">{rank.listTitle}</p>
          </div>
          <p className = "StaticListCardCreator">{"Created by "+rank.listCreatorUsername}</p>
        </div>
      </a>
    );
  }
}

export default withRouter(StaticRankCard);
