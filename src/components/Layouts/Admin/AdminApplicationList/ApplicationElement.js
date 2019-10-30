import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class ApplicationElement extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    if (!this.props || this.props.data == undefined) {
      return null;
    }else{
      return (
        <div className="col-md-4">
          <div className="text-center card-box">
            <div className="clearfix"></div>
            <div className="member-card">
              <div className="thumb-xl member-thumb m-b-10 center-block">
                <img src={this.props.data.has('profileImageURL')?this.props.data.get('profileImageURL'):'/assets/images/defaultAvatar.jpg'} className="img-circle img-thumbnail" alt="profile-image" />
              </div>

              <div className="">
                <Link to={`/profile/${this.props.data.get('username')}`}><h4 className="m-b-5">{`${this.props.data.get('firstName')} ${this.props.data.get('lastName')}`}</h4></Link>
              </div>

              <ul className="social-links list-inline m-t-10">
                <li>
                  <a title="" data-placement="top" data-toggle="tooltip" className="tooltips" href={this.props.data.get('linkedInURL')} data-original-title="LinkedIn"><i className="fa fa-linkedin"></i></a>
                </li>
              </ul>

              <p className="text-muted font-13 m-t-10">
                {this.props.data.get('summary')}
              </p>

              {this.props.data.get('mentorApplicationStatus') == 'reviewing'?
                <div className="row">
                  <button type="button" className="btn btn-primary btn-rounded btn-sm waves-effect m-t-10 waves-light" onClick={() => this.props.approveApplication(this.props.data)}>Approve</button>&nbsp;
                  <button type="button" className="btn btn-danger btn-rounded btn-sm waves-effect m-t-10 waves-light" onClick={() => this.props.rejectApplication(this.props.data)}>Reject</button>
                </div>
                :
                this.props.data.get('mentorApplicationApproved')?
                  <div className="row">
                    <button type="button" className="btn btn-primary btn-rounded btn-sm waves-effect m-t-10 waves-light">Approved</button>
                  </div>
                :
                <div className="row">
                  <button type="button" className="btn btn-danger btn-rounded btn-sm waves-effect m-t-10 waves-light">Rejected</button>
                </div>
              }
            </div>
          </div>
        </div>
      );
    }
  }
}

ApplicationElement.propTypes = {
  data: PropTypes.object.isRequired
};

export default ApplicationElement;
