import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import Find from 'lodash/find';
import Without from 'lodash/without';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import EmployerCandidatesContent from '../../components/Layouts/Employer/EmployerCandidates/EmployerCandidatesContent';

import {EmployerUserActions} from '../../actions';
import {CommonUserActions} from '../../actions';

class EmployerCandidatesPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      skip: 0,
      candidates: [],
      hasMoreCandidates: true,
      isLoadingMore: false,
      isInitTable: true,
      jobTitle: null,
      serverError: null,
      commonServerError: null
    };

    this.loadMoreCallback = this.loadMoreCallback.bind(this);
    this.loadMoreCandidates = this.loadMoreCandidates.bind(this);
  }

  componentWillMount() {
    let allMyJobs = JSON.parse(localStorage.getItem('jobs'));
    let currentJob = Find(allMyJobs, (job) => {
      return job.objectId == this.props.params.id;
    });
    this.setState({jobTitle: currentJob.title});
  }  

  componentDidMount() { 
    this.props.loadEmployerJobApplications({
      jobId: this.props.params.id,
      skip: this.state.skip,
      cb: () => this.loadMoreCallback()
    });     
  }

  loadMoreCandidates() {
    this.setState({
      isLoadingMore: true
    }, () => {
      this.props.loadEmployerJobApplications({
        jobId: this.props.params.id,
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

    if(this.props.employerJobApplications.length > 0){
      let limit = 0;
      let tmpJobApplications = [];
      this.props.employerJobApplications.forEach((candidate) => {
        limit++;
        if(this.state.commonServerError == null) {
          this.props.getUser({
            id: candidate.attributes.applicantId,
            cb: () => {
              if(this.props.commonServerError != null) {      
                this.setState({
                  commonServerError: this.props.commonServerError.message,
                  isInitTable: false,
                  isLoadingMore: false
                });
                return;
              }

              let candidateName = this.props.userDetails.attributes.firstName + ' ' + this.props.userDetails.attributes.lastName;
              let userType = this.props.userDetails.attributes.type;
              candidate['name']= candidateName;
              candidate['username']= this.props.userDetails.attributes.username;

              this.props.getUserMostRecentTaskChallenges({
                userType: userType, 
                userId: candidate.attributes.applicantId,
                cb: () => {
                  if(this.props.commonServerError != null) {      
                    this.setState({
                      commonServerError: this.props.commonServerError.message,
                      isInitTable: false,
                      isLoadingMore: false
                    });
                    return;
                  }
              
                  candidate['recentChallenge'] = '-';
                  if(this.props.userRecentChallenges.length > 0) {
                    let challenge = this.props.userRecentChallenges[0].attributes;
                    let task = JSON.parse(challenge.taskJSONString);
                    candidate['taskId'] = task.objectId;
                    candidate['recentChallenge'] = task.title;
                    candidate['rate'] = challenge.rateToMentor;
                    candidate['comment'] = challenge.commentToMentor;
                  }
                  tmpJobApplications.push(candidate);
                  
                  if(this.props.employerJobApplications.length == limit) {
                    let sub_limit = 0;
                    tmpJobApplications.forEach((app) => {
                      //Check duplication
                      let existObj = Find(this.state.candidates, (ca) => {
                        return ca.id == app.id;
                      });
                      if(existObj == undefined) {
                        sub_limit++;                  
                        this.state.candidates.push(app);
                      }
                    });

                    this.setState({
                      skip: this.state.skip + sub_limit,
                      candidates: this.state.candidates,
                      isInitTable: false,
                      isLoadingMore: false
                    });
                    localStorage.setItem('candidates', JSON.stringify(this.state.candidates));
                    return;
                  }    
                }          
              });
            }
          });
        }
      });
    }else{
      this.setState({
        hasMoreCandidates: false,
        isInitTable: false,
        isLoadingMore: false
      });
    }
  }

  render() {
    if (!this.props) {
      return null;
    }else{
      let disabled = (this.state.isLoadingMore || !this.state.hasMoreCandidates) ? 'disabled' : '';
      let spinnerClass = (this.state.isLoadingMore) ? 'fa fa-spinner fa-spin-custom' : 'fa fa-spinner fa-spin-custom hidden';
      let overlayClass = (this.state.sendingRequest) ? 'endorsse-overlay show' : 'endorsse-overlay';

      return (
        <div className="page-wrapper employer-candidates-page">
          <header id="topnav">
            <DashboardHeader isPublic={false} />
            <DashboardSubHeader />
          </header>

          <div className="wrapper">
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <div className="page-title-box">
                    <h4 className="page-title">Candidates for {this.state.jobTitle}</h4>
                  </div>
                  <EmployerCandidatesContent
                    candidateData={this.state.candidates}
                    hasMoreCandidates={this.state.hasMoreCandidates}
                    isInitTable={this.state.isInitTable}
                  />

                  <div className="text-center">
                    <div className="text-center">
                      <button type="button" disabled={disabled} className="btn btn-default waves-effect w-md waves-light m-t-0 m-b-30" onClick={this.loadMoreCandidates}><i className={spinnerClass} aria-hidden="true"></i> {(this.state.hasMoreCandidates) ? 'Load More' : 'No More Candidate'}</button>
                    </div>
                  </div>
                </div>            
              </div>
            </div>
          </div>  

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
    employerJobApplications: state.EmployerUserReducer.employerJobApplications,
    userDetails: state.CommonUserReducer.userDetails,
    userRecentChallenges: state.CommonUserReducer.userRecentChallenges,
    serverError: state.EmployerUserReducer.error,
    commonServerError: state.CommonUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUser: (req) => {
      dispatch(CommonUserActions.getUser(req.id, req.cb));
    },     
    getUserMostRecentTaskChallenges: (req) => {
      dispatch(CommonUserActions.getUserMostRecentTaskChallenges(req.userType, req.userId, req.cb));
    },
    loadEmployerJobApplications: (req) => {
      dispatch(EmployerUserActions.employerLoadJobApplications(req.jobId, req.skip, req.cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployerCandidatesPage);
