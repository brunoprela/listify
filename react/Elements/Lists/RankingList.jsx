import React, { Component } from 'react';
import DraggableList from './DraggableList.jsx'
import { withRouter } from 'react-router';

class Rankinglist extends DraggableList {
  componentWillReceiveProps(props) {
    console.log("Did receive props");
    console.log(props.items);
    this.setState({items : props.items});
  }
  render() {
    var items = this.state.items;
    if (!items) {
      items = [];
    };
    return (

      <DraggableList id={this.props.id}
                     items={items}
                     canEdit = {false}
                     showRankingNumber = {true}
                     showStandbyCard = {this.props.showStandbyCard}
                     canDrop = {this.props.maxLength && this.props.items.length < this.props.maxLength}/>
    );
  }

}

export default withRouter(Rankinglist);
