import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import Find from 'lodash/find';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import EmployerJobForm from '../../components/Widgets/EndorsseForm/EmployerJobForm';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';

import {EmployerUserActions} from '../../actions';

class EditEmployerJobPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      serverError: this.props.serverError,
      sendingRequest: false,
      currentJob: {}
    };

    this.processJob = this.processJob.bind(this);
  }

  componentWillMount() {
    let allJobs = JSON.parse(localStorage.getItem('jobs'));
    let currentJob = Find(allJobs, (job) => {
      return job.objectId == this.props.params.id;
    });
    this.setState({
      currentJob: currentJob
    });
  }

  processJob(req, e) {
    let form  = (req.form.length > 1) ? req.form[0] : req.form;
    if(form.validate()){
      this.setState({
        sendingRequest: true
      }, () => {
        this.props.employerUpdateJob(this.props.params.id, req.data, () => {
          if(this.props.serverError != null){
            this.setState({
              serverError: (this.props.serverError.message == undefined) ? {message: "Internal server error."} : this.props.serverError,
              sendingRequest: false
            });
          }else{
            this.context.router.push('/my-jobs');
          }
        });
      });
    }
  }

  render() {
    if (!this.props) {
      return null;
    }else{
      let overlayClass = (this.state.sendingRequest) ? 'endorsse-overlay show' : 'endorsse-overlay';

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
                    <h4 className="page-title">Edit Job</h4>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="card-box">
                    <EmployerJobForm
                      serverError={this.state.serverError}
                      processJob={this.processJob}
                      currentJob={this.state.currentJob}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <EndorsseOverlay
            overlayClass={overlayClass}
            message="Updating new job now, please wait..."
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

EditEmployerJobPage.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    employerJobUpdated: state.EmployerUserReducer.employerJobUpdated,
    serverError: state.EmployerUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    employerUpdateJob: (id, data, cb) => {
      data['id'] = id;
      dispatch(EmployerUserActions.employerUpdateJob(data, cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditEmployerJobPage);
