import React, { Component } from 'react';
import update from 'react/lib/update';
import StaticRankCard from '../Cards/StaticRankCard.jsx';
import { withRouter } from 'react-router';

class ViewableRankingsList extends Component {
  constructor(props) {
		super(props);
		this.state = { ranks: props.rankings };
	}

  componentWillReceiveProps(props) {
    this.setState({lists: props.rankings});
  }

	render() {
		const { rankings } = this.props;
		return (
        <div>
          {rankings.map((rank, index) => {
            return (
              <StaticRankCard
                key={rank._id}
                index={index}
                listId={this.props.id}
                rank={rank}
                canEdit = {false}
                showRankingNumber = {this.props.showRankingNumber}
                didClickOnRankingCard = {this.props.didClickOnRankingCard}/>
            );
          })}
      </div>
		);
  }
}

export default withRouter(ViewableRankingsList);
