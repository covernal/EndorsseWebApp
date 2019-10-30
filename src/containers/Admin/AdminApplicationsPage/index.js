if (process.env.BROWSER) {
  require('./_adminApplicationsPage.less');
}

import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Find from 'lodash/find';
import Without from 'lodash/without';
import Map from 'lodash/map';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../../components/Layouts/Common/DashboardFooter';
import ApplicationList from '../../../components/Layouts/Admin/AdminApplicationList/ApplicationList';
import EndorsseOverlay from '../../../components/Widgets/EndorsseOverlay';

import {AdminUserActions} from '../../../actions';

class AdminApplicationsPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      skip: 0,
      applications: [],
      hasMoreApplications: true,
      isLoadingMore: false,
      isInitTable: true,
      serverError: null
    };

    this.loadMoreCallback = this.loadMoreCallback.bind(this);
    this.loadMoreApplications = this.loadMoreApplications.bind(this);
    this.approveApplication = this.approveApplication.bind(this);
    this.rejectApplication = this.rejectApplication.bind(this);
  }

  componentDidMount() {
    this.props.loadApplications({
      skip: this.state.skip,
      cb: () => this.loadMoreCallback()
    });
  }

  loadMoreApplications() {
    this.setState({
      isLoadingMore: true
    }, () => {
      this.props.loadApplications({
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

    if(this.props.applications.length > 0){
      let limit = 0;
      this.props.applications.forEach((application) => {
        let existObj = Find(this.state.applications, (l) => {
          return l.id == application.id;
        });
        if(existObj == undefined) {
          this.state.applications.push(application);
          limit++;
          //Save application in localstorage for quick grab
          localStorage.setItem('applications', JSON.stringify(this.state.applications));
        }
      });

      this.setState({
        state: this.state.skip + limit,
        applications: this.state.applications,
        isInitTable: false,
        isLoadingMore: false
      });
    }else{
      this.setState({
        hasMoreApplications: false,
        isInitTable: false,
        isLoadingMore: false
      });
    }
  }

  approveApplication(application){
    let _self = this;
    _self.props.approveApplication({
      data: application,
      cb: () => {
        if(_self.props.serverError != null) {
          _self.setState({
            serverError: _self.props.serverError
          });          
          return;
        }

        _self.setState({
          applications: Map(this.state.applications, v => {
            if(v == application){
              v.set('mentorApplicationStatus', 'reviewed');
              v.set('mentorApplicationApproved', true);
            }
            return v;
          })
        });
      }
    });
  }

  rejectApplication(application){
    let _self = this;

    _self.props.rejectApplication({
      data: application,
      cb: () => {
        if(_self.props.serverError != null) {
          _self.setState({
            serverError: _self.props.serverError
          });          
          return;
        }
                
        _self.setState({
          applications: Map(this.state.applications, v => {
            if(v == application){
              v.set('mentorApplicationStatus', 'reviewed');
              v.set('mentorApplicationApproved', false);
            }
            return v;
          })
        });
      }
    });
  }

  // setParentState(obj, cb) {
  //   Object.keys(obj).forEach((key) => {
  //     this.setState({
  //       [key]: obj[key]
  //     }, () => {
  //       cb();
  //     });
  //   });
  // }

  render() {
    let overlayClass = (this.state.isInitTable) ? 'endorsse-overlay show' : 'endorsse-overlay';
    let disabled = (this.state.isLoadingMore || !this.state.hasMoreApplications) ? 'disabled' : '';
    let spinnerClass = (this.state.isInitTable) ? 'fa fa-spinner fa-spin-custom' : 'fa fa-spinner fa-spin-custom hidden';

    if (!this.props) {
      return null;
    }else{
      return (
        <div className="page-wrapper admin-applications-page">
          <header id="topnav">
            <DashboardHeader isPublic={false} />
            <DashboardSubHeader />
          </header>

          <div className="wrapper">
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <div className="page-title-box">
                    <h4 className="page-title">Mentor Applications</h4>
                  </div>

                  <ApplicationList
                    applicationData={this.state.applications}
                    approveApplication={this.approveApplication}
                    rejectApplication={this.rejectApplication}
                  />

                  {this.state.isInitTable?
                    null
                    :
                      <div className="text-center">
                        <div className="text-center">
                          <button type="button" disabled={disabled} className="btn btn-default waves-effect w-md waves-light m-t-0 m-b-30" data-toggle="modal" data-target="#custom-width-modal" onClick={this.loadMoreApplications}><i className={spinnerClass} aria-hidden="true"></i> {(this.state.hasMoreApplications) ? 'Load more' : 'No more applications'}</button>
                      </div>
                    </div>
                  }

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

          <EndorsseOverlay
            overlayClass={overlayClass}
            message="Loading applications now, please wait..."
          />

          <DashboardFooter />
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    applications: state.AdminUserReducer.applications,
    serverError: state.AdminUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadApplications: (req) => {
      dispatch(AdminUserActions.adminLoadApplications(req.skip, req.cb));
    },
    approveApplication: (req) => {
      dispatch(AdminUserActions.adminApproveApplication(req.data, req.cb));
    },
    rejectApplication: (req) => {
      dispatch(AdminUserActions.adminRejectApplication(req.data, req.cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminApplicationsPage);
