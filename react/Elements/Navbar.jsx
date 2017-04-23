import React, { Component } from 'react';
import { withRouter, Link } from 'react-router';

class Navbar extends Component {
  render() {
    return (
      <div className = "Navbar">
        <a href ="/"><h1 id = "listify-title">Listify</h1></a>
      </div>
    )
  }
}

export default withRouter(Navbar);
