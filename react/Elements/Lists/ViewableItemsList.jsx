import React, { Component } from 'react';
import update from 'react/lib/update';
import StaticItemCard from '../Cards/StaticItemCard.jsx';
import { withRouter } from 'react-router';

class ViewableItemsList extends Component {
  constructor(props) {
		super(props);
		this.state = { items: props.items };
	}

  componentWillReceiveProps(props) {
    this.setState({items: props.items});
  }

	render() {
		const { items } = this.state;
		return (
        <div>
          {items.map((item, index) => {
            return (
              <StaticItemCard
                key={item.id}
                index={index}
                listId={this.props.id}
                item={item}
                canEdit = {false}
                showRankingNumber = {this.props.showRankingNumber}
              />
            );
          })}
      </div>
		);
  }
}

export default withRouter(ViewableItemsList);
