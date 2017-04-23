import React, { Component } from 'react';
import { withRouter } from 'react-router';


class StandbyItemCard extends Component {

  onClick(event) {
    event.preventDefault();
  }

  render() {
    var multiCardIcon = require("../../../public/assets/MultiCard.svg");
    var iconStyle = {
      float:"left",
      width:"45px",
      height:"45px",
      display:"inline-block",
      marginBottom:"0px",
      marginTop: "5px",
      marginLeft:"10px",
      marginRight:"10px"
    }

    var titleStyle = {
      float:"none",
      display:"inline-block",
      marginBottom:"0px"
    }
		return (
      <a href="#" onClick = {this.onClick.bind(this)}>
        <div className = "StandbyItemCard">

          <img style = {iconStyle} src = {multiCardIcon} />
          <p className = "ItemCardTitle">{"Drag & Drop Options"}</p>



          <p className = "ItemCardDescription">{"to update rankings"}</p>
        </div>
      </a>
    );
  }
}

export default withRouter(StandbyItemCard);
