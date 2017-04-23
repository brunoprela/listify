import React, { Component } from 'react';
import { withRouter } from 'react-router';


class StaticListCard extends Component {
  
  render() {
		const { item } = this.props;

		return (
      <a href="#">
        <div className = "ItemCard">
          {this.props.showRankingNumber && <p className = "ItemCardRanking">{this.props.index+1 + "."}</p>}
          {item.photo &&
            <img className = "ItemCardImage" src = {item.photo}/>
          }
          <p className = "ItemCardTitle">{item.title}</p>
          <p className = "ItemCardDescription">{item.description}</p>
        </div>
      </a>
    );
  }
}

export default withRouter(StaticListCard);
