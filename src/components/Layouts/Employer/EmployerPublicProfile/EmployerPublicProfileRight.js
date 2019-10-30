import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import EmployerJobsList from '../../../Widgets/EndorsseJobList';

class EmployerPublicProfileRight extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    if(this.props.all) {
      let disabled = (this.props.isLoadingMore || !this.props.hasMoreJobs) ? 'disabled' : '';
      let spinnerClass = (this.props.isLoadingMore) ? 'fa fa-spinner fa-spin-custom' : 'fa fa-spinner fa-spin-custom hidden';
      return (
        <div className="col-md-8 col-lg-9">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <h4>All Jobs</h4>
              <EmployerJobsList items={this.props.jobs} employer={this.props.employer} isInitTable={this.props.isInitTable} />
              <hr/>
              <button type="button" disabled={disabled} className="btn btn-default waves-effect w-md waves-light" onClick={this.props.loadAllJobs}>
                <i className={spinnerClass} aria-hidden="true"></i> {(this.props.hasMoreJobs) ? 'Load More' : 'No More Job'}
              </button>
            </div>
          </div>
        </div>     
      );
    }

    return (
      <div className="col-md-8 col-lg-9">
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <h4>Recent Jobs</h4>
            <EmployerJobsList items={this.props.jobs} employer={this.props.employer} isInitTable={this.props.isInitTable} />
            <div className=" p-t-10">
              <p className="m-b-0"><Link onClick={this.props.loadAllJobs}><i>See all jobs from this employer</i></Link></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EmployerPublicProfileRight;
