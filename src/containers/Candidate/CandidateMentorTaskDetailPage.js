import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import Find from 'lodash/find';
import $ from 'jquery';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';
import CandidateMentorTaskDetailLeft from '../../components/Layouts/Candidate/CandidateMentorTaskDetail/CandidateMentorTaskDetailLeft';
import CandidateMentorTaskDetailRight from '../../components/Layouts/Candidate/CandidateMentorTaskDetail/CandidateMentorTaskDetailRight';

import {CandidateUserActions} from '../../actions';
import {CommonUserActions} from '../../actions';

class CandidateMentorTaskDetailPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      location: '',
      username: Cookie.load('username'),
      sendingRequest: false,
      serverError: null,
      commonServerError: null,
      taskData: null,
      mentorData: null
    };

    this.challengeTask = this.challengeTask.bind(this);
  }

  challengeTask() {
    let taskTemplateId = this.props.params.id;
    let templateCreatedBy = Cookie.load('id');
    
    $("#custom-width-modal-challenge-task").modal('hide');
    this.setState({
      sendingRequest: true
    }, () => {
      //checkIfCandidateAlreadyInChallenge
      this.props.checkIfCandidateAlreadyInChallenge({
        cb: () => {
          if(this.props.serverError != null) {
            this.setState({
              serverError: this.props.serverError,
              sendingRequest: false
            });
          }else {
            this.props.challengeTask({
              taskTemplateId: taskTemplateId,
              templateCreatedBy: templateCreatedBy,
              cb: () => {
                this.setState({
                  serverError: this.props.serverError,
                  sendingRequest: false
                });
                
                if(this.props.serverError == null) {
                  window.location = '/candidate-challenges';
                }
              }
            });            
          }
        }
      });
    });      
  }

  componentDidMount(){   
    this.setState({
      sendingRequest: true
    }, () => {
      this.props.getTaskTemplate({
        id: this.props.params.id,
        cb: () => {
          if(this.props.serverError != null) {
            this.setState({
              serverError: (typeof this.props.serverError.message === 'string') ? this.props.serverError : this.props.serverError.message,
              sendingRequest: false
            });
            return;
          }

          let task = this.props.candidateTaskTemplate.attributes;
          this.props.getUser({
            id: task.createdBy,
            cb: () => {
              if(this.props.commonServerError == null) {
                let mentor = this.props.userDetails.attributes;
                this.setState({
                  commonServerError: null,
                  taskData: task,
                  mentorData: mentor,
                  sendingRequest: false
                });              
              }else {
                this.setState({
                  commonServerError: this.props.commonServerError.message,
                  sendingRequest: false
                });
              }
            }
          });
        }
      });
    });
  }
 
  render() {
    if (!this.props) {
      return null;
    }else{
      let overlayClass = (this.state.sendingRequest) ? 'endorsse-overlay show' : 'endorsse-overlay';
      return (
        <div className="page-wrapper mentor-taskdetail-page">
          <header id="topnav">
            <DashboardHeader isPublic={false} />
            <DashboardSubHeader />
          </header>

          <div className="wrapper">
            <div className="container">

              <div className="row">
                <div className="col-sm-12">
                  <div className="page-title-box">
                    <h4 className="page-title">Task Detail</h4>
                  </div>
                </div>
              </div>

              <div className="row"> 
                <CandidateMentorTaskDetailLeft taskData={this.state.taskData} mentorData={this.state.mentorData} />
                <CandidateMentorTaskDetailRight taskData={this.state.taskData} challengeTask={this.challengeTask} />
              </div>

            </div>
          </div>

          <EndorsseOverlay
            overlayClass={overlayClass}
            message="Please wait..."
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

CandidateMentorTaskDetailPage.propTypes = {
  serverError: PropTypes.object
};


const mapStateToProps = (state) => {
  return {
    candidateTaskTemplate: state.CandidateUserReducer.candidateTaskTemplate,
    candidateAlreadyChallenged: state.CandidateUserReducer.candidateAlreadyChallenged,
    candidateTaskChallenged: state.CandidateUserReducer.candidateTaskChallenged,
    userDetails: state.CommonUserReducer.userDetails,
    commonServerError: state.CommonUserReducer.error,
    serverError: state.CandidateUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUser: (req) => {
      dispatch(CommonUserActions.getUser(req.id, req.cb));
    },    
    getTaskTemplate: (req) => {
      dispatch(CandidateUserActions.getTaskTemplate(req.id, req.cb));
    },    
    challengeTask: (req) => {
      dispatch(CandidateUserActions.challengeTask(req.taskTemplateId, req.templateCreatedBy, req.cb));
    },
    checkIfCandidateAlreadyInChallenge: (req) => {
      dispatch(CandidateUserActions.checkIfCandidateAlreadyInChallenge(req.cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CandidateMentorTaskDetailPage);