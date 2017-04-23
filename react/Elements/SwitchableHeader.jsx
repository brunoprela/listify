import React, { Component } from 'react';
import { withRouter } from 'react-router';

var HeaderSideEnum = {
    LEFT : "LEFT",
    CENTER : "CENTER",
    RIGHT : "RIGHT"
}

class SwitchableHeader extends Component {

  constructor(props) {
    super(props);
    this.state = { activeSide: HeaderSideEnum.LEFT,
                   leftTitle: this.props.leftTitle,
                   centerTitle: this.props.centerTitle,
                   rightTitle: this.props.rightTitle};
  }
  didSwitchHeader(headerSide) {
    this.setState({activeSide:headerSide})
    this.props.didSwitchHeader(headerSide);
  }

  render() {
    var leftHeaderStyle = {
      color: this.state.activeSide === HeaderSideEnum.LEFT ? "#4A4A4A" : "#C4BFBF"
    };
    var rightHeaderStyle = {
      color: this.state.activeSide === HeaderSideEnum.RIGHT ? "#4A4A4A" : "#C4BFBF"
    };

    var centerHeaderStyle = {
      color: this.state.activeSide === HeaderSideEnum.CENTER ? "#4A4A4A" : "#C4BFBF"
    };

		return(
      <div className = "SwitchableHeader">
      <a href="#"
         onClick={this.didSwitchHeader.bind(this, HeaderSideEnum.LEFT)}
         style = {leftHeaderStyle}>{this.state.leftTitle}</a>
       {this.props.centerTitle &&
         <a style = {{color:"#C4BFBF"}}> | </a>
        }
       {this.props.centerTitle &&
         <a href="#"
            onClick={this.didSwitchHeader.bind(this, HeaderSideEnum.CENTER)}
            style = {centerHeaderStyle}>{this.state.centerTitle}</a>
       }
       {this.props.rightTitle && 
          <a style = {{color:"#C4BFBF"}}> | </a>
        }
      <a href="#"
         onClick={this.didSwitchHeader.bind(this, HeaderSideEnum.RIGHT)}
         style = {rightHeaderStyle}>{this.state.rightTitle}</a>
       </div>
    );
  }
}

export default withRouter(SwitchableHeader);
