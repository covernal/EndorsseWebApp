import EmployerUserConstants from '../constants/EmployerUserConstants';
import Immutable from 'immutable';

const initialState = new Immutable.Map({
  userDetails: {},
  error: null
});

/**
 * Return the Employer User object based on the API data.
 *
 * @param {state} state The initialState of the object
 * @param {action} action The action the user wishes to perform
 * @return {state} {*} Returns the original state or the featured articles object
 * @constructor
 */
function EmployerUserReducer(state = initialState, action) {
  switch (action.type) {
  case EmployerUserConstants.EMPLOYER_SIGN_UP:
    return Object.assign({}, state, {
      userDetails: {},
      error: null
    });
  case EmployerUserConstants.EMPLOYER_SIGN_UP_SUCCESS:
    return Object.assign({}, state, {
      userDetails: action.response,
      error: null
    });
  case EmployerUserConstants.EMPLOYER_SIGN_UP_ERROR:
    return Object.assign({}, state, {
      userDetails: {},
      error: action.error
    });

  //Get My Jobs
  case EmployerUserConstants.EMPLOYER_LOAD_MYJOBS_SUCCESS:
    return Object.assign({}, state, {
      employerMyJobs: action.response,
      error: null
    });
  case EmployerUserConstants.EMPLOYER_LOAD_MYJOBS_ERROR:
    return Object.assign({}, state, {
      employerMyJobs: {},
      error: action.error
    });    

  //Delete Job
  case EmployerUserConstants.EMPLOYER_DELETE_JOB_SUCCESS:
    return Object.assign({}, state, {
      employerJobDeleted: action.response,
      error: null
    });
  case EmployerUserConstants.EMPLOYER_DELETE_JOB_ERROR:
    return Object.assign({}, state, {
      employerJobDeleted: {},
      error: action.error
    });    

  //Load Job Applications
  case EmployerUserConstants.EMPLOYER_LOAD_JOB_APPLICATIONS_SUCCESS:
    return Object.assign({}, state, {
      employerJobApplications: action.response,
      error: null
    });

  case EmployerUserConstants.EMPLOYER_LOAD_JOB_APPLICATIONS_ERROR:
    return Object.assign({}, state, {
      employerJobApplications: {},
      error: action.error
    });    
  
  //Update employer profile
  case EmployerUserConstants.EMPLOYER_UPDATE_PROFILE_SUCCESS:
    return Object.assign({}, state, {
      employerDetails: action.response,
      error: null
    });

  case EmployerUserConstants.EMPLOYER_UPDATE_PROFILE_ERROR:
    return Object.assign({}, state, {
      employerDetails: {},
      error: action.error
    }); 

  //Get employer public profile
  case EmployerUserConstants.GET_PUBLIC_USER_PROFILE_SUCCESS:
    return Object.assign({}, state, {
      employerDetails: action.response,
      error: null
    });

  case EmployerUserConstants.GET_PUBLIC_USER_PROFILE_ERROR:
    return Object.assign({}, state, {
      employerDetails: {},
      error: action.error
    });      

  //Create Job
  case EmployerUserConstants.EMPLOYER_CREATE_JOB_SUCCESS:
    return Object.assign({}, state, {
      employerJobCreated: action.response,
      error: null
    });
  case EmployerUserConstants.EMPLOYER_CREATE_JOB_ERROR:
    return Object.assign({}, state, {
      employerJobCreated: {},
      error: action.error
    });  

  //Update Job
  case EmployerUserConstants.EMPLOYER_UPDATE_JOB_SUCCESS:
    return Object.assign({}, state, {
      employerJobUpdated: action.response,
      error: null
    });
  case EmployerUserConstants.EMPLOYER_UPDATE_JOB_ERROR:
    return Object.assign({}, state, {
      employerJobUpdated: {},
      error: action.error
    });            
  default:
    return state;
  }  
}

export default EmployerUserReducer;
