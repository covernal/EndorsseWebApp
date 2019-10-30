import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import Find from 'lodash/find';
import Parse from 'parse';
import SweetAlert from 'sweetalert-react';
import $ from 'jquery';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import CandidateMyChallengesContent from '../../components/Layouts/Candidate/CandidateMyChallenges/CandidateMyChallengesContent';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';

import {CandidateUserActions} from '../../actions';
import {CommonUserActions} from '../../actions';

class CandidateMyChallengesPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      skip: 0,
      serverError: null,
      commonServerError: null,
      myChallenges: [],
      hasMoreChallenges: true,
      isLoadingMore: false,
      isInitTable: true,
      fileURL: null,
      skipVoucher: 0,
      vouchersData: [],
      hasMoreVouchers: true,
      isLoadingMoreVouchers: false,
      isInitVouchersTable: true,
      sendingRequest: false
    };

    this.loadMoreChallenges = this.loadMoreChallenges.bind(this);
    this.loadMoreCallback = this.loadMoreCallback.bind(this);  
    this.submitAction = this.submitAction.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    this.handleRate = this.handleRate.bind(this);
    this.loadMoreVouchersCallback = this.loadMoreVouchersCallback.bind(this);
    this.loadMoreVouchers = this.loadMoreVouchers.bind(this);    
    this.reloadPage = this.reloadPage.bind(this);
  }

  componentDidMount() {
    this.reloadPage();   
  }

  reloadPage() {
    this.setState({
      hasMoreChallenges: true,
      isLoadingMore: false,
      isInitTable: true,
      skip: 0,
      skipVoucher: 0,
      myChallenges: []
    }, () => {
      this.props.loadCandidateTaskChallenges({
        skip: this.state.skip,
        cb: () => this.loadMoreCallback()
      });    
    });

    this.props.loadCandidateMyVouchers({
      skip: this.state.skipVoucher,
      cb: () => this.loadMoreVouchersCallback()
    });  
  }

  loadMoreChallenges() {
    this.setState({
      isLoadingMore: true
    }, () => {
      this.props.loadCandidateTaskChallenges({
        skip: this.state.skip,
        cb: () => this.loadMoreCallback()
      });
    });    
  }

  getFullName(user) {
    let fullName = '';
    if(user.firstName != undefined) {
      fullName = user.firstName;
    }

    if(user.lastName != undefined) {
      fullName += ((fullName != '') ? ' '+user.lastName : '');
    }
    return fullName;
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
    
    if(this.props.candidateTaskChallenges.length > 0){
      let limit = 0;
      let tmpChallenges = [];
      this.props.candidateTaskChallenges.forEach((challenge) => {
        let task = JSON.parse(challenge.attributes.taskJSONString);
        let mentorId = challenge.attributes.mentor;
        if(this.state.commonServerError == null) {
          this.props.getUser({
            id: mentorId,
            cb: () => {
              if(this.props.commonServerError == null) {
                let mentor = this.props.userDetails.attributes;
                let challengeData = {
                  id: challenge.id,
                  title: task.title,
                  taskId: task.objectId,
                  price: task.price,
                  mentorUsername: mentor.username,
                  mentorFullname: this.getFullName(mentor),
                  rateToCandidate: (challenge.attributes.rateToCandidate != undefined && challenge.attributes.rateToCandidate != null) ? challenge.attributes.rateToCandidate : 0,
                  stripeChargeJSONString: (challenge.attributes.stripeChargeJSONString != undefined && challenge.attributes.stripeChargeJSONString != null) ? challenge.attributes.stripeChargeJSONString : '',           
                  mentorsComment: challenge.attributes.commentToCandidate,
                  rateToMentor: (challenge.attributes.rateToMentor != undefined && challenge.attributes.rateToMentor != null) ? challenge.attributes.rateToMentor : 0,
                  commentMentor: challenge.attributes.commentToMentor,
                  submittedFileURL: challenge.attributes.submittedFileURL
                };
                tmpChallenges.push(challengeData);
                limit++;
                if(this.props.candidateTaskChallenges.length == limit) {
                  let sub_limit = 0;
                  tmpChallenges.forEach((c) => {
                    //Check duplication
                    let existObj = Find(this.state.myChallenges, (mc) => {
                      return mc.id == c.id;
                    });
                    if(existObj == undefined) {
                      sub_limit++;                  
                      this.state.myChallenges.push(c);
                    }
                  });
                  this.setState({
                    skip: this.state.skip + sub_limit,
                    myChallenges: this.state.myChallenges,
                    commonServerError: null,
                    isInitTable: false,
                    isLoadingMore: false
                  });
                  localStorage.setItem('challenges', JSON.stringify(this.state.myChallenges));
                  return;
                }
              }else {      
                this.setState({
                  commonServerError: this.props.commonServerError.message,
                  isInitTable: false,
                  isLoadingMore: false
                });
                return;
              }
            }
          });
        }
      }); 
    }else{
      this.setState({
        hasMoreChallenges: false,
        isInitTable: false,
        isLoadingMore: false
      });
    }
  }  

  loadMoreVouchers() {
    this.setState({
      isLoadingMoreVouchers: true
    }, () => {
      this.props.loadCandidateMyVouchers({
        skip: this.state.skipVoucher,
        cb: () => this.loadMoreVouchersCallback()
      });
    });   
  }

  loadMoreVouchersCallback() {
    if(this.props.serverError != null) {
      this.setState({
        serverError: (this.props.serverError.message == undefined) ? {message: "Internal server error."} : this.props.serverError,
        isInitVouchersTable: false,
        isLoadingMoreVouchers: false
      });
      return;
    }      
    if(this.props.candidateMyVouchers.length > 0){
      let limit = 0;
      this.props.candidateMyVouchers.forEach((voucher) => {
        let existObj = Find(this.state.vouchersData, (e) => {
          return e.id == voucher.id;
        });
        if(existObj == undefined) {
          limit++;
          this.state.vouchersData.push(voucher);
          localStorage.setItem('vouchers', JSON.stringify(this.state.vouchersData));
        }
      });

      this.setState({
        skipVoucher: this.state.skipVoucher + limit,
        vouchersData: this.state.vouchersData,
        isInitVouchersTable: false,
        isLoadingMoreVouchers: false
      });
    }else{
      this.setState({
        hasMoreVouchers: false,
        isInitVouchersTable: false,
        isLoadingMoreVouchers: false
      });
    }
  }  

  submitAction(challengeId, solutionFile) {
    this.setState({
      sendingRequest: true
    }, () => {
      let parseSolutionFile = new Parse.File('solution.zip', solutionFile);
      parseSolutionFile.save().then((res) => {
        this.setState({
          fileURL: res._url
        });
        this.props.submitSolutionFile({
          challengeId: challengeId,
          fileURL: this.state.fileURL,
          cb: () => {
            this.setState({
              sendingRequest: false,
              serverError: this.props.serverError
            });
            if(this.props.serverError == null) {
              this.reloadPage();
            }
          }
        });
      }, (error) => {
        this.setState({
          sendingRequest: false,
          serverError: {
            message: error
          }
        });
      });      
    });
  }

  handlePayment(challengeId, vouchers, cardToken) {
    $(".custom-with-modal-view-paychallenge").modal('hide');
    this.setState({
      sendingRequest: true
    }, () => {
      this.props.candidatePayChallenge({
        challengeId: challengeId, 
        cardToken: cardToken, 
        vouchers: vouchers, 
        cb: () => {
          this.setState({
            sendingRequest: false,
            serverError: this.props.serverError
          });

          if(this.props.serverError == null) {
            this.reloadPage();
          }          
        }
      });
    });
  }

  handleRate(id, data) {
    this.setState({
      sendingRequest: true
    }, () => {
      this.props.candidateReviewMentor({
        challengeId: id, 
        rate: parseInt(data.rateMentor), 
        comment: data.mentorsComment, 
        cb: () => {
          this.setState({
            sendingRequest: false,
            serverError: this.props.serverError
          });

          if(this.props.serverError == null) {
            this.reloadPage();
          }          
        }
      });
    });    
  }

  render() {
    if (!this.props) {
      return null;
    }else{
      let disabled = (this.state.isLoadingMore || !this.state.hasMoreChallenges) ? 'disabled' : '';
      let spinnerClass = (this.state.isLoadingMore) ? 'fa fa-spinner fa-spin-custom' : 'fa fa-spinner fa-spin-custom hidden';
      let overlayClass = (this.state.sendingRequest) ? 'endorsse-overlay show' : 'endorsse-overlay';

      return (
        <div className="page-wrapper my-challenges-page">     
          <header id="topnav">
            <DashboardHeader isPublic={false} />
            <DashboardSubHeader />
          </header>

          <div className="wrapper">
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <div className="page-title-box">
                    <h4 className="page-title">My Challenges</h4>
                  </div>
                  <CandidateMyChallengesContent
                    challengesData={this.state.myChallenges}
                    hasMoreChallenges={this.state.hasMoreChallenges}
                    isInitTable={this.state.isInitTable}
                    submitAction={this.submitAction}
                    reSubmitAction={this.submitAction}
                    handlePayment={this.handlePayment}
                    handleRate={this.handleRate}
                    payChallengeData = {{
                      vouchersData: this.state.vouchersData,
                      hasMoreVouchers: this.state.hasMoreVouchers,
                      isInitVouchersTable: this.state.isInitVouchersTable,
                      isLoadingMoreVouchers: this.state.isLoadingMoreVouchers,                    
                      loadMoreVouchersCallback: this.loadMoreVouchersCallback,
                      loadMoreVouchers: this.loadMoreVouchers
                    }}
                  />
                  <div className="text-center">
                    <div className="text-center">
                      <button type="button" disabled={disabled} className="btn btn-default waves-effect w-md waves-light m-t-0 m-b-30" data-toggle="modal" data-target="#custom-width-modal" onClick={this.loadMoreChallenges}><i className={spinnerClass} aria-hidden="true"></i> {(this.state.hasMoreChallenges) ? 'Load More' : 'No More Challenge'}</button>
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
            show={this.state.serverError != null || this.state.commonServerError != null}
            type="error"
            title="Oops..."
            text={(this.state.serverError != null) ? this.state.serverError.message : ((this.state.commonServerError != null) ? this.state.commonServerError.message : '')}
            onConfirm={()=>this.setState({serverError: null, commonServerError: null})}
          />
          <DashboardFooter />
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    candidateTaskChallenges: state.CandidateUserReducer.candidateTaskChallenges,
    candidateFileSubmitted: state.candidateFileSubmitted,
    userDetails: state.CommonUserReducer.userDetails,
    commonServerError: state.CommonUserReducer.error,
    serverError: state.CandidateUserReducer.error,
    candidateMyVouchers: state.CandidateUserReducer.candidateMyVouchers,
    candidateChallengePaid: state.candidateChallengePaid
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUser: (req) => {
      dispatch(CommonUserActions.getUser(req.id, req.cb));
    },

    loadCandidateTaskChallenges: (req) => {
      dispatch(CandidateUserActions.candidateLoadTaskChallenges(req.skip, req.cb));
    },

    submitSolutionFile: (req) => {
      dispatch(CandidateUserActions.candidateSubmitFileToChallenge(req.challengeId, req.fileURL, req.cb));
    },

    loadCandidateMyVouchers: (req) => {
      dispatch(CandidateUserActions.candidateLoadMyVouchers(req.skip, req.cb));
    },

    candidatePayChallenge: (req) => {
      dispatch(CandidateUserActions.candidatePayChallenge(req.challengeId, req.cardToken, req.vouchers, req.cb));
    },

    candidateReviewMentor: (req) => {
      dispatch(CandidateUserActions.candidateReviewMentor(req.challengeId, req.rate, req.comment, req.cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CandidateMyChallengesPage);
