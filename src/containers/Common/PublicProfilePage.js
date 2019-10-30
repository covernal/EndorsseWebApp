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
import MenuConstants from '../../constants/MenuConstants';

import {CommonUserActions} from '../../actions';

class PublicProfilePage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.params.username,
      publicUserProfile: null,
      challengesData: [],
      serverError: null,
      isInitTable: true
    };

    this.loadAllChallenges = this.loadAllChallenges.bind(this);
  }

  componentDidMount() {
    this.props.getPublicUserProfile({
      username: this.state.username
    }, () => {
      let profileData = null;
      if(this.props.serverError == null) {
        profileData = this.props.publicUserProfile;
        if(profileData.user.attributes.type == "employer") {
          this.context.router.push('/employer-profile/' + this.state.username);
          return;
        }
        this.setState({
          challengesData: profileData.challenges
        });
      }
      this.setState({
        isInitTable: false,
        serverError: this.props.serverError,
        publicUserProfile: profileData
      });
    });
  }

  loadAllChallenges() {
    this.context.router.push('/challenges/' + this.props.params.username);
  }

  render() {
    if (!this.props) {
      return null;
    }else{
      let overlayClass = (this.state.sendingRequest) ? 'endorsse-overlay show' : 'endorsse-overlay';

      return (
        <div className="page-wrapper profile-page">
          <header id="topnav">
            <DashboardHeader isPublic={true} />
            {
              (Cookie.load('username') == undefined) ? (<DashboardSubHeader menuList={MenuConstants.common} />) : (<DashboardSubHeader />)
            }
          </header>

          <div className="wrapper">
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <div className="page-title-box">
                    <h4 className="page-title">User Profile</h4>
                  </div>

                  <UserProfileContent
                    userDetails={this.state.publicUserProfile}
                    loadAllChallenges={this.loadAllChallenges}
                    challengesData={this.state.challengesData}
                    isInitTable={this.state.isInitTable}
                    isPublic={true}
                  />
                </div>
              </div>
            </div>
          </div>

          <EndorsseOverlay
            overlayClass={overlayClass}
            message="Loading profile now, please wait..."
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

PublicProfilePage.contextTypes = {
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicProfilePage);
