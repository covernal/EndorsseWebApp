import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import EmployerMyJobsTable from './EmployerMyJobsTable';

class EmployerMyJobsContent extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    if (!this.props ||
    this.props.jobData == undefined) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="card-box">
            <EmployerMyJobsTable
              jobData={this.props.jobData}
              hasMoreJobs={this.props.hasMoreJobs}
              isInitTable={this.props.isInitTable}
              deleteJob={this.props.deleteJob}
            />
          </div>
        </div>
      </div>
    );
  }
}

EmployerMyJobsContent.contextTypes = {
  router: PropTypes.object.isRequired
};

EmployerMyJobsContent.propTypes = {
  jobData: PropTypes.array,
  hasMoreJobs: PropTypes.bool,
  isInitTable: PropTypes.bool
};

export default EmployerMyJobsContent;
