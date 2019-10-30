import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import JobDetailsBrief from './JobDetailsBrief';
import EndorsseIntroCard from '../../../Widgets/EndorsseCard/EndorsseIntroCard';

class JobDetailsLeft extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    let employer = this.props.employer;
    return (
      <div className="col-md-4">
        <JobDetailsBrief job={this.props.job} />
        <EndorsseIntroCard isEmployer={true} image={employer.profileImageURL} name={employer.companyName} description={employer.summary} link={employer.companyURL} location={employer.locationString} username={employer.username}  />
      </div>
    );
  }
}

JobDetailsLeft.propTypes = {

};

export default JobDetailsLeft;
