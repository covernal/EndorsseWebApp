import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import EndorsseJobListItem from './EndorsseJobListItem.js';

class EndorsseJobList extends Component {
  render() {
    let loadingClass = (this.props.isInitTable || this.props.isInitTable == undefined) ? 'loading' : 'loading hidden';
    return (
      <div>
        {(this.props.items || []).map((item) => <EndorsseJobListItem key={`job_${item.id}`} job={item} employer={this.props.employer} />)}
        <div className={loadingClass}>
          <i className="fa fa-spinner fa-spin-custom" aria-hidden="true"></i>
        </div>        
      </div>);
  }  
}

export default EndorsseJobList;
