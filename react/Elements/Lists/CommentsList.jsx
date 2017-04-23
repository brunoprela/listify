import React, { Component } from 'react';
import update from 'react/lib/update';
import Comment from '../../../models/Comment.js'
import CommentCard from '../Cards/CommentCard.jsx';
import { withRouter } from 'react-router';

class CommentsList extends Component {
  constructor(props) {
		super(props);
		this.state = { comments: props.comments };
	}

  componentWillReceiveProps(props) {
    this.setState({comments: props.comments});
  }

	render() {
		const { comments } = this.props;
    console.log(comments);
		return (
        <div>
          {comments.map((comment, index) => {
            return (
              <CommentCard
                key={index}
                listId={this.props.id}
                comment={comment}
              />
            );
          })}
      </div>
		);
  }
}

export default withRouter(CommentsList);
