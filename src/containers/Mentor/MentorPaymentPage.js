import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import ServerConfig from '../../../cfg/NodeJS';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import StripeLinkPanel from '../../components/Layouts/Mentor/Payment/StripeLinkPanel';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';

import {MentorUserActions} from '../../actions';
import {CommonUserActions} from '../../actions';

let unlisten;

let client_id = (process.env.REACT_WEBPACK_ENV != 'local' ? process.env.STRIPE_CLIENT_ID : ServerConfig.stripe[process.env.REACT_WEBPACK_ENV].STRIPE_CLIENT_ID);
const stripeLink = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${client_id}&scope=read_write`;

class MentorPaymentPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      location: '',
      username: Cookie.load('username'),
      sendingRequest: false,
      serverError: this.props.serverError
    };
    this.handleRouteChange = this.handleRouteChange.bind(this);
  }

  componentDidMount(){
    this.props.getPublicUserProfile({
      username: this.state.username
    }, null);
    unlisten = browserHistory.listen(this.handleRouteChange);
  }

  componentWillUnmount() {
    unlisten();
  }

  handleRouteChange(){
    let _self = this;
    setTimeout(() => {
      this.setState({
        location: _self.props.location,
        username: _self.state.username,
        sendingRequest: _self.state.sendingRequest
      }, () => {
        const query = _self.state.location.query;

        if(query.hasOwnProperty('code') && !query.hasOwnProperty('error')){
          _self.props.mentorLinkStripe(query, () => {
            let stripeObj = JSON.parse(this.props.mentorStripeCredentials.result);

            if(stripeObj.hasOwnProperty('error')){
              this.setState({
                serverError: stripeObj
              });
            }else{
              this.props.mentorSaveStripe(this.props.mentorStripeCredentials.result, () => {
                this.setState({
                  sendingRequest: false
                });
              });
            }
          });
        }else if(query.hasOwnProperty('error')){
          _self.setState({
            location: _self.state.location,
            username: _self.state.username,
            sendingRequest: true
          }, () => {
            _self.props.mentorLinkStripeError(query, () => {
              _self.setState({
                location: _self.state.location,
                username: _self.state.username,
                sendingRequest: false
              });
            });
          });
        }
      });
    }, 300);
  }

  render() {
    if (!this.props) {
      return null;
    }else{
      const userProfile = this.props.publicUserProfile;
      let overlayClass = (this.state.sendingRequest || !userProfile) ? 'endorsse-overlay show' : 'endorsse-overlay';
      const isStripeLinked = (userProfile) ? (userProfile.user && userProfile.user.get('stripeLinkedAccountCredentials')) ? true : false : false;

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
                    <h4 className="page-title">Payment</h4>
                  </div>
                </div>
              </div>

              <StripeLinkPanel
                isStripeLinked={isStripeLinked}
                stripeLink={stripeLink}
              />

            </div>
          </div>

          <SweetAlert
            show={this.state.serverError != null}
            type="error"
            title="Oops..."
            text={(this.state.serverError != null) ? this.state.serverError.error_description : ''}
            onConfirm={()=>this.setState({serverError: null})}
          />

          <EndorsseOverlay
            overlayClass={overlayClass}
            message="Check your Stripe account now, please wait..."
          />

          <DashboardFooter />
        </div>
      );
    }
  }
}

MentorPaymentPage.propTypes = {
  publicUserProfile: PropTypes.object,
  serverError: PropTypes.object
};


const mapStateToProps = (state) => {
  return {
    mentorStripeCredentials: state.MentorUserReducer.mentorStripeCredentials,
    publicUserProfile: state.CommonUserReducer.userDetails,
    serverError: state.MentorUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPublicUserProfile: (data, cb) => {
      dispatch(CommonUserActions.getPublicUserProfile(data, cb));
    },

    mentorLinkStripeError: (data, cb) => {
      dispatch(MentorUserActions.mentorLinkStripeError(data, cb));
    },

    mentorLinkStripe: (data, cb) => {
      dispatch(MentorUserActions.mentorLinkStripe(data, cb));
    },

    mentorSaveStripe: (data, cb) => {
      dispatch(MentorUserActions.mentorSaveStripe(data, cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MentorPaymentPage);
