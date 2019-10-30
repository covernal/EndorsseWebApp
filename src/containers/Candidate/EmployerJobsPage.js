import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import Find from 'lodash/find';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import EmployerJobsLeft from '../../components/Layouts/Candidate/EmployerJobs/EmployerJobsLeft';
import EmployerJobsRight from '../../components/Layouts/Candidate/EmployerJobs/EmployerJobsRight';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';

import {CandidateUserActions} from '../../actions';

class EmployerJobsPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      username: Cookie.load('username'),
      sendingRequest: false,
      serverError: this.props.serverError,
      employer: {},
      jobs: [],
      skip: 0,
      hasMoreEmployerJobs: true,
      isLoadingMore: false,
      isInitTable: true      
    };

    this.loadMoreCallback = this.loadMoreCallback.bind(this);
    this.loadMoreEmployerJobs = this.loadMoreEmployerJobs.bind(this);
  }

  componentWillMount() {
    let allEmployers = JSON.parse(localStorage.getItem('employers'));
    let currentEmployer = Find(allEmployers, (e) => {
      return e.username == this.props.params.username;
    });
    this.setState({
      employer: currentEmployer
    });
  }

  componentDidMount() {
    this.props.loadCandidateEmployerJobs({
      employerId: this.state.employer.objectId,
      skip: this.state.skip,
      cb: () => this.loadMoreCallback()
    });  
  }

  loadMoreEmployerJobs() {
    this.setState({
      isLoadingMore: true
    }, () => {
      this.props.loadCandidateEmployerJobs({
        employerId: this.state.employer.objectId,
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

    if(this.props.candidateEmployerJobs.length > 0){
      let limit = 0;
      this.props.candidateEmployerJobs.forEach((job) => {
        let existObj = Find(this.state.jobs, (j) => {
          return j.id == job.id;
        });
        if(existObj == undefined) {
          limit++;
          this.state.jobs.push(job);
          localStorage.setItem('jobs', JSON.stringify(this.state.jobs));
        }
      });

      this.setState({
        skip: this.state.skip + limit,
        jobs: this.state.jobs,
        isInitTable: false,
        isLoadingMore: false
      });
    }else{
      this.setState({
        hasMoreEmployerJobs: false,
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
                    <h4 className="page-title">Browse Employer's Jobs</h4>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <div className="card-box">
                    <div className="row">
                      <EmployerJobsLeft employer={this.state.employer} />
                      <EmployerJobsRight                         
                        hasMoreEmployerJobs={this.state.hasMoreEmployerJobs}
                        isLoadingMore={this.state.isLoadingMore}
                        jobs={this.state.jobs} 
                        employer={this.state.employer}
                        isInitTable={this.state.isInitTable}
                        loadMoreEmployerJobs={this.loadMoreEmployerJobs}
                      />
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

EmployerJobsPage.propTypes = {
  serverError: PropTypes.object
};


const mapStateToProps = (state) => {
  return {
    candidateEmployerJobs: state.CandidateUserReducer.candidateEmployerJobs,
    serverError: state.CandidateUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadCandidateEmployerJobs: (req) => {
      dispatch(CandidateUserActions.candidateLoadEmployerJobs(req.employerId, req.skip, req.cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployerJobsPage);