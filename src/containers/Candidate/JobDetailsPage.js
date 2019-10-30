import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import Find from 'lodash/find';
import $ from 'jquery';
import Parse from 'parse';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import JobDetailsLeft from '../../components/Layouts/Candidate/JobDetails/JobDetailsLeft';
import JobDetailsRight from '../../components/Layouts/Candidate/JobDetails/JobDetailsRight';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';

import {CandidateUserActions} from '../../actions';

class JobDetailsPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      sendingRequest: false,
      serverError: this.props.serverError,
      job: null,
      employer: null,
      coverLetterURL: null,
      resumeURL: null,
      showError: false,
      showSuccess: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    let allJobs = JSON.parse(localStorage.getItem('jobs'));
    let allEmployers = JSON.parse(localStorage.getItem('employers'));
    let currentJob = Find(allJobs, (job) => {
      return job.objectId == this.props.params.id;
    });

    let currentEmployer = Find(allEmployers, (employer) => {
      return employer.objectId == currentJob.createdBy;
    });    
    
    this.setState({
      job: currentJob,
      employer: currentEmployer
    });
  }

  componentDidMount() {
    if(this.state.employer == undefined) {
      this.props.getUserPublic({
        id: this.state.job.createdBy,
        cb: () => {
          this.setState({
            employer: this.props.userPublicData.attributes
          });
        }
      });    
    }
  }

  getExt(filename) {
    let ext = filename.split('.').pop();
    if(ext == filename) {
      return "";
    }
    return "." + ext;
  }

  handleSubmit(coverLetterFile, resumeFile) {
    let jobId = this.state.job.objectId;
    $("#custom-width-modal-job-application").modal('hide');
    this.setState({
      sendingRequest: true
    }, () => {
      let parseCoverLetterFile = new Parse.File('cv' + this.getExt(coverLetterFile.name), coverLetterFile);
      let parseResumeFile = new Parse.File('resume' + this.getExt(resumeFile.name), resumeFile);
      //Upload CoverLetter file
      parseCoverLetterFile.save().then((res) => {
        this.setState({
          coverLetterURL: res._url
        });

        //Upload Resume file
        parseResumeFile.save().then((res) => {
          this.setState({
            resumeURL: res._url
          });
          this.setState({
            sendingRequest: false
          });

          //Apply Job
          this.props.applyJob({
            jobId: jobId,
            coverLetterURL: this.state.coverLetterURL,
            resumeURL: this.state.resumeURL,
            cb: () => {
              this.setState({
                sendingRequest: false
              });
              
              if(this.props.serverError == null) {
                this.setState({showSuccess: true});
              }else {
                this.setState({serverError: this.props.serverError.message});
              }
            }
          });
        }, (error) => {
          this.setState({
            sendingRequest: false,
            serverError: {
              message: error
            }
          });
        });   
      }, (error) => {
        this.setState({
          sendingRequest: false,
          serverError: {
            message: error
          }
        });
      });
    }); 
  }

  render() {
    if (!this.props) {
      return null;
    }else{
      let overlayClass = (this.state.sendingRequest || this.state.employer == undefined) ? 'endorsse-overlay show' : 'endorsse-overlay';

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
                    <h4 className="page-title">Job Details</h4>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <div className="card-box">                    
                    {
                      (this.state.employer) ?                      
                      <div className="row">
                        <JobDetailsLeft job={this.state.job} employer={this.state.employer} />
                        <JobDetailsRight 
                          job={this.state.job} 
                          handleSubmit={this.handleSubmit} />
                      </div>:
                      <div className="row"></div>
                    }
                  </div>
                </div>
              </div>

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
            text={this.state.serverError}
            onConfirm={()=>this.setState({serverError: null})}
          />

          <SweetAlert
            show={this.state.showSuccess}
            type="success"
            title="Successful!"
            text="The employer will get back to you if your challenges and background match their role."
            onConfirm={()=>this.setState({showSuccess: false})}
          />          
          <DashboardFooter />
        </div>
      );
    }
  }
}

JobDetailsPage.propTypes = {
  serverError: PropTypes.object
};


const mapStateToProps = (state) => {
  return {
    candidateJobApplied: state.CandidateUserReducer.candidateJobApplied,
    userPublicData: state.CandidateUserReducer.userPublicData,
    serverError: state.CandidateUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    applyJob: (req) => {
      dispatch(CandidateUserActions.applyJob(req.jobId, req.coverLetterURL, req.resumeURL, req.cb));
    },

    getUserPublic: (req) => {
      dispatch(CandidateUserActions.getUserPublic(req.id, req.cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(JobDetailsPage);