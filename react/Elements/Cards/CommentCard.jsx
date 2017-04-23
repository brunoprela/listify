import React, { Component } from 'react';
import { withRouter } from 'react-router';


class CommentCard extends Component {

  render() {
		const { comment} = this.props;
    console.log(comment);

		return (
      <a href="#">
        <div className = "CommentCard">
          <p className = "CommentCardTitle">{comment.text}</p>
          <p className = "CommentCardDescription">{"commented by "+comment.username}</p>
        </div>
      </a>
    );
  }
}

export default withRouter(CommentCard);
