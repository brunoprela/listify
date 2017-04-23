import React, { Component } from 'react';
import update from 'react/lib/update';
import StaticListCard from '../Cards/StaticListCard.jsx';
import { withRouter } from 'react-router';

class ViewableList extends Component {
  constructor(props) {
		super(props);
		this.state = { lists: props.lists };
	}

  componentWillReceiveProps(props) {
    this.setState({lists: props.lists});
  }

	render() {

		const { lists } = this.state;
		return (
        <div>
          {lists.map((list, index) => {
            return (
              <StaticListCard
                key={list._id}
                index={index}
                listId={this.props.id}
                list={list}
                canEdit = {false}
                showRankingNumber = {this.props.showRankingNumber}
                didClickOnListCard = {this.props.didClickOnListCard}
                user = {this.props.user}/>
            );
          })}
      </div>
		);
  }
}

export default withRouter(ViewableList);
