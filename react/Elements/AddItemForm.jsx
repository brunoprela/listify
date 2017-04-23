import React, { Component } from 'react';
import { withRouter } from 'react-router';

class AddItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    const title = this.state.value;
    if (title.length > 0){
      this.props.addItem(title);
      this.setState({value: ''});
    }
  }

  render() {
    var placeholder = this.props.placeholder;
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" placeholder = {placeholder} value={this.state.value} onChange={this.handleChange} />
        <input id = "AddButton" type="submit" value="Add" />
      </form>
    );
  }
}
export default withRouter(AddItemForm);
