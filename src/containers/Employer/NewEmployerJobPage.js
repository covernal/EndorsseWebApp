import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import EmployerJobForm from '../../components/Widgets/EndorsseForm/EmployerJobForm';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';

import {EmployerUserActions} from '../../actions';

class NewEmployerJobPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      serverError: this.props.serverError,
      sendingRequest: false
    };

    this.processJob = this.processJob.bind(this);
  }

  processJob(req, e) {
    let form  = (req.form.length > 1) ? req.form[0] : req.form;
    if(form.validate()){
      this.setState({
        sendingRequest: true
      }, () => {
        this.props.employerCreateJob(req.data, () => {
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
                    <h4 className="page-title">Create New Job</h4>                    
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="card-box">
                    <EmployerJobForm
                      action="newJob"
                      processJob={this.processJob}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <EndorsseOverlay
            overlayClass={overlayClass}
            message="Creating new job now, please wait..."
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

NewEmployerJobPage.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    employerJobCreated: state.EmployerUserReducer.employerJobCreated,
    serverError: state.EmployerUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    employerCreateJob: (data, cb) => {
      dispatch(EmployerUserActions.employerCreateJob(data, cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewEmployerJobPage);
