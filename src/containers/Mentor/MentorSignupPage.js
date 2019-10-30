import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';

import FormHeader from '../../components/Widgets/EndorsseForm/FormHeader';
import MentorSignupForm from '../../components/Widgets/EndorsseForm/MentorSignupForm';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';
import {MentorUserActions} from '../../actions';

class MentorSignupPage extends React.Component{
  constructor(props, context) {
    super(props);
    this.state = {
      serverError: this.props.serverError,
      sendingRequest: false
    };
    this.signup = this.signup.bind(this);
  }

  signup(req, e) {
    let form  = (req.form.length > 1) ? req.form[0] : req.form;
    if(form.validate()){
      this.setState({
        sendingRequest: true
      }, () => {
        //Submit the form data req.data
        this.props.signup(req.data, () => {
          if(this.props.serverError != undefined){
            this.setState({
              serverError: this.props.serverError.message,
              sendingRequest: false
            });
          }else{
            this.context.router.push('/login');
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
                    <MentorSignupForm
                      signup={this.signup}
                      serverError={this.state.serverError}
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
                message="Creating your account now, please wait..."
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

MentorSignupPage.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    serverError: state.MentorUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signup: (data, cb) => {
      dispatch(MentorUserActions.signup(data, cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MentorSignupPage);
