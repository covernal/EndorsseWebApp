import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import EndorsseIntroCard from '../../../Widgets/EndorsseCard/EndorsseIntroCard';

class EmployerPublicProfileLeft extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    let user = this.props.user;
    return (
      <div className="col-lg-3 col-md-4">
        <EndorsseIntroCard isEmployer={true} image={user.avatar} name={user.name} description={user.description} link={user.link} location={user.location} />
      </div>
    );
  }
}

export default EmployerPublicProfileLeft;
