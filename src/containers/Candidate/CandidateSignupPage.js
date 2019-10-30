import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import queryString from 'query-string';
import _ from 'lodash';
import cookie from 'react-cookie';

import FormHeader from '../../components/Widgets/EndorsseForm/FormHeader';
import CandidateSignupForm from '../../components/Widgets/EndorsseForm/CandidateSignupForm';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';
import {CandidateUserActions} from '../../actions';
import {CommonUserActions} from '../../actions';

class CandidateSignupPage extends React.Component{
  constructor(props, context) {
    super(props);
    this.state = {
      serverError: this.props.serverError,
      sendingRequest: false,
      passData: null
    };
    this.signup = this.signup.bind(this);
  }

  componentWillMount() {
    let parsedData = queryString.parse(location.search);
    if(_.isEmpty(parsedData) == false) {
      this.setState({
        passData: parsedData
      });
    }
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
            this.props.login({userName: req.data.username, password: req.data.password}, () => {
              if(this.props.commonServerError != null){
                this.context.router.push('/login');
                return;
              }

              let maxAge = 60*60;
              let session = this.props.userDetails.getSessionToken();
              cookie.save('session', session, {path: '/', maxAge: maxAge});
              cookie.save('username', this.props.userDetails.attributes.username, {path: '/', maxAge: maxAge});
              cookie.save('id', this.props.userDetails.id, {path: '/', maxAge: maxAge});
              cookie.save('type', this.props.userDetails.attributes.type, {path: '/', maxAge: maxAge});
              cookie.save('profileImageURL', this.props.userDetails.attributes.profileImageURL, {path: '/', maxAge: maxAge});

              this.setState({
                serverError: null,
                sendingRequest: false
              }, () => {
                window.location = '/candidate-challenges';
              });
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
                    <CandidateSignupForm
                      signup={this.signup}
                      passData={this.state.passData}
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

CandidateSignupPage.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    serverError: state.CandidateUserReducer.error,
    commonServerError: state.CommonUserReducer.error,
    userDetails: state.CommonUserReducer.userDetails
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signup: (data, cb) => {
      dispatch(CandidateUserActions.signup(data, cb));
    },

    login: (data, cb) => {
      dispatch(CommonUserActions.login(data, cb));
    }    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CandidateSignupPage);