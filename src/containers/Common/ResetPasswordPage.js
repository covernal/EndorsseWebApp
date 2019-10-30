import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';

import FormHeader from '../../components/Widgets/EndorsseForm/FormHeader';
import ResetPasswordForm from '../../components/Widgets/EndorsseForm/ResetPasswordForm';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';
import {CommonUserActions} from '../../actions';

class ResetPasswordPage extends React.Component{
  constructor(props, context) {
    super(props);
    this.resetPassword = this.resetPassword.bind(this);
    this.state = {
      serverError: this.props.serverError,
      sendingRequest: false,
      resetPasswordEmailStatus: undefined
    };
  }

  resetPassword(req, e) {
    let form  = (req.form.length > 1) ? req.form[0] : req.form;
    if(form.validate()){
      //Submit the form data req.data
      this.setState({
        sendingRequest: true
      }, () => {
        //Submit the form data req.data
        this.props.resetPassword(req.data, () => {
          if(this.props.serverError != null){
            this.setState({
              serverError: this.props.serverError.message,
              sendingRequest: false,
              resetPasswordEmailStatus: this.props.resetPasswordEmailStatus
            });
          }else{
            this.setState({
              serverError: this.props.serverError,
              sendingRequest: false,
              resetPasswordEmailStatus: this.props.resetPasswordEmailStatus
            });
          }
        });
      });
    }
  }

  render() {
    if (!this.props) {
      return null;
    }

    let overlayClass = (this.state.sendingRequest) ? 'endorsse-overlay show' : 'endorsse-overlay';

    return (
      <section>
        <div className="container-alt">
          <div className="row">
            <div className="col-sm-12">
              <div className="wrapper-page">
                <div className="m-t-40 account-pages">
                  <FormHeader />

                  <div className="account-content">
                    <ResetPasswordForm
                      resetPassword={this.resetPassword}
                      resetPasswordEmailStatus={this.state.resetPasswordEmailStatus}
                      errorMessage={this.state.serverError?this.state.serverError:''}
                    />
                    <div className="clearfix"></div>
                  </div>
                </div>

                <div className="row m-t-50">
                  <div className="col-sm-12 text-center">
                    <p className="text-muted">Already have account?<Link to="/login" className="text-primary m-l-5"><b>Sign In</b></Link></p>
                  </div>
                </div>
              </div>

              <EndorsseOverlay
                overlayClass={overlayClass}
                message="Sending reset password email now, please wait..."
              />

            </div>
          </div>
        </div>
      </section>
    );
  }
}

ResetPasswordPage.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    resetPasswordEmailStatus: state.CommonUserReducer.resetPasswordEmailStatus,
    serverError: state.CommonUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetPassword: (data, cb) => {
      dispatch(CommonUserActions.resetPassword(data, cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage);
