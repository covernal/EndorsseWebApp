import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import EmployerJobsList from '../../../Widgets/EndorsseJobList';

class EmployerJobsRight extends Component {
  render() {
    if (!this.props) {
      return null;
    }
    
    let disabled = (this.props.isLoadingMore || !this.props.hasMoreEmployerJobs) ? 'disabled' : '';
    let spinnerClass = (this.props.isLoadingMore) ? 'fa fa-spinner fa-spin-custom' : 'fa fa-spinner fa-spin-custom hidden';    
    return (
      <div className="col-md-8 col-lg-9">
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <h4>All Jobs</h4>
            <EmployerJobsList 
              items={this.props.jobs} 
              employer={this.props.employer}
              isInitTable={this.props.isInitTable}
            />
            <hr/>
            <button type="button" disabled={disabled} className="btn btn-default waves-effect w-md waves-light m-t-0 m-b-30" onClick={this.props.loadMoreEmployerJobs}><i className={spinnerClass}></i> {(this.props.hasMoreEmployerJobs) ? 'Load More' : 'No More Job'}</button>
          </div>
        </div>
      </div>
    );
  }
}

export default EmployerJobsRight;
