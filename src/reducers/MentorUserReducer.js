import MentorUserConstants from '../constants/MentorUserConstants';
import Immutable from 'immutable';

const initialState = new Immutable.Map({
  userDetails: {},
  mentorTasks: {},
  mentorStripeCredentials: {},
  error: null
});

/**
 * Return the Mentor User object based on the API data.
 *
 * @param {state} state The initialState of the object
 * @param {action} action The action the user wishes to perform
 * @return {state} {*} Returns the original state or the featured articles object
 * @constructor
 */
function MentorUserReducer(state = initialState, action) {
  switch (action.type) {
  case MentorUserConstants.MENTOR_SIGN_UP:
  case MentorUserConstants.MENTOR_SAVE_STRIPE:
    return Object.assign({}, state, {
      userDetails: {},
      error: null
    });
  case MentorUserConstants.MENTOR_SIGN_UP_SUCCESS:
  case MentorUserConstants.MENTOR_SAVE_STRIPE_SUCCESS:
    return Object.assign({}, state, {
      userDetails: action.response,
      error: null
    });
  case MentorUserConstants.MENTOR_SIGN_UP_ERROR:
  case MentorUserConstants.MENTOR_SAVE_STRIPE_ERROR:
    return Object.assign({}, state, {
      userDetails: {},
      error: action.error
    });
  case MentorUserConstants.MENTOR_LOAD_TASKS:
    return Object.assign({}, state, {
      mentorTasks: {},
      error: null
    });
  case MentorUserConstants.MENTOR_LOAD_TASKS_SUCCESS:
    return Object.assign({}, state, {
      mentorTasks: action.response,
      error: null
    });
  case MentorUserConstants.MENTOR_LOAD_TASKS_ERROR:
    return Object.assign({}, state, {
      mentorTasks: {},
      error: action.error
    });
  case MentorUserConstants.MENTOR_LINK_STRIPE:
    return Object.assign({}, state, {
      mentorStripeCredentials: {},
      error: null
    });
  case MentorUserConstants.MENTOR_LINK_STRIPE_SUCCESS:
    return Object.assign({}, state, {
      mentorStripeCredentials: action.response,
      error: null
    });
  case MentorUserConstants.MENTOR_LINK_STRIPE_ERROR:
    return Object.assign({}, state, {
      mentorStripeCredentials: {},
      error: action.error
    });

  //Load My Challenge
  case MentorUserConstants.MENTOR_LOAD_MYCHALLENGES_SUCCESS:
    return Object.assign({}, state, {
      mentorMyChallenges: action.response,
      error: null
    });
  case MentorUserConstants.MENTOR_LOAD_MYCHALLENGES_ERROR:
    return Object.assign({}, state, {
      mentorMyChallenges: {},
      error: action.error
    }); 

  //Review challenge
  case MentorUserConstants.MENTOR_REVIEW_CHALLENGE_SUCCESS:
    return Object.assign({}, state, {
      mentorChallengeReviewed: action.response,
      error: null
    });
  case MentorUserConstants.MENTOR_REVIEW_CHALLENGE_ERROR:
    return Object.assign({}, state, {
      mentorChallengeReviewed: {},
      error: action.error
    });

  //mentorAskCandidateToResubmit
  case MentorUserConstants.MENTOR_ASK_RESUBMIT_SUCCESS:
    return Object.assign({}, state, {
      mentorResubmitAsked: action.response,
      error: null
    });
  case MentorUserConstants.MENTOR_ASK_RESUBMIT_ERROR:
    return Object.assign({}, state, {
      mentorResubmitAsked: {},
      error: action.error
    });

  default:
    return state;
  }
}

export default MentorUserReducer;
