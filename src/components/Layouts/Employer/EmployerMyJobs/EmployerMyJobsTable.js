import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {DeleteJobModal} from '../../../Widgets/EndorsseModal';

class EmployerMyJobsTable extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    let loadingClass = (this.props.isInitTable || this.props.isInitTable == undefined) ? 'loading' : 'loading hidden';

    if (!this.props ||
    this.props.jobData == undefined) {
      return null;
    }

    let rows = [];
    this.props.jobData.forEach((job, index) => {
      let candidates = (job.candidates == 0) ? '-' : (<Link to={`/candidates/${job.id}`} className="table-action-btn text-primary">{job.candidates}</Link>);
      rows.push(
        <tr className="" key={'job' + index}>
          <td>{job.title}</td>
          <td>{job.created_at}</td>
          <td>{job.type}</td>
          <td>{job.location}</td>
          <td>
            <Link to={'/edit-job/' + job.id} className="table-action-btn h3"><i className="mdi mdi-pencil text-grey"></i></Link>
            <DeleteJobModal
              jobDetails={job}
              deleteJob={this.props.deleteJob}
            />
            <a
              className="table-action-btn h3"
              data-toggle="modal"
              data-target={`#custom-width-modal-delete-job-${job.id}`}
            >
              <i className="mdi mdi-delete text-grey"></i>
            </a>
          </td>
          <td>{candidates}</td>
        </tr>
      );
    });

    return (
      <div className="table-responsive">
        <table className="table table-hover mails m-0 table table-actions-bar">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Created At</th>
              <th>Type</th>
              <th>Location</th>
              <th>Action</th>
              <th>Candidates</th>
            </tr>
          </thead>

          <tbody>
            {rows}
          </tbody>
        </table>

        <div className={loadingClass}>
          <i className="fa fa-spinner fa-spin-custom" aria-hidden="true"></i>
        </div>
      </div>
    );
  }
}

EmployerMyJobsTable.contextTypes = {
  router: PropTypes.object.isRequired
};

EmployerMyJobsTable.propTypes = {
  jobData: PropTypes.array,
  isInitTable: PropTypes.bool,
  hasMoreJobs: PropTypes.bool
};

export default EmployerMyJobsTable;
