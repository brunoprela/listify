import React, { Component } from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import { withRouter } from 'react-router';
import CopyToClipboard from 'react-copy-to-clipboard';

class ConfirmAlertView extends Component {
  constructor(props) {
    super(props);
  }
  closeDialog() {
    this.props.onClose();
  }
  render() {
    var style = {backgroundColor:"black"}
    return <div>
        <ModalContainer onClose={this.props.onClose}>
          <ModalDialog onClose={this.props.onClose}>
            <h1>{this.props.title}</h1>
            {this.props.link && this.props.link.length > 0 &&
              <div>
              <p>Shareable link</p>
              <input type="text" value={this.props.link} readOnly="readonly" />
              </div>
            }
            <button onClick = {this.closeDialog.bind(this)}>Done</button>
            <CopyToClipboard text={this.props.link}>
              <button>Copy Link</button>
            </CopyToClipboard>
          </ModalDialog>
        </ModalContainer>
    </div>
  }
}

export default withRouter(ConfirmAlertView);
