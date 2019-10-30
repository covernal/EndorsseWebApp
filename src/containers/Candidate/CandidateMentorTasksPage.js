import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import Find from 'lodash/find';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import CandidateMentorTasksRight from '../../components/Layouts/Candidate/CandidateMentorTasks/CandidateMentorTasksRight';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';
import EndorsseIntroCard from '../../components/Widgets/EndorsseCard/EndorsseIntroCard';

import {CandidateUserActions, CommonUserActions} from '../../actions';

class CandidateMentorTasksPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      location: '',
      username: Cookie.load('username'),
      sendingRequest: false,
      serverError: this.props.serverError,
      mentorData: null,
      mentorId: null,
      skip: 0,
      tasksData: [],
      hasMoreTasks: true,
      isLoadingMore: false,
      isInitTable: true
    };
    this.loadMoreCallback = this.loadMoreCallback.bind(this);
    this.loadMoreTasks = this.loadMoreTasks.bind(this);
  }

  componentDidMount() {
    this.props.getPublicUserProfile({
      username: this.props.params.username
    }, () => {    
      if(this.props.commonServerError == null) {
        let profileData = this.props.publicUserProfile;
        this.setState({
          mentorData: profileData.user.attributes,
          mentorId: profileData.user.id
        }, ()=> {
          this.props.loadCandidateMentorTasks({
            mentorId: this.state.mentorId,
            skip: this.state.skip,
            cb: () => this.loadMoreCallback()
          });          
        });
      }    
    });
  }

  loadMoreTasks() {
    this.setState({
      isLoadingMore: true
    }, () => {
      this.props.loadCandidateMentorTasks({
        mentorId: this.state.mentorId,
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
        isLoadingMore: false,
        sendingRequest: false
      });
      return;
    }
        
    if(this.props.candidateMentorTasks.length > 0){
      let limit = 0;
      this.props.candidateMentorTasks.forEach((task) => {
        let existObj = Find(this.state.tasksData, (t) => {
          return t.id == task.id;
        });
        if(existObj == undefined) {          
          limit++;
          this.state.tasksData.push(task);
          localStorage.setItem('tasks', JSON.stringify(this.state.tasksData));
        }
      });

      this.setState({
        skip: this.state.skip + limit,
        tasksData: this.state.tasksData,
        isInitTable: false,
        isLoadingMore: false,
        sendingRequest: false
      });
    }else{
      this.setState({
        hasMoreTasks: false,
        isInitTable: false,
        isLoadingMore: false,
        sendingRequest: false
      });
    }
  }

  render() {
    if (!this.props) {
      return null;
    }else{
      let overlayClass = (this.state.sendingRequest || this.state.mentorData === null) ? 'endorsse-overlay show' : 'endorsse-overlay';
      let mentor = this.state.mentorData;
      return (
        <div className="page-wrapper mentor-tasks-page">
          <header id="topnav">
            <DashboardHeader isPublic={false} />
            <DashboardSubHeader />
          </header>

          <div className="wrapper">
            <div className="container">

              <div className="row">
                <div className="col-sm-12">
                  <div className="page-title-box">
                    <h4 className="page-title">Browse Mentor's Tasks</h4>
                  </div>
                </div>
              </div>

              {
                (this.state.mentorData !== null) ?
                (
                  <div className="row">
                      <div className="col-md-4">
                        <EndorsseIntroCard title="Mentor" image={mentor.profileImageURL} name={mentor.firstName + ' ' + mentor.lastName} description={mentor.summary} link={mentor.linkedInURL} location={mentor.locationString} />
                      </div>
                      <CandidateMentorTasksRight 
                        hasMoreTasks={this.state.hasMoreTasks}
                        isLoadingMore={this.state.isLoadingMore}
                        tasksData={this.state.tasksData} 
                        isInitTable={this.state.isInitTable}
                        loadMoreTasks={this.loadMoreTasks}
                      />
                  </div>
                ) : ''
              }
            </div>
          </div>

          <EndorsseOverlay
            overlayClass={overlayClass}
            message="Please wait..."
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

CandidateMentorTasksPage.propTypes = {
  serverError: PropTypes.object
};


const mapStateToProps = (state) => {
  return {
    candidateMentorTasks: state.CandidateUserReducer.candidateMentorTasks,
    publicUserProfile: state.CommonUserReducer.userDetails,
    serverError: state.CandidateUserReducer.error,
    commonServerError: state.CommonUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadCandidateMentorTasks: (req) => {
      dispatch(CandidateUserActions.candidateLoadMentorTasks(req.mentorId, req.skip, req.cb));
    },
    getPublicUserProfile: (data, cb) => {
      dispatch(CommonUserActions.getPublicUserProfile(data, cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CandidateMentorTasksPage);