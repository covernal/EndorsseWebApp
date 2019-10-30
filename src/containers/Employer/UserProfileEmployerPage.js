import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import _ from 'lodash';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import UserProfileEmployerLeft from '../../components/Layouts/Employer/UserProfileEmployer/UserProfileEmployerLeft';
import UserProfileEmployerRight from '../../components/Layouts/Employer/UserProfileEmployer/UserProfileEmployerRight';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';

import {CommonUserActions} from '../../actions';
import {EmployerUserActions} from '../../actions';

class UserProfileEmployerPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      username: Cookie.load('username'),
      sendingRequest: false,
      profileData: {},
      contactData: {}
    };

    this.updateEmployerProfile = this.updateEmployerProfile.bind(this);
    this.updateContactData = this.updateContactData.bind(this);
  }

  componentDidMount() {
    this.setState({
      sendingRequest: true,
      updating: false
    }, () => {
      this.props.getUser({
        id: Cookie.load('id'),
        cb: () => {
          if(this.props.commonServerError != null) {
            this.setState({
              commonServerError: (typeof this.props.commonServerError.message === 'string') ? this.props.commonServerError : this.props.commonServerError.message,
              sendingRequest: false
            });
            return;
          }        

          let employer = this.props.userDetails.attributes;
          this.setState({
            commonServerError: null,
            sendingRequest: false,
            contactData: {
              firstName: employer.firstName,
              lastName: employer.lastName,
              contactNumber: employer.contactNumber
            },
            profileData: {
              profileImageURL: employer.profileImageURL,
              companyName: employer.companyName,
              locationString: employer.locationString,
              lat: employer.locationGeoPoint.latitude,
              lon: employer.locationGeoPoint.longitude,
              summary: employer.summary,
              companyURL: employer.companyURL
            }
          });
        }
      });
    });
  }

  updateEmployerProfile(data, cb){
    this.setState({
      sendingRequest: true,
      updating: true      
    }, () => {
      this.props.updateEmployerProfile({
        data: data,
        cb: () => {
          if(cb != undefined) {
            cb();
          }

          this.setState({
            sendingRequest: false,
            updating: false,
            serverError: this.props.serverError
          });

          if(this.props.serverError != null) {      
            return;
          } 

          let employer = this.props.employerDetails;
          _.map(data, (value, key) => {
            this.state.profileData[key] = value;
          });
        }
      });
    });
  }

  updateContactData(data, cb){
    this.setState({
      contactData: data
    });
  }

  render() {
    if (!this.props) {
      return null;
    }else{
      let overlayClass = (this.state.sendingRequest) ? 'endorsse-overlay show' : 'endorsse-overlay';

      return (
        <div className="page-wrapper profile-page">
          <header id="topnav">
            <DashboardHeader isPublic={false} />
            <DashboardSubHeader />
          </header>

          <div className="wrapper">
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <div className="page-title-box">
                    <h4 className="page-title">My Profile</h4>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="card-box">
                    <div className="row">
                      <UserProfileEmployerLeft
                        updateEmployerProfile={this.updateEmployerProfile}
                        profileData={this.state.profileData}
                      />
                      <UserProfileEmployerRight
                        updateEmployerProfile={this.updateEmployerProfile}
                        companyName={this.state.username}
                        contactData={this.state.contactData}                      
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <EndorsseOverlay
            overlayClass={overlayClass}
            message={(this.state.updating == true) ? "Updating your profile now, please wait..." : "Loading now, please wait..."}
          />

          <SweetAlert
            show={this.state.serverError != null || this.state.commonServerError != null}
            type="error"
            title="Oops..."
            text={(this.state.serverError != null) ? this.state.serverError.message : ((this.state.commonServerError != null) ? this.state.commonServerError.message : '')}
            onConfirm={()=>this.setState({serverError: null, commonServerError: null})}
          />

          <DashboardFooter />
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.CommonUserReducer.userDetails,
    employerDetails: state.EmployerUserReducer.employerDetails,
    serverError: state.EmployerUserReducer.error,
    commonServerError: state.CommonUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUser: (req) => {
      dispatch(CommonUserActions.getUser(req.id, req.cb));
    }, 

    updateEmployerProfile: (req) => {
      dispatch(EmployerUserActions.updateEmployerProfile(req.data, req.cb));
    }    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileEmployerPage);
