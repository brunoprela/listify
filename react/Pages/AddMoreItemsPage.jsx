import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import OptionsList from '../Elements/Lists/OptionsList.jsx';
import AddItemForm from '../Elements/AddItemForm.jsx';
import BottomRightButton from '../Elements/BottomRightButton.jsx';
import Navbar from '../Elements/Navbar.jsx';
import { DragDropContext } from 'react-dnd';
import { withRouter } from 'react-router';
import Items from '../../models/Items.js'
import listServices from '../../services/listServices.js';
import userServices from '../../services/userServices.js';

class AddMoreItemsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {newItems: [], list:null};
  }

  componentWillMount() {
    listServices.getListDataFromId(this.props.params.listId).then((res) => {
      this.setState({list:res.content.list});
    });
  }

  addItem(itemTitle) {
    var newItems = this.state.newItems;
    var item = Items(itemTitle,'','');
    newItems.push(item);
    this.setState({newItems:newItems});
  }

  deleteItem(item) {
    var items = this.state.newItems;
    var index = items.indexOf(item);
    if (index > -1) {
      items.splice(index,1);
    }
    this.setState({items:items});
  }

  updateList() {
    listServices.addMoreItems(this.state.list._id, this.state.newItems).then((res) => {
      console.log(res);
      this.props.router.push("/");
    });
  }

  render() {
    const items = this.state.newItems;
		return (
      <div>
        {this.state.list &&
          <div className = "RankingTitleContainer">
              <h1 className = "RankingTitle">{this.state.list.title}</h1>
              <h1 className = "RankingLimit"> {" | Add More Items"}</h1>
          </div>
        }
        <div className = "AddItemForm">
          <AddItemForm placeholder={"Enter a Suggestion"} addItem = {this.addItem.bind(this)} />
        </div>
        <div className = "CreateListOptionsList">
          <OptionsList  id={1} items={items} canEdit = {true} deleteItem = {this.deleteItem.bind(this)}/>
        </div>
        {items && items.length > 0 &&
          <BottomRightButton onClick = {this.updateList.bind(this)}/>
        }
      </div>
		);
	}
}

export default withRouter(DragDropContext(HTML5Backend)(AddMoreItemsPage));
