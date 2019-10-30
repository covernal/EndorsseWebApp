import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import SweetAlert from 'sweetalert-react';
import Find from 'lodash/find';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import AllChallengesContent from '../../components/Layouts/Common/UserProfile/AllChallengesContent';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';
import MenuConstants from '../../constants/MenuConstants';

import {CommonUserActions} from '../../actions';

class PublicChallengesPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.params.username,
      publicUserProfile: null,
      serverError: null,
      allChallenges: [],
      skip: 0,
      isInitTable: true,
      hasMoreChallenges: true,
      isLoadingMore: false,      
      userType: '',
      userId: ''
    };

    this.loadMoreCallback = this.loadMoreCallback.bind(this);
    this.loadMoreChallenges = this.loadMoreChallenges.bind(this);
  }

  componentDidMount() {
    this.props.getPublicUserProfile({
      username: this.state.username
    }, () => {
      let profileData = null;
      if(this.props.serverError == null) {
        profileData = this.props.publicUserProfile;
        this.setState({
          userType: profileData.user.attributes.type,
          userId: profileData.user.id
        });
        this.props.loadUserChallenges({
          userType: profileData.user.attributes.type,
          userId: profileData.user.id,
          skip: this.state.skip,
          cb: () => this.loadMoreCallback()
        }); 
      }
      this.setState({
        serverError: this.props.serverError,
        publicUserProfile: profileData
      });     
    });
  }

  loadMoreChallenges() {
    this.setState({
      isLoadingMore: true
    }, () => {
      this.props.loadUserChallenges({
        userType: this.state.userType,
        userId: this.state.userId,
        skip: this.state.skip,
        cb: () => this.loadMoreCallback()
      });
    });
  }

  loadMoreCallback() {    
    if(this.props.serverError != null) {
      this.setState({
        serverError: (this.props.serverError.message == undefined) ? {message: "Internal server error."} : this.props.serverError,
        isInitTable: false,
        isLoadingMore: false
      });
      return;
    }

    if(this.props.userChallenges.length > 0){
      let limit = 0;
      this.props.userChallenges.forEach((challenge) => {
        let existObj = Find(this.state.allChallenges, (t) => {
          return t.id == challenge.id;
        });
        if(existObj == undefined) {
          this.state.allChallenges.push(challenge);
          limit++;
        }
      });
      this.setState({
        skip: this.state.skip + limit,
        allChallenges: this.state.allChallenges,
        isInitTable: false,
        isLoadingMore: false
      });
    }else{
      this.setState({
        hasMoreChallenges: false,
        isInitTable: false,
        isLoadingMore: false
      });
    }
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

                  <AllChallengesContent
                    userDetails={this.state.publicUserProfile}
                    challengesData={this.state.allChallenges}
                    loadAllChallenges={this.loadMoreChallenges}
                    isInitTable={this.state.isInitTable}
                    isLoadingMore={this.state.isLoadingMore}
                    hasMoreChallenges={this.state.hasMoreChallenges}
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

PublicChallengesPage.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    publicUserProfile: state.CommonUserReducer.userDetails,
    userChallenges: state.CommonUserReducer.userChallenges,
    serverError: state.CommonUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPublicUserProfile: (data, cb) => {
      dispatch(CommonUserActions.getPublicUserProfile(data, cb));
    },

    loadUserChallenges: (req, cb) => {
      dispatch(CommonUserActions.loadAllChallenges(req.userType, req.userId, req.skip, req.cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicChallengesPage);
