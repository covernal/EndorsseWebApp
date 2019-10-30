import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import SweetAlert from 'sweetalert-react';
import Find from 'lodash/find';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import MentorMyChallengesContent from '../../components/Layouts/Mentor/MentorMyChallenges/MentorMyChallengesContent';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';

import {MentorUserActions} from '../../actions';
import {CommonUserActions} from '../../actions';

class MentorMyChallengesPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      skip: 0,
      myChallenges: [],
      hasMoreChallenges: true,
      isLoadingMore: false,
      isInitTable: true,
      showResubmitSuccess: false,
      commonServerError: null,
      serverError: null
    };

    this.loadMoreCallback = this.loadMoreCallback.bind(this);
    this.loadMoreChallenges = this.loadMoreChallenges.bind(this);
    this.reloadPage = this.reloadPage.bind(this);

    //Solution Actions
    this.reSubmitAction = this.reSubmitAction.bind(this);
    this.handleRate = this.handleRate.bind(this);
  }

  componentDidMount() {
    this.reloadPage();   
  }

  reloadPage() {
    this.setState({
      skip: 0,
      isInitTable: true,
      isLoadingMore: false,      
      hasMoreChallenges: true,
      myChallenges: []
    }, () => {
      this.props.loadMentorMyChallenges({
        skip: this.state.skip,
        cb: () => this.loadMoreCallback()
      });    
    });
  }

  loadMoreChallenges() {
    this.setState({
      isLoadingMore: true
    }, () => {
      this.props.loadMentorMyChallenges({
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
    if(this.props.mentorMyChallenges.length > 0){
      let limit = 0;
      let tmpChallenges = [];
      this.props.mentorMyChallenges.forEach((challenge) => {
        let task = JSON.parse(challenge.attributes.taskJSONString);
        let candidateId = challenge.attributes.candidate;
        if(this.state.commonServerError == null) {
          this.props.getUser({
            id: candidateId,
            cb: () => {
              if(this.props.commonServerError == null) {
                let candidate = this.props.userDetails.attributes;     

                let challengeData = {
                  id: challenge.id,
                  taskId: task.objectId,
                  title: task.title,
                  candidateUsername: candidate.username,
                  candidateFullname: this.getFullName(candidate),
                  rateToCandidate: challenge.attributes.rateToCandidate,
                  commentToCandidate: challenge.attributes.commentToCandidate,
                  rateToMentor: challenge.attributes.rateToMentor,
                  commentToMentor: challenge.attributes.commentToMentor,
                  submittedFileURL: challenge.attributes.submittedFileURL,
                  stripeChargeJSONString: challenge.attributes.stripeChargeJSONString
                };       

                tmpChallenges.push(challengeData);
                limit++;

                if(this.props.mentorMyChallenges.length == limit) {
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
                    isInitTable: false,
                    isLoadingMore: false
                  });
                  localStorage.setItem('myChallenges', JSON.stringify(this.state.myChallenges));
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

  handleRate(id, data) {
    this.setState({
      sendingRequest: true
    }, () => {
      this.props.mentorReviewCandidate({
        challengeId: id, 
        rate: parseInt(data.rate), 
        comment: data.comment, 
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

  reSubmitAction(challengeId, comment) {
    this.setState({
      sendingRequest: true
    }, () => {
      this.props.mentorAskCandidateToResubmit({
        challengeId: challengeId, 
        comment: comment, 
        cb: () => {
          this.setState({
            sendingRequest: false,
            serverError: this.props.serverError
          });

          if(this.props.serverError == null) {
            this.setState({
              showResubmitSuccess: true
            });
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

                  <MentorMyChallengesContent
                    challengesData={this.state.myChallenges}
                    hasMoreChallenges={this.state.hasMoreChallenges}
                    isInitTable={this.state.isInitTable}
                    reSubmitAction={this.reSubmitAction}
                    handleRate={this.handleRate}
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

          <SweetAlert
            show={this.state.showResubmitSuccess == true}
            type="success"
            title="Sent!"
            text="The request has been sent to candidate. We will let you know via email when the candidate submit a new solution."
            onConfirm={()=>this.setState({showResubmitSuccess: false})}
          />          

          <DashboardFooter />
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.CommonUserReducer.userDetails,
    commonServerError: state.CommonUserReducer.error,
    serverError: state.MentorUserReducer.error,
    mentorMyChallenges: state.MentorUserReducer.mentorMyChallenges
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUser: (req) => {
      dispatch(CommonUserActions.getUser(req.id, req.cb));
    },

    loadMentorMyChallenges: (req) => {
      dispatch(MentorUserActions.mentorLoadMyChallenges(req.skip, req.cb));
    },

    mentorReviewCandidate: (req) => {
      dispatch(MentorUserActions.mentorReviewCandidate(req.challengeId, req.rate, req.comment, req.cb));
    },

    mentorAskCandidateToResubmit: (req) => {
      dispatch(MentorUserActions.mentorAskCandidateToResubmit(req.challengeId, req.comment, req.cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MentorMyChallengesPage);
