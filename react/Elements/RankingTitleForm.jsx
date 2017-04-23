import React, { Component } from 'react';
import { withRouter } from 'react-router';

class RankingTitleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    return false;
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.props.didChangeRankingTitle(event.target.value);
  }

  render() {
    var placeholder = this.props.placeholder;
    var borderBottom = this.state.value.length > 0 ? 0 : "2px solid #C4BFBF";
    var style = {
      borderBottom: borderBottom
    }

    return (
      <div className = "RankingTitleForm">
        <form onSubmit={this.handleSubmit}>
          <input style = {style} type="text" placeholder = {placeholder} value={this.state.value} onChange={this.handleChange} />
        </form>
      </div>
    );
  }
}
export default withRouter(RankingTitleForm);
