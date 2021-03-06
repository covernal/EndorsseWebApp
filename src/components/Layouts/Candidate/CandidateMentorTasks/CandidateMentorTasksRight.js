import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import CandidateMentorTasksTable from './CandidateMentorTasksTable';

class CandidateMentorTasksRight extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props) {
      return null;
    }

    let disabled = (this.props.isLoadingMore || !this.props.hasMoreTasks) ? 'disabled' : '';
    let spinnerClass = (this.props.isLoadingMore) ? 'fa fa-spinner fa-spin-custom' : 'fa fa-spinner fa-spin-custom hidden';
    return (
      <div className="col-md-8">
        <div className="card-box">
          <CandidateMentorTasksTable
            tasksData={this.props.tasksData}
            isInitTable={this.props.isInitTable}
          />
        </div>
        <div className="text-center">
          <div className="text-center">
            <button type="button" disabled={disabled} className="btn btn-default waves-effect w-md waves-light m-t-0 m-b-30" data-toggle="modal" data-target="#custom-width-modal" onClick={this.props.loadMoreTasks}><i className={spinnerClass} aria-hidden="true"></i> {(this.props.hasMoreTasks) ? 'Load More' : 'No More Task'}</button>
          </div>
        </div>
      </div>
    );
  }
}

export default CandidateMentorTasksRight;
