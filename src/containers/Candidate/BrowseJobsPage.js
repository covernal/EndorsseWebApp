import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import Find from 'lodash/find';
import SweetAlert from 'sweetalert-react';
import $ from 'jquery';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import BrowseJobsLeft from '../../components/Layouts/Candidate/BrowseJobs/BrowseJobsLeft';
import BrowseJobsRight from '../../components/Layouts/Candidate/BrowseJobs/BrowseJobsRight';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';

import {CandidateUserActions} from '../../actions';
import {CommonUserActions} from '../../actions';

class BrowseJobsPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      username: Cookie.load('username'),
      serverError: this.props.serverError,
      jobs: [],
      skip: 0,
      hasMoreJobs: true,
      isLoadingMore: false,
      isInitTable: true,

      locationString: null,
      lat: null,
      lon: null
    };

    this.loadMoreCallback = this.loadMoreCallback.bind(this);
    this.loadMoreJobs = this.loadMoreJobs.bind(this);
    this.handleSelectLocation = this.handleSelectLocation.bind(this);
    this.onClear = this.onClear.bind(this);
    this.filter = this.filter.bind(this);
    this._filterJobs = this._filterJobs.bind(this);
  }

  componentDidMount() {
    this.filter();
  }

  loadMoreJobs() {
    this.setState({
      isLoadingMore: true
    }, () => {
      this._filterJobs();
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

    if(this.props.jobsData.length > 0){
      let limit = 0;
      let tmpJobs = [];

      this.props.jobsData.forEach((job) => {
        this.props.getUser({
          id: job.attributes.createdBy,
          cb: () => {
            limit++;   

            if(this.props.commonServerError == null) {
              //If no user exist, no need to show the job.
              job['userDetails'] = this.props.userDetails.attributes;
              tmpJobs.push(job);              
            }

            if(this.props.jobsData.length == limit) {
              let sub_limit = 0;
              if(tmpJobs.length > 0) {
                tmpJobs.forEach((j) => {
                  let existObj = Find(this.state.jobs, (mj) => {
                    return mj.id == j.id;
                  });
                  if(existObj == undefined) {
                    sub_limit++;                  
                    this.state.jobs.push(j);
                  }
                });                
              }else {
                this.setState({
                  hasMoreJobs: false
                });
              }

              this.setState({
                serverError: null,
                skip: this.state.skip + sub_limit,
                jobs: this.state.jobs,
                isInitTable: false,
                isLoadingMore: false
              });
              localStorage.setItem('jobs', JSON.stringify(this.state.jobs));
            }             
          }
        });
      });
    }else{
      this.setState({
        hasMoreJobs: false,
        isInitTable: false,
        isLoadingMore: false
      });
    }
  }

  handleSelectLocation(place) {
    this.setState({
      locationString: place.formatted_address,
      lat: place.geometry.location.lat(),
      lon: place.geometry.location.lng()
    });
  }  

  onClear() {
    $("#field-location").val('');
    this.setState({
      locationString: '',
      lat: null,
      lon: null,
      skip: 0,
      jobs: [],
      isInitTable: true,
      hasMoreJobs: true
    }, () => {
      this._filterJobs();
    });
  }

  filter() {    
    if(!this.state.locationString) {
      this.setState({
        lat: null,
        lon: null
      });
    }

    this.setState({
      skip: 0,
      jobs: [],
      isInitTable: true,
      hasMoreJobs: true
    }, () => {
      this._filterJobs();
    });
  }

  _filterJobs() {
    let params = {
      skip: this.state.skip 
    };
    if(this.state.lat) {
      params['lat'] = this.state.lat;
      params['lon'] = this.state.lon;
    }
    this.props.loadJobs({
      params: params,
      cb: () => this.loadMoreCallback()
    });
  }

  render() {
    if (!this.props) {
      return null;
    }

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
                  <h4 className="page-title">Browse Jobs</h4>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="card-box">
                  <div className="row">
                    <BrowseJobsLeft 
                      lat={this.state.lat}
                      lon={this.state.lon}
                      locationString={this.state.locationString}
                      handleSelectLocation={this.handleSelectLocation}
                      onApply={this.filter} 
                      onClear={this.onClear} />
                    <BrowseJobsRight                         
                      hasMoreJobs={this.state.hasMoreJobs}
                      isLoadingMore={this.state.isLoadingMore}
                      jobs={this.state.jobs} 
                      isInitTable={this.state.isInitTable}
                      loadMoreJobs={this.loadMoreJobs}
                    />
                  </div>
                </div>
              </div>
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

        <DashboardFooter />
      </div>
    );
  }
}

BrowseJobsPage.propTypes = {
  serverError: PropTypes.object
};


const mapStateToProps = (state) => {
  return {
    jobsData: state.CandidateUserReducer.jobsData,
    serverError: state.CandidateUserReducer.error,
    userDetails: state.CommonUserReducer.userDetails,
    commonServerError: state.CommonUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUser: (req) => {
      dispatch(CommonUserActions.getUser(req.id, req.cb));
    },    
    loadJobs: (req) => {
      dispatch(CandidateUserActions.getJobs(req.params, req.cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowseJobsPage);