import React, { Component } from 'react';
import { withRouter } from 'react-router';


class ProfileDescription extends Component {

  render() {
		return (
      <div className = "DescriptionKey">
        <div className = "Description">
          <div className="LockedListMarker"></div>
          <p>Voting Closed</p>
        </div>
        <div className = "Description">
          <div className="ContributedMarker"></div>
          <p>Ranking Submitted</p>
        </div>
      </div>
    );
  }
}

export default withRouter(ProfileDescription);
