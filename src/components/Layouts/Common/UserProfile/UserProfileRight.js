import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import UserChallengeList from './UserChallengeList';
import UserExperienceList from './UserExperienceList';
import UserEducationList from './UserEducationList';
import EndorssePublicURL from '../../../Widgets/EndorssePublicURL';

class UserProfileRight extends Component {  
  render() {
    if (!this.props || this.props.userDetails == undefined || this.props.userDetails.user == undefined) {
      return null;
    }

    let userChallengeBlock = this.props.isPublic ?
      <div className="row">
        <UserChallengeList
          isPublic={this.props.isPublic}
          challengesData={this.props.challengesData}
          loadAllChallenges={this.props.loadAllChallenges}
          isInitTable={this.props.isInitTable}
        />
      </div> :
      <div className="row">
        <div className="col-md-12 col-sm-12">
          <EndorssePublicURL type="user" profilename={this.props.userDetails.user.attributes.username} />
        </div>
      </div>;
    let extraLineBreak = this.props.isPublic ? <hr /> : <div></div>;

    return (
      <div className="col-md-8 col-lg-9">
        {userChallengeBlock}
        {extraLineBreak}

        <div className="row">
          <UserExperienceList
            isPublic={this.props.isPublic}
            userDetails={this.props.userDetails}
            updateUserProfile={this.props.updateUserProfile}            
          />
        </div>

        <hr/>

        <div className="row">
          <UserEducationList
            isPublic={this.props.isPublic}
            userDetails={this.props.userDetails}
            updateUserProfile={this.props.updateUserProfile}
          />
        </div>
      </div>
    );
  }
}

UserProfileRight.propTypes = {
  updateUserProfile: PropTypes.func,
  userDetails: PropTypes.object,
  isPublic: PropTypes.bool.isRequired
};

export default UserProfileRight;
