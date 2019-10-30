import MentorUserConstants from '../constants/MentorUserConstants';
import ServerConfig from '../../cfg/NodeJS';
import fetch from 'isomorphic-fetch';
import Parse from 'parse';

let UserActions = {
  //Mentor Signup
  mentorSignupRequest: function() {
    return {
      type: MentorUserConstants.MENTOR_SIGN_UP
    };
  },

  mentorSignupError: function(error) {
    return {
      error,
      type: MentorUserConstants.MENTOR_SIGN_UP_ERROR
    };
  },

  mentorSignupSuccess: function(response) {
    return {
      response,
      type: MentorUserConstants.MENTOR_SIGN_UP_SUCCESS
    };
  },

  signup: function(data, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('newMentorApplication', data)
        .then(response => {
          dispatch(_obj.mentorSignupSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.mentorSignupError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Mentor load tasks
  mentorLoadTasksRequest: function() {
    return {
      type: MentorUserConstants.MENTOR_LOAD_TASKS
    };
  },

  mentorLoadTasksError: function(error) {
    return {
      error,
      type: MentorUserConstants.MENTOR_LOAD_TASKS_ERROR
    };
  },

  mentorLoadTasksSuccess: function(response) {
    return {
      response,
      type: MentorUserConstants.MENTOR_LOAD_TASKS_SUCCESS
    };
  },

  mentorLoadTasks: function(data, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getMyTaskTemplates', {skip: data})
        .then(response => {
          dispatch(_obj.mentorLoadTasksSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.mentorLoadTasksError(error));
          if(cb != null){
            cb();
          }
        });
  },


  //Mentor link to stripe
  mentorLinkStripeRequest: function() {
    return {
      type: MentorUserConstants.MENTOR_LINK_STRIPE
    };
  },

  mentorLinkStripeError: function(error, cb) {
    if(cb != null){
      cb();
    }
    return {
      error,
      type: MentorUserConstants.MENTOR_LINK_STRIPE_ERROR
    };
  },

  mentorLinkStripeSuccess: function(response) {
    return {
      response,
      type: MentorUserConstants.MENTOR_LINK_STRIPE_SUCCESS
    };
  },

  mentorLinkStripe: function(data, cb){
    let _obj = this;
    let secret_key = '';
    let client_id = '';

    if(process.env.REACT_WEBPACK_ENV != 'local'){
      secret_key = process.env.STRIPE_SECRET_KEY;
      client_id = process.env.STRIPE_CLIENT_ID;
    }else{
      secret_key = ServerConfig.stripe[process.env.REACT_WEBPACK_ENV].STRIPE_SECRET_KEY;
      client_id = ServerConfig.stripe[process.env.REACT_WEBPACK_ENV].STRIPE_CLIENT_ID;
    }

    const body = JSON.stringify({
      client_id: client_id,
      client_secret: secret_key,
      code: data.code,
      grant_type: 'authorization_code'
    });

    return dispatch => {
      fetch(process.env.PARSE_SERVER_URL + '/functions/stripeAuth', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Parse-Application-Id': process.env.PARSE_APP_ID
        },
        body: body
      })
      .then(res => res.json())
      .then(response => {
        dispatch(_obj.mentorLinkStripeSuccess(response));

        if(cb != null){
          cb();
        }
      })
      .catch(error => {
        dispatch(_obj.mentorLinkStripeError(error, null));

        if(cb != null){
          cb();
        }
      });
    };
  },

  //Mentor save stripe credentials
  mentorSaveStripeRequest: function() {
    return {
      type: MentorUserConstants.MENTOR_SAVE_STRIPE
    };
  },

  mentorSaveStripeError: function(error, cb) {
    if(cb != null){
      cb();
    }
    return {
      error,
      type: MentorUserConstants.MENTOR_SAVE_STRIPE_ERROR
    };
  },

  mentorSaveStripeSuccess: function(response) {
    return {
      response,
      type: MentorUserConstants.MENTOR_SAVE_STRIPE_SUCCESS
    };
  },

  mentorSaveStripe: function(data, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('saveStripeLinkedAccountCredentials', {stripeLinkedAccountCredentials: data})
        .then(response => {
          dispatch(_obj.mentorSaveStripeSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.mentorSaveStripeError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Mentor load my challenges
  mentorLoadMyChallengesError: function(error) {
    return {
      error,
      type: MentorUserConstants.MENTOR_LOAD_MYCHALLENGES_ERROR
    };
  },

  mentorLoadMyChallengesSuccess: function(response) {
    return {
      response,
      type: MentorUserConstants.MENTOR_LOAD_MYCHALLENGES_SUCCESS
    };
  },

  mentorLoadMyChallenges: function(skip, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getMentorTaskChallenges', {skip: skip})
        .then(response => {
          dispatch(_obj.mentorLoadMyChallengesSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.mentorLoadMyChallengesError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Review to Candidate
  mentorReviewCandidateError: function(error) {
    return {
      error,
      type: MentorUserConstants.MENTOR_REVIEW_CHALLENGE_ERROR
    };
  },

  mentorReviewCandidateSuccess: function(response) {
    return {
      response,
      type: MentorUserConstants.MENTOR_REVIEW_CHALLENGE_SUCCESS
    };
  },

  mentorReviewCandidate: function(challengeId, rate, comment, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('mentorReviewChallenge', {challengeId: challengeId, rate: rate, comment: comment})
        .then(response => {
          dispatch(_obj.mentorReviewCandidateSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.mentorReviewCandidateError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Review to Candidate
  mentorAskCandidateToResubmitError: function(error) {
    return {
      error,
      type: MentorUserConstants.MENTOR_ASK_RESUBMIT_ERROR
    };
  },

  mentorAskCandidateToResubmitSuccess: function(response) {
    return {
      response,
      type: MentorUserConstants.MENTOR_ASK_RESUBMIT_SUCCESS
    };
  },

  mentorAskCandidateToResubmit: function(challengeId, comment, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('mentorAskCandidateToResubmit', {challengeId: challengeId, comment: comment})
        .then(response => {
          dispatch(_obj.mentorAskCandidateToResubmitSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.mentorAskCandidateToResubmitError(error));
          if(cb != null){
            cb();
          }
        });
  }

};

export default UserActions;
