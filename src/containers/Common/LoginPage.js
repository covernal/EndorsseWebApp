import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import cookie from 'react-cookie';

import FormHeader from '../../components/Widgets/EndorsseForm/FormHeader';
import LoginForm from '../../components/Widgets/EndorsseForm/LoginForm';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';
import {CommonUserActions} from '../../actions';

class LoginPage extends React.Component{
  constructor(props, context) {
    super(props);

    this.state = {
      sendingRequest: false,
      serverError: this.props.serverError,
      session: cookie.load('session')
    };

    this.login = this.login.bind(this);
  }

  componentDidMount() {
    if(this.state.session){
      const req = {
        data: {
          session: this.state.session
        }
      };
      //this.login(req);
      this.context.router.push('/my-profile');
    }
  }

  login(req, e) {
    let _self = this;

    let form  = (req.form.length > 1) ? req.form[0] : req.form;
    if((form != undefined && form.validate()) || req.data.session){
      _self.setState({
        sendingRequest: true
      }, () => {
        //Submit the form data req.data
        _self.props.login(req.data, () => {
          if(_self.props.serverError != undefined){
            _self.setState({
              serverError: this.props.serverError,
              sendingRequest: false,
              session: this.state.session
            });
          }else{
            if(this.props.userDetails.attributes.mentorApplicationApproved == false) {
              //if mentor is still un-approved
              _self.setState({
                serverError: {
                  message: 'You application has not been approved yet.'
                },
                sendingRequest: false,
                session: this.state.session
              });
              return;
            }            

            if(!_self.state.session){
              const maxAge = req.data.rememberMe?60*60*24*365:60*60;
              const session = this.props.userDetails.getSessionToken();

              cookie.save('session', session, {
                path: '/',
                maxAge: maxAge
              });

              cookie.save('username', this.props.userDetails.attributes.username, {
                path: '/',
                maxAge: maxAge
              });
              
              cookie.save('id', this.props.userDetails.id, {
                path: '/',
                maxAge: maxAge
              });              

              cookie.save('type', this.props.userDetails.attributes.type, {
                path: '/',
                maxAge: maxAge
              });

              cookie.save('profileImageURL', this.props.userDetails.attributes.profileImageURL, {
                path: '/',
                maxAge: maxAge
              });              
            }

            _self.setState({
              serverError: this.props.serverError,
              sendingRequest: false,
              session: this.state.session
            }, () => {
              let type = this.props.userDetails.attributes.type;
              let homeURL = '/my-jobs';
              if(type == 'admin') {
                homeURL = '/mentor-applications';                
              }else if(type == 'mentor') {
                homeURL = '/my-tasks';  
              }else if(type == 'candidate') {
                homeURL = '/candidate-challenges';  
              }
              window.location = homeURL;
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
                    <LoginForm
                      login={this.login}
                      serverError={this.state.serverError}
                    />
                    <div className="clearfix"></div>
                  </div>
                </div>

                <div className="row m-t-50">
                  <div className="col-sm-12 text-center">
                    <p className="text-muted">Don't have an account? Sign up as <Link to="/candidate-signup" className="text-primary m-l-5"><b>Candidate</b></Link>,<Link to="/mentor-signup" className="text-primary m-l-5"><b>Mentor</b></Link> or <Link to="/employer-signup" className="text-primary m-l-5"><b>Employer</b></Link></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <EndorsseOverlay
          overlayClass={overlayClass}
          message="Logining your account now, please wait..."
        />
      </section>
    );
  }
}

LoginPage.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    userDetails: state.CommonUserReducer.userDetails,
    serverError: state.CommonUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (data, cb) => {
      dispatch(CommonUserActions.login(data, cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
