import CommonUserConstants from '../constants/CommonUserConstants';
import Immutable from 'immutable';

const initialState = new Immutable.Map({
  resetPasswordEmailStatus: undefined,
  userDetails: {},
  updatedUser: {},
  error: null
});

/**
 * Return the Common User object based on the API data.
 *
 * @param {state} state The initialState of the object
 * @param {action} action The action the user wishes to perform
 * @return {state} {*} Returns the original state or the featured articles object
 * @constructor
 */
function CommonUserReducer(state = initialState, action) {
  switch (action.type) {
  case CommonUserConstants.COMMON_USER_RESET_PASSWORD:
    return Object.assign({}, state, {
      resetPasswordEmailStatus: undefined,
      error: null
    });
  case CommonUserConstants.COMMON_USER_RESET_PASSWORD_SUCCESS:
    return Object.assign({}, state, {
      resetPasswordEmailStatus: true,
      error: null
    });
  case CommonUserConstants.COMMON_USER_RESET_PASSWORD_ERROR:
    return Object.assign({}, state, {
      resetPasswordEmailStatus: false,
      error: action.error
    });
  case CommonUserConstants.GET_PUBLIC_USER_PROFILE:
  case CommonUserConstants.USER_LOGIN:
  case CommonUserConstants.USER_UPDATE:
    return Object.assign({}, state, {
      userDetails: {},
      error: null
    });
  case CommonUserConstants.GET_PUBLIC_USER_PROFILE_SUCCESS:
  case CommonUserConstants.USER_LOGIN_SUCCESS:
  case CommonUserConstants.GET_USER_SUCCESS:
    return Object.assign({}, state, {
      userDetails: action.response,
      error: null
    });
  case CommonUserConstants.GET_PUBLIC_USER_PROFILE_ERROR:
  case CommonUserConstants.USER_LOGIN_ERROR:
  case CommonUserConstants.USER_UPDATE_ERROR:
  case CommonUserConstants.GET_USER_ERROR:
    return Object.assign({}, state, {
      userDetails: {},
      updatedUser: {},
      error: action.error
    });
  case CommonUserConstants.USER_UPDATE_SUCCESS:
    return Object.assign({}, state, {
      updatedUser: action.response,
      error: null
    });

  //Get Recent Challenges
  case CommonUserConstants.GET_USER_RECENT_CHALLENGES:
    return Object.assign({}, state, {
      userRecentChallenges: {},
      error: null
    });
  case CommonUserConstants.GET_USER_RECENT_CHALLENGES_SUCCESS:
    return Object.assign({}, state, {
      userRecentChallenges: action.response,
      error: null
    });
  case CommonUserConstants.GET_USER_RECENT_CHALLENGES_ERROR:
    return Object.assign({}, state, {
      userRecentChallenges: {},
      error: action.error
    });     

  //Load All Challenges
  case CommonUserConstants.LOAD_ALL_CHALLENGES:
    return Object.assign({}, state, {
      userChallenges: {},
      error: null
    });  
  case CommonUserConstants.LOAD_ALL_CHALLENGES_SUCCESS:  
    return Object.assign({}, state, {
      userChallenges: action.response,
      error: null
    });
  case CommonUserConstants.LOAD_ALL_CHALLENGES_ERROR:
    return Object.assign({}, state, {
      userChallenges: {},
      error: action.error
    });    

  default:
    return state;
  }
}

export default CommonUserReducer;
