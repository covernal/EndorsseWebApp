import React, {Component, PropTypes} from 'react';
import Cookie from 'react-cookie';
import JobApplicationModal from '../../../Widgets/EndorsseModal/JobApplicationModal';

class JobDetailsRight extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    let job = this.props.job;
    return (
      <div className="col-md-8">
        <div className="card-box">
          <div className="m-t-30">
            <h3>{job.title}</h3>
            <p className="m-t-20">{job.keyPoints}</p>
            <h4 className="m-t-30">About Us</h4>
            <p className="m-t-20">{job.aboutUs}</p>
            <h4 className="m-t-30">About the Role</h4>
            <p className="m-t-20">{job.aboutRole}</p>
            <h4 className="m-t-30">About You</h4>
            <p className="m-t-20">{job.aboutYou}</p>
            <h4 className="m-t-30">How to Apply</h4>
            <p className="m-t-20">{job.howToApply}</p>
            <h4 className="m-t-30">Additional Requirement</h4>
            <p className="m-t-20">{job.extraRequirements}</p>
            <JobApplicationModal 
              handleSubmit={this.props.handleSubmit} />
            {
              (Cookie.load('type') == "candidate") ?
              <button type="button" className="btn btn-primary waves-effect w-md waves-light m-t-20" data-toggle="modal" data-target="#custom-width-modal-job-application">Apply</button> :
              ''
            }            
          </div>
        </div>
      </div>
    );
  }
}

export default JobDetailsRight;
