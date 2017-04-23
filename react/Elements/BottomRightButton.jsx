import React, { Component } from 'react';
import { withRouter } from 'react-router';

class BottomRightButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const buttonColorOption = this.props.buttonColor ? this.props.buttonColor : "GREEN";
    const buttonIcon = this.props.buttonIcon ? this.props.buttonIcon : 'Plus.svg';
    const buttonColor = buttonColorOption === "RED" ? "#E52F4F" : "#66B110";
    const buttonImage =  require('../../public/assets/'+buttonIcon);
    const style = {   position: 'fixed',
                      bottom: '25px',
                      right: '25px',
                      borderRadius: '50%',
                      width:'70px',
                      height:'70px',
                      background:  buttonColor,
                      color:'white',
                      border: 'none'
                  }
    return (
      <button style = {style} className="BottomRightButton" onClick={this.props.onClick.bind(null)}>
        <img src = {buttonImage}/>
      </button>
    );
  }
}
export default withRouter(BottomRightButton);
