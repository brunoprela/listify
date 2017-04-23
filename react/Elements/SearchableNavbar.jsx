import React, { Component } from 'react';
import { withRouter } from 'react-router';

class SearchableNavbar extends Component {
  constructor(props) {
		super(props);
		this.state = { searchText: ""};
	}

  handleChange(event) {
    var searchText = event.target.value;
    this.setState({searchText: event.target.value});
    //HANDLE AUTOCOMPLETE/ SEARCH FOR USERS
  }

  handleSubmit(event) {
    event.preventDefault();
    var searchString = this.state.searchText;
    this.props.searchLists(searchString);
  }

  render() {
    var profileImageStyle = {
      background:"#E52F4F",
      height:"20px",
      width:"20px",
      padding:"10px",
      borderRadius:"15px"
    }
    var style = {
      background:'none'
    }
    var ProfileImage = require('../../public/assets/ProfileIcon.svg');
    return (
      <div className = "SearchableNavbar">
        <button className = "ProfileButton" onClick = {this.props.profile} style = {style}>
          <img src ={ProfileImage} style = {profileImageStyle} />
        </button>
        <a href ="/"><h1 id = "listify-title">Listify</h1></a>
          <form onSubmit={this.handleSubmit.bind(this)} className = "SearchTextInput">
            <input type="text"
                   placeholder={"Search"}
                   onChange={this.handleChange.bind(this)}
            />
          </form>

      </div>
    )
  }
}

export default withRouter(SearchableNavbar);
