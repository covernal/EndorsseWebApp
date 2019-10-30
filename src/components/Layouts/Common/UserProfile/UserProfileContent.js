import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import UserProfileLeft from './UserProfileLeft';
import UserProfileRight from './UserProfileRight';

class UserProfileContent extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="card-box">
            <div className="row">
              <UserProfileLeft
                updateUserProfile={this.props.updateUserProfile}
                userDetails={this.props.userDetails}
                isPublic={this.props.isPublic}
              />
              <UserProfileRight
                updateUserProfile={this.props.updateUserProfile}
                loadAllChallenges={this.props.loadAllChallenges}
                userDetails={this.props.userDetails}
                challengesData={this.props.challengesData}
                isInitTable={this.props.isInitTable}
                isPublic={this.props.isPublic}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UserProfileContent.propTypes = {
  updateUserProfile: PropTypes.func,
  userDetails: PropTypes.object,
  isPublic: PropTypes.bool.isRequired
};

export default UserProfileContent;
