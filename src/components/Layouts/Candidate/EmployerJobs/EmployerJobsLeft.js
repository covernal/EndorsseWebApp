import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import EndorsseIntroCard from '../../../Widgets/EndorsseCard/EndorsseIntroCard';

class EmployerJobsLeft extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    let employer = this.props.employer;
    return (
      <div className="col-lg-3 col-md-4">
        <EndorsseIntroCard isEmployer={true} image={employer.profileImageURL} name={employer.companyName} description={employer.summary} link={employer.companyURL} location={employer.locationString} />
      </div>
    );
  }
}

EmployerJobsLeft.propTypes = {

};

export default EmployerJobsLeft;
