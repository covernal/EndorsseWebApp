import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import cookie from 'react-cookie';

class EndorssePublicURL extends Component {
  render() {
    if (!this.props || this.props.profilename == undefined || this.props.type == undefined) {
      return null;
    }

    return (
      <div className="card-box">
        <div className="m-t-10">
          <h5>Your Public Endorsse Profile URL</h5>   
          <h3 className="text-primary">https://app.endorsse.com/profile/{this.props.profilename}</h3>
          <hr />            
          {
            (this.props.type == "employer") ?
            <p className="m-t-20">Share your Endorsse public profile to candidates and let them get screened by mentors tasks first to save your precious time and get quality applicants only.</p>
            :
            (
              (cookie.load('type') == 'candidate') ?
              <p className="m-t-20">Share your Endorsse public profile to recruiters and employers and let them know you have  completed tasks and been endorssed by industry recoginized mentors.</p> 
              :
              <p className="m-t-20">Share your Endorsse public profile to your social networks and let others know how many people you have advised and endorsed.</p> 
            )            
          } 
        </div>
      </div>
    );
  }
}

EndorssePublicURL.propTypes = {
  profilename: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default EndorssePublicURL;
