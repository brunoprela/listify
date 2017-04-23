import React, { Component } from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import { withRouter } from 'react-router';


//REQUIRES PARENT CLASS TO HAVE
//  -comment(comment) method
//  -closePopup()
/*
{
  this.state.showPopup &&
  <CommentPopupView
    onClose = {this.closePopup.bind(this)}
    comment = {this.comment.bind(this)}
  />
}
*/

class CommentPopupView extends Component {
  constructor(props) {
    super(props);
    this.state = {commentText : ''}
  }
  commentButtonClicked(comment) {
    var comment = this.state.commentText;
    this.props.comment(comment);
  }

  handleChange(event) {
    var commentText = event.target.value;
    this.setState({commentText: commentText});
  }

  render() {
    return <div>
        <ModalContainer onClose={this.props.onClose}>
          <ModalDialog onClose={this.props.onClose}>
            <textarea className = "CommentTextArea" placeholder="Write your comment" onChange={this.handleChange.bind(this)}/>
            <button className = "PopupButton" onClick = {this.commentButtonClicked.bind(this)}>Comment</button>
          </ModalDialog>
        </ModalContainer>
    </div>
  }
}

export default withRouter(CommentPopupView);
