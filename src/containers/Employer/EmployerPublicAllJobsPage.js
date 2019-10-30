import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import Find from 'lodash/find';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import EmployerPublicProfileLeft from '../../components/Layouts/Employer/EmployerPublicProfile/EmployerPublicProfileLeft';
import EmployerPublicProfileRight from '../../components/Layouts/Employer/EmployerPublicProfile/EmployerPublicProfileRight';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';
import MenuConstants from '../../constants/MenuConstants';

import {EmployerUserActions} from '../../actions';
import {CandidateUserActions} from '../../actions';

class EmployerPublicAllJobsPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      sendingRequest: false,
      isInitTable: false,
      serverError: null,
      candidateServerError: null,
      hasMoreJobs: true,
      isLoadingMore: false,
      user: {},
      skip: 0,
      jobs: [],
      employerId: null,
      companyName: ''
    };

    this.loadMoreCallback = this.loadMoreCallback.bind(this);
    this.pushJob = this.pushJob.bind(this);
    this.loadMoreJobs = this.loadMoreJobs.bind(this);    
  }

  componentDidMount(){
    this.setState({
      sendingRequest: true
    }, () => {    
      this.props.getPublicUserProfile({
        username: this.props.params.username,
        cb: () => {
          if(this.props.serverError == null) {
            let userData = this.props.employerDetails.user.attributes;
            this.setState({
              user: {
                avatar: userData.profileImageURL,
                name: userData.companyName,
                location: userData.locationString,
                description: userData.summary,
                link: userData.companyURL
              },
              companyName: userData.companyName,
              employerId: this.props.employerDetails.user.id
            });

            this.props.getEmployerJobs({
              employerId: this.props.employerDetails.user.id,
              skip: 0,
              cb: () => this.loadMoreCallback()
            });            
          }else {
            this.setState({
              serverError: this.props.serverError,
              sendingRequest: false
            });    
          }      
        }
      });   
    });
  }

  loadMoreJobs() {
    console.log('Load more jobs');
    this.setState({
      isLoadingMore: true
    }, () => {
      this.props.getEmployerJobs({
        employerId: this.state.employerId,
        skip: this.state.skip,
        cb: () => this.loadMoreCallback()
      });
    });
  }

  loadMoreCallback() {    
    if(this.props.candidateServerError != null) {
      this.setState({
        candidateServerError: this.props.candidateServerError.message,
        isLoadingMore: false,
        sendingRequest: false
      });
      return;
    }

    if(this.props.employerJobs.length > 0){
      let limit = 0;
      let back_jobs = [];
      this.props.employerJobs.forEach((job) => {
        let existObj = Find(this.state.jobs, (t) => {
          return t.id == job.id;
        });
        if(existObj == undefined) {
          this.pushJob(job);

          let row = JSON.stringify(job.attributes);
          row = JSON.parse(row);                
          row['objectId'] = job.id;          
          back_jobs.push(row);
          
          limit++;
        }        
      });
      localStorage.setItem('jobs', JSON.stringify(back_jobs));
      this.setState({
        skip: this.state.skip + limit,
        jobs: this.state.jobs,
        sendingRequest: false,
        isLoadingMore: false
      });
    }else{
      this.setState({
        hasMoreJobs: false,
        sendingRequest: false,
        isLoadingMore: false
      });
    }
  }

  pushJob(job) {
    this.state.jobs.push({
      id: job.id,                  
      attributes: {
        title: job.attributes.title,
        employerName: this.state.companyName,
        locationString: job.attributes.locationString,
        keyPoints: job.attributes.keyPoints
      }
    });
  }

  render() {
    if (!this.props) {
      return null;
    }else{
      const userProfile = this.props.publicUserProfile;
      let overlayClass = (this.state.sendingRequest) ? 'endorsse-overlay show' : 'endorsse-overlay';
      
      return (
        <div className="page-wrapper mentor-tasks-page">
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
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <div className="card-box">
                    <div className="row">
                      <EmployerPublicProfileLeft user={this.state.user} />
                      <EmployerPublicProfileRight 
                        jobs={this.state.jobs} 
                        employer={this.state.user} 
                        loadAllJobs={this.loadMoreJobs}
                        isInitTable={this.state.isInitTable}                         
                        isLoadingMore={this.state.isLoadingMore}
                        hasMoreJobs={this.state.hasMoreJobs}
                        all={true} />
                    </div>
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
            show={this.state.serverError != null || this.state.candidateServerError != null}
            type="error"
            title="Oops..."
            text={(this.state.serverError != null) ? this.state.serverError.message : ((this.state.candidateServerError != null) ? this.state.candidateServerError.message : '')}
            onConfirm={()=>this.setState({serverError: null, candidateServerError: null})}
          />          

          <DashboardFooter />
        </div>
      );
    }
  }
}

EmployerPublicAllJobsPage.propTypes = {
  serverError: PropTypes.object
};

EmployerPublicAllJobsPage.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    employerDetails: state.EmployerUserReducer.employerDetails,
    employerJobs: state.CandidateUserReducer.candidateEmployerJobs,
    serverError: state.EmployerUserReducer.error,
    candidateServerError: state.CandidateUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPublicUserProfile: (req) => {
      dispatch(EmployerUserActions.getPublicUserProfile(req.username, req.cb));
    },

    getEmployerJobs: (req) => {
      dispatch(CandidateUserActions.candidateLoadEmployerJobs(req.employerId, req.skip, req.cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployerPublicAllJobsPage);