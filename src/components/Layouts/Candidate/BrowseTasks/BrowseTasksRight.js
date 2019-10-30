import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import BrowseTasksTable from './BrowseTasksTable';

class BrowseTasksRight extends Component {
  render() {
    if (!this.props) {
      return null;
    }
    
    let disabled = (this.props.isLoadingMore || !this.props.hasMoreTasks) ? 'disabled' : '';
    let spinnerClass = (this.props.isLoadingMore) ? 'fa fa-spinner fa-spin-custom' : 'fa fa-spinner fa-spin-custom hidden';    
    return (
      <div className="col-md-8 col-lg-9">
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <BrowseTasksTable 
              items={this.props.tasks} 
              isInitTable={this.props.isInitTable}
            />
            <hr/>
            <button type="button" disabled={disabled} className="btn btn-default waves-effect w-md waves-light m-t-0 m-b-30" onClick={this.props.loadMoreTasks}><i className={spinnerClass}></i> {(this.props.hasMoreTasks) ? 'Load More' : 'No More Task'}</button>
          </div>
        </div>
      </div>
    );
  }
}

export default BrowseTasksRight;
