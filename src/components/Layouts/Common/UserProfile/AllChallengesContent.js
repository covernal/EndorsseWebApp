import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import UserProfileLeft from './UserProfileLeft';
import UserChallengeList from './UserChallengeList';

class AllChallengesContent extends Component {
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
              <div className="col-md-8 col-lg-9">
                <div className="row">
                  <UserChallengeList
                    isPublic={this.props.isPublic}
                    challengesData={this.props.challengesData}
                    loadAllChallenges={this.props.loadAllChallenges}
                    isInitTable={this.props.isInitTable}
                    isLoadingMore={this.props.isLoadingMore}
                    hasMoreChallenges={this.props.hasMoreChallenges}                    
                    all={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AllChallengesContent.propTypes = {
  updateUserProfile: PropTypes.func,
  userDetails: PropTypes.object,
  isPublic: PropTypes.bool.isRequired
};

export default AllChallengesContent;
