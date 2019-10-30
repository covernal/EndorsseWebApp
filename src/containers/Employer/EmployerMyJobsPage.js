import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import Find from 'lodash/find';
import Without from 'lodash/without';
import moment from 'moment';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import EmployerMyJobsContent from '../../components/Layouts/Employer/EmployerMyJobs/EmployerMyJobsContent';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';

import {EmployerUserActions} from '../../actions';

class EmployerMyJobsPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      skip: 0,
      myJobs: [],
      jobs: [],
      hasMoreJobs: true,
      isLoadingMore: false,
      sendingRequest: false,
      isInitTable: true,
      serverError: null
    };

    this.loadMoreCallback = this.loadMoreCallback.bind(this);
    this.loadMoreJobs = this.loadMoreJobs.bind(this);
    this.deleteJob = this.deleteJob.bind(this);
  }

  componentDidMount() {
    this.props.loadEmployerMyJobs({
      skip: this.state.skip,
      cb: () => this.loadMoreCallback()
    });    
  }

  loadMoreJobs() {
    this.setState({
      isLoadingMore: true
    }, () => {
      this.props.loadEmployerMyJobs({
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

    if(this.props.employerMyJobs.length > 0){
      let limit = 0;
      this.props.employerMyJobs.forEach((job) => {
        let existObj = Find(this.state.myJobs, (j) => {
          return j.id == job.id;
        });
        if(existObj == undefined) {
          limit++;
          this.state.myJobs.push({
            id: job.id,
            title: job.attributes.title,
            created_at: moment(job.attributes.createdAt).fromNow(),
            type: job.attributes.type,
            location: job.attributes.locationString,
            candidates: (job.attributes.candidateCount != undefined) ? job.attributes.candidateCount : 0
          });
          this.state.jobs.push(job);
          localStorage.setItem('jobs', JSON.stringify(this.state.jobs));
        }
      });
      this.setState({
        skip: this.state.skip + limit,
        myJobs: this.state.myJobs,
        isInitTable: false,
        isLoadingMore: false
      });
    }else{
      this.setState({
        hasMoreJobs: false,
        isInitTable: false,
        isLoadingMore: false
      });
    }
  }

  deleteJob(job) {
    this.setState({
      sendingRequest: true
    }, () => {
      this.props.deleteEmployerJob({
        id: job.id,
        cb: () => {
          this.setState({
            serverError: this.props.serverError,
            sendingRequest: false
          });

          if(this.props.serverError == null) {
            //reload jobs list from state and localStorage, without API
            let allJobs = JSON.parse(localStorage.getItem('jobs'));
            let allMyJobs = this.state.myJobs;
            allJobs.forEach((j, idx) => {
              if(j.objectId == job.id) {
                allJobs.splice(idx, 1);
              }
            });
            localStorage.setItem('jobs', JSON.stringify(allJobs));
            allMyJobs.forEach((j, idx) => {
              if(j.id == job.id) {
                allMyJobs.splice(idx, 1);
              }
            });    
            this.setState({
              myJobs: allMyJobs
            });
          }
        }
      });    
    });  
  }

  render() {
    if (!this.props) {
      return null;
    }else{
      let overlayClass = (this.state.sendingRequest) ? 'endorsse-overlay show' : 'endorsse-overlay';
      let disabled = (this.state.isLoadingMore || !this.state.hasMoreJobs) ? 'disabled' : '';
      let spinnerClass = (this.state.isLoadingMore) ? 'fa fa-spinner fa-spin-custom' : 'fa fa-spinner fa-spin-custom hidden';

      return (
        <div className="page-wrapper employer-jobs-page">
          <header id="topnav">
            <DashboardHeader isPublic={false} />
            <DashboardSubHeader />
          </header>

          <div className="wrapper">
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <div className="page-title-box">
                    <h4 className="page-title">My Jobs</h4>
                  </div>

                  <div className="row">
                    <div className="col-sm-4">
                      <Link to="/new-job" className="btn btn-primary btn-md waves-effect waves-light m-b-30"><i className="mdi mdi-plus-circle"></i> Create New Job</Link>
                    </div>
                  </div>

                  <EmployerMyJobsContent
                    jobData={this.state.myJobs}
                    hasMoreJobs={this.state.hasMoreJobs}
                    isInitTable={this.state.isInitTable}
                    deleteJob={this.deleteJob}
                  />

                  <div className="text-center">
                    <div className="text-center">
                      <button type="button" disabled={disabled} className="btn btn-default waves-effect w-md waves-light m-t-0 m-b-30" onClick={this.loadMoreJobs}><i className={spinnerClass} aria-hidden="true"></i> {(this.state.hasMoreJobs) ? 'Load More' : 'No More Job'}</button>
                    </div>
                  </div>
                </div>

                <SweetAlert
                  show={this.state.serverError != null}
                  type="error"
                  title="Oops..."
                  text={(this.state.serverError != null) ? this.state.serverError.message : ''}
                  onConfirm={()=>this.setState({serverError: null})}
                /> 

                <EndorsseOverlay
                  overlayClass={overlayClass}
                  message="Deleting the job now, please wait..."
                />
              </div>
            </div>
          </div>
          <DashboardFooter />
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    employerMyJobs: state.EmployerUserReducer.employerMyJobs,
    serverError: state.EmployerUserReducer.error    
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteEmployerJob: (req) => {
      dispatch(EmployerUserActions.employerDeleteJob(req.id, req.cb));
    },    
    loadEmployerMyJobs: (req) => {
      dispatch(EmployerUserActions.emplyerLoadMyJobs(req.skip, req.cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployerMyJobsPage);
