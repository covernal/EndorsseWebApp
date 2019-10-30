import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import UserProfileContent from '../../components/Layouts/Common/UserProfile/UserProfileContent';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';

import {CommonUserActions} from '../../actions';

class MyProfilePage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      username: Cookie.load('username'),
      sendingRequest: false,
      serverError: null
    };

    this.updateUserProfile = this.updateUserProfile.bind(this);
  }

  componentDidMount() {
    this.props.getPublicUserProfile({
      username: this.state.username
    }, () => {
      this.setState({
        serverError: this.props.serverError
      });

      if(this.props.serverError == null) {
        if(this.props.publicUserProfile.user.attributes.type == "employer") {
          this.context.router.push('/employer-profile-edit');
          return;
        }
      }
    });
  }

  updateUserProfile(data, cb){
    this.setState({
      sendingRequest: true
    }, () => {
      this.props.updateUserProfile(data, () => {
        if(cb != undefined) {
          cb();
        }

        if(this.props.serverError != null) {
          this.setState({
            serverError: this.props.serverError,
            sendingRequest: false
          });
          return;
        }

        this.props.getPublicUserProfile({
          username: this.state.username
        }, () => {
          this.setState({
            serverError: this.props.serverError,
            sendingRequest: false
          });
        });
      });
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
                  <UserProfileContent
                    updateUserProfile={this.updateUserProfile}
                    userDetails={this.props.publicUserProfile}
                    isPublic={false}
                  />
                </div>
              </div>
            </div>
          </div>

          <EndorsseOverlay
            overlayClass={overlayClass}
            message="Updating your profile now, please wait..."
          />

          <SweetAlert
            show={this.state.serverError != null}
            type="error"
            title="Oops..."
            text={(this.state.serverError != null) ? this.state.serverError.message : ''}
            onConfirm={()=>this.setState({serverError: null})}
          />

          <DashboardFooter />
        </div>
      );
    }
  }
}

MyProfilePage.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    publicUserProfile: state.CommonUserReducer.userDetails,
    serverError: state.CommonUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPublicUserProfile: (data, cb) => {
      dispatch(CommonUserActions.getPublicUserProfile(data, cb));
    },

    updateUserProfile: (data, cb) => {
      dispatch(CommonUserActions.userUpdate(data, cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfilePage);
