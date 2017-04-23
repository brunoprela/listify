import React, { Component } from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import { withRouter } from 'react-router';

class CreateListPopupView extends Component {
  constructor(props) {
    super(props);
    this.state = {capacity : this.props.itemsCount, description:""};
  }
  createButtonClicked() {
    this.props.createList(this.state.capacity,this.state.description);
  }

  handleChange(event) {
    var capacity = event.target.value;
    this.setState({capacity: capacity});
  }

  typingDescription(event) {
    this.setState({description:event.target.value});
  }

  render() {
    var itemsCount = this.props.itemsCount;
    return (<div>
        <ModalContainer onClose={this.props.onClose}>
          <ModalDialog onClose={this.props.onClose}>
            <h1>{this.props.title}</h1>
              <div>
              <p>{"How many items do you want people to rank?"}</p>
              <input type="number"
                      name="capacity"
                      min="1" max={itemsCount}
                      value = {this.state.capacity}
                      onChange={this.handleChange.bind(this)}
              />
            <div>
              <textarea className = "DescriptionTextArea"
                        placeholder="Write Description (Optional)"
                        onChange={this.typingDescription.bind(this)}/>
              </div>
              </div>
            <button className = "PopupButton" onClick = {this.createButtonClicked.bind(this)}>Create</button>
          </ModalDialog>
        </ModalContainer>
    </div>);
  }
}

export default withRouter(CreateListPopupView);
