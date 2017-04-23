import React, { Component } from 'react';
import update from 'react/lib/update';
import ItemCard from '../Cards/ItemCard.jsx';
import StandbyItemCard from '../Cards/StandbyItemCard.jsx';
import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

class DraggableList extends Component {
  constructor(props) {
		super(props);
		this.state = { items: this.props.items };
	}

  componentWillReceiveProps(props) {
    this.setState({items : props.items});
  }

	addItem(item) {
    var items = this.state.items;
    items.push(item);
    this.setState({items:items});
	}

  deleteItem(item) {
    var items = this.state.items;
    var index = items.indexOf(item);
    if (index > -1) {
      items.splice(index,1);
    }
    this.props.deleteItem(item);
    this.setState({items:items});
  }

	removeItem(index) {
    var items = this.state.items;
    items.splice(index,1);
    this.setState({items:items});
	}

	moveItem(originalIndex, hoverIndex) {
    var items = this.state.items;
		const draggedItem = items[originalIndex];
    items.splice(originalIndex,1);
    items.splice(hoverIndex,0, draggedItem);
    this.setState({items:items});
	}

  updateItem(index,newItem) {
    var items = this.state.items;
    items[index] = newItem;
    this.setState({items:items});
  }

	render() {
		var { items } = this.state;
    if (!items) {
      items = [];
    };
		const { canDrop, isOver, connectDropTarget} = this.props;
		const isActive = canDrop && isOver;
    const defaultBackGroundColor = this.props.defaultBackGroundColor ? white : this.props.defaultBackGroundColor;
    const backgroundColor = isActive ? '#9B9B9B' : defaultBackGroundColor;
    const style = {
      backgroundColor: backgroundColor,
      height:"100%"
    }

		return connectDropTarget(
        <div style = {style}>
          {this.props.showStandbyCard && items.length < 1 &&
            <StandbyItemCard />
          }
          {items.map((item, index) => {
            return (
              <ItemCard
                key={item.id}
                index={index}
                listId={this.props.id}
                item={item}
                removeItem={this.removeItem.bind(this)}
                moveItem={this.moveItem.bind(this)}
                deleteItem={this.deleteItem.bind(this)}
                canEdit = {this.props.canEdit}
                showRankingNumber = {this.props.showRankingNumber}
                updateItem = {this.updateItem.bind(this)}
                canDrop = {this.props.canDrop}/>
            );
          })}
      </div>
		);
  }
}

const CardTarget = {
	drop(props, monitor, component ) {
    const cardTargetList = props;
		const sourceObj = monitor.getItem();
		if (cardTargetList.id !== sourceObj.listId ) {
      component.addItem(sourceObj.item);
    }
		return {listId: cardTargetList.id, targetCanDrop: cardTargetList.canDrop};
	},
  canDrop(props, monitor) {
    var canDrop = props.canDrop === undefined || props.canDrop === true;
    return canDrop;
  }
}

export default DropTarget("CARD", CardTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop()
}))(DraggableList);
