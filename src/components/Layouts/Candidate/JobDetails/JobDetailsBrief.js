import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import moment from 'moment';

class JobDetailsBrief extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    let job = this.props.job;
    return (
      <div className="card-box">
        <div className="table-responsive">
          <table className="table table-bordered m-b-0">
            <tbody>
              <tr>
                <th scope="row">Type:</th>
                <td>{job.type}</td>
              </tr>
              <tr>
                <th scope="row">Location: </th>
                <td>{job.locationString}</td>
              </tr>
              <tr>
                <th scope="row">Created:</th>
                <td>{moment(job.createdAt).fromNow()}</td>
              </tr>                            
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

JobDetailsBrief.propTypes = {

};

export default JobDetailsBrief;