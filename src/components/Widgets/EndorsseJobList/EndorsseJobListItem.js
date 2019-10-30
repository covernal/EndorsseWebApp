import React, {Component, PropTypes} from 'react';
import cookie from 'react-cookie';
import {Link} from 'react-router';

class EndorsseJobListItem extends Component {
  constructor(props) {
    super(props);
  }  

  render() {
    if (!this.props) {
      return null;
    }

    let job = this.props.job.attributes;
    let employerName = (job.employerName != undefined) ? job.employerName : (this.props.employer.firstName + ' ' + this.props.employer.lastName);
    return (
      <div className="p-t-10">
        {
          (cookie.load('username')) ?
          <h5 className="text-custom m-b-5"><Link to={`/job-details/${this.props.job.id}`}>{job.title}</Link></h5>
          :
          <h5 className="text-custom m-b-5">{job.title}</h5>
        }        
        <p className="m-b-0">{employerName}</p>
        <p><b>{job.locationString}</b></p>
        <p className="text-muted font-13 m-b-0">
          {(job.keyPoints !== undefined && job.keyPoints.length > 300) ? job.keyPoints.substr(0, 300) + "..." : job.keyPoints}
        </p>        
        <br/>
      </div>
    );
  }
}

export default EndorsseJobListItem;