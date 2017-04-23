import React, { Component } from 'react';
import DraggableList from './DraggableList.jsx'
import { withRouter } from 'react-router';

class OptionsList extends DraggableList {
  render() {
    return (
      <DraggableList id={this.props.id}
                     items={this.props.items}
                     canEdit = {this.props.canEdit}
                     showRankingNumber = {false}
                     canDrop = {this.props.canDrop}
                     deleteItem = {this.props.deleteItem}/>
    );
  }

}

export default withRouter(OptionsList);
