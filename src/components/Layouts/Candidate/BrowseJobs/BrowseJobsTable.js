import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import cookie from 'react-cookie';

class BrowseJobsTable extends Component {
  render() {
    let loadingClass = (this.props.isInitTable || this.props.isInitTable == undefined) ? 'loading' : 'loading hidden';
    let rows = [];

    if(loadingClass != 'loading') {
      this.props.items.forEach((item, index) => {
        let job = item.attributes;
        rows.push(
          <div className="p-t-10" key={'col_' + index}>
            {
              (cookie.load('username')) ?
              <h5 className="text-custom m-b-10"><Link to={`/job-details/${item.id}`}>{job.title}</Link></h5>
              :
              <h5 className="text-custom m-b-10">{job.title}</h5>
            }        
            <p className="m-b-10">By <i><Link to={`/employer-profile/${item.userDetails.username}`} className="text-muted">{item.userDetails.companyName}</Link></i></p>
            <p><b>{job.locationString}</b></p>
            <p className="text-muted font-13 m-b-0">
              {(job.keyPoints !== undefined && job.keyPoints.length > 300) ? job.keyPoints.substr(0, 300) + "..." : job.keyPoints}
            </p>        
            <br/>
          </div>
        );
      });
    }
    return (
      <div>
        {rows}
        <div className={loadingClass}>
          <i className="fa fa-spinner fa-spin-custom" aria-hidden="true"></i>
        </div>        
      </div>);
  }  
}

export default BrowseJobsTable;
