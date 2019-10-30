import CandidateUserConstants from '../constants/CandidateUserConstants';
import Immutable from 'immutable';

const initialState = new Immutable.Map({
  userDetails: {},
  error: null
});

/**
 * Return the Candidate User object based on the API data.
 *
 * @param {state} state The initialState of the object
 * @param {action} action The action the user wishes to perform
 * @return {state} {*} Returns the original state or the featured articles object
 * @constructor
 */
function CandidateUserReducer(state = initialState, action) {
  switch (action.type) {
  case CandidateUserConstants.CANDIDATE_SIGN_UP:
    return Object.assign({}, state, {
      userDetails: {},
      error: null
    });
  case CandidateUserConstants.CANDIDATE_SIGN_UP_SUCCESS:
    return Object.assign({}, state, {
      userDetails: action.response,
      error: null
    });
  case CandidateUserConstants.CANDIDATE_SIGN_UP_ERROR:
    return Object.assign({}, state, {
      userDetails: {},
      error: action.error
    });  

  //Employers
  case CandidateUserConstants.CANDIDATE_LOAD_EMPLOYERS:
    return Object.assign({}, state, {
      candidateEmployers: {},
      error: null
    });
  case CandidateUserConstants.CANDIDATE_LOAD_EMPLOYERS_SUCCESS:
    return Object.assign({}, state, {
      candidateEmployers: action.response,
      error: null
    });
  case CandidateUserConstants.CANDIDATE_LOAD_EMPLOYERS_ERROR:
    return Object.assign({}, state, {
      candidateEmployers: {},
      error: action.error
    });   

  //Mentors
  case CandidateUserConstants.CANDIDATE_LOAD_MENTORS:
    return Object.assign({}, state, {
      candidateMentors: {},
      error: null
    });
  case CandidateUserConstants.CANDIDATE_LOAD_MENTORS_SUCCESS:
    return Object.assign({}, state, {
      candidateMentors: action.response,
      error: null
    });
  case CandidateUserConstants.CANDIDATE_LOAD_MENTORS_ERROR:
    return Object.assign({}, state, {
      candidateMentors: {},
      error: action.error
    });

  //Mentor Tasks
  case CandidateUserConstants.CANDIDATE_LOAD_MENTOR_TASKS:
    return Object.assign({}, state, {
      candidateMentorTasks: {},
      error: null
    });
  case CandidateUserConstants.CANDIDATE_LOAD_MENTOR_TASKS_SUCCESS:
    return Object.assign({}, state, {
      candidateMentorTasks: action.response,
      error: null
    });
  case CandidateUserConstants.CANDIDATE_LOAD_MENTOR_TASKS_ERROR:
    return Object.assign({}, state, {
      candidateMentorTasks: {},
      error: action.error
    });    

  //My vouchers
  case CandidateUserConstants.CANDIDATE_LOAD_MYVOUCHERS:
    return Object.assign({}, state, {
      candidateMyVouchers: {},
      error: null
    });
  case CandidateUserConstants.CANDIDATE_LOAD_MYVOUCHERS_SUCCESS:
    return Object.assign({}, state, {
      candidateMyVouchers: action.response,
      error: null
    });
  case CandidateUserConstants.CANDIDATE_LOAD_MYVOUCHERS_ERROR:
    return Object.assign({}, state, {
      candidateMyVouchers: {},
      error: action.error
    }); 

  //Challenge Task
  case CandidateUserConstants.CANDIDATE_CHALLENGE_TASK:
    return Object.assign({}, state, {
      candidateTaskChallenged: {},
      error: null
    });
  case CandidateUserConstants.CANDIDATE_CHALLENGE_TASK_SUCCESS:
    return Object.assign({}, state, {
      candidateTaskChallenged: action.response,
      error: null
    });
  case CandidateUserConstants.CANDIDATE_CHALLENGE_TASK_ERROR:
    return Object.assign({}, state, {
      candidateTaskChallenged: {},
      error: action.error
    });        

  //Employer Jobs
  case CandidateUserConstants.CANDIDATE_EMPLOYER_JOBS:
    return Object.assign({}, state, {
      candidateEmployerJobs: {},
      error: null
    });
  case CandidateUserConstants.CANDIDATE_EMPLOYER_JOBS_SUCCESS:
    return Object.assign({}, state, {
      candidateEmployerJobs: action.response,
      error: null
    });
  case CandidateUserConstants.CANDIDATE_EMPLOYER_JOBS_ERROR:
    return Object.assign({}, state, {
      candidateEmployerJobs: {},
      error: action.error
    });   

  //Apply Job Application
  case CandidateUserConstants.CANDIDATE_APPLY_JOB:
    return Object.assign({}, state, {
      candidateJobApplied: {},
      error: null
    });
  case CandidateUserConstants.CANDIDATE_APPLY_JOB_SUCCESS:
    return Object.assign({}, state, {
      candidateJobApplied: action.response,
      error: null
    });
  case CandidateUserConstants.CANDIDATE_APPLY_JOB_ERROR:
    return Object.assign({}, state, {
      candidateJobApplied: {},
      error: action.error
    });        

  //Load Task Challenge
  case CandidateUserConstants.CANDIDATE_LOAD_TASK_CHALLENGES:
    return Object.assign({}, state, {
      candidateTaskChallenges: {},
      error: null
    });
  case CandidateUserConstants.CANDIDATE_LOAD_TASK_CHALLENGES_SUCCESS:
    return Object.assign({}, state, {
      candidateTaskChallenges: action.response,
      error: null
    });
  case CandidateUserConstants.CANDIDATE_LOAD_TASK_CHALLENGES_ERROR:
    return Object.assign({}, state, {
      candidateTaskChallenges: {},
      error: action.error
    });     

  //Get Task Template
  case CandidateUserConstants.CANDIDATE_GET_TASK_TEMPLATE:
    return Object.assign({}, state, {
      candidateTaskTemplate: {},
      error: null
    });
  case CandidateUserConstants.CANDIDATE_GET_TASK_TEMPLATE_SUCCESS:
    return Object.assign({}, state, {
      candidateTaskTemplate: action.response,
      error: null
    });
  case CandidateUserConstants.CANDIDATE_GET_TASK_TEMPLATE_ERROR:
    return Object.assign({}, state, {
      candidateTaskTemplate: {},
      error: action.error
    });     

  //Submit solution file
  case CandidateUserConstants.CANDIDATE_SUBMIT_SOLUTION_FILE:
    return Object.assign({}, state, {
      candidateFileSubmitted: {},
      error: null
    });
  case CandidateUserConstants.CANDIDATE_SUBMIT_SOLUTION_FILE_SUCCESS:
    return Object.assign({}, state, {
      candidateFileSubmitted: action.response,
      error: null
    });
  case CandidateUserConstants.CANDIDATE_SUBMIT_SOLUTION_FILE_ERROR:
    return Object.assign({}, state, {
      candidateFileSubmitted: {},
      error: action.error
    });   

  //Pay Challenge
  case CandidateUserConstants.CANDIDATE_PAY_CHALLENGE:
    return Object.assign({}, state, {
      candidateChallengePaid: {},
      error: null
    });
  case CandidateUserConstants.CANDIDATE_PAY_CHALLENGE_SUCCESS:
    return Object.assign({}, state, {
      candidateChallengePaid: action.response,
      error: null
    });
  case CandidateUserConstants.CANDIDATE_PAY_CHALLENGE_ERROR:
    return Object.assign({}, state, {
      candidateChallengePaid: {},
      error: action.error
    }); 

  //Review Mentor
  case CandidateUserConstants.CANDIDATE_REVIEW_MENTOR:
    return Object.assign({}, state, {
      candidateReviewed: {},
      error: null
    });
  case CandidateUserConstants.CANDIDATE_REVIEW_MENTOR_SUCCESS:
    return Object.assign({}, state, {
      candidateReviewed: action.response,
      error: null
    });
  case CandidateUserConstants.CANDIDATE_REVIEW_MENTOR_ERROR:
    return Object.assign({}, state, {
      candidateReviewed: {},
      error: action.error
    });           

  //checkIfCandidateAlreadyInChallenge
  case CandidateUserConstants.CHECKIF_CANDIDATE_ALREADY_CHALLENGE:
    return Object.assign({}, state, {
      candidateAlreadyChallenged: {},
      error: null
    });
  case CandidateUserConstants.CHECKIF_CANDIDATE_ALREADY_CHALLENGE_SUCCESS:
    return Object.assign({}, state, {
      candidateAlreadyChallenged: action.response,
      error: null
    });
  case CandidateUserConstants.CHECKIF_CANDIDATE_ALREADY_CHALLENGE_ERROR:
    return Object.assign({}, state, {
      candidateAlreadyChallenged: {},
      error: action.error
    });

  //getUserPublic
  case CandidateUserConstants.GET_USER_PUBLIC:
    return Object.assign({}, state, {
      userPublicData: {},
      error: null
    });
  case CandidateUserConstants.GET_USER_PUBLIC_SUCCESS:
    return Object.assign({}, state, {
      userPublicData: action.response,
      error: null
    });
  case CandidateUserConstants.GET_USER_PUBLIC_ERROR:
    return Object.assign({}, state, {
      userPublicData: {},
      error: action.error
    });  

  //Browse Jobs
  case CandidateUserConstants.GET_JOBS:
    return Object.assign({}, state, {
      jobsData: {},
      error: null
    });
  case CandidateUserConstants.GET_JOBS_SUCCESS:
    return Object.assign({}, state, {
      jobsData: action.response,
      error: null
    });
  case CandidateUserConstants.GET_JOBS_ERROR:
    return Object.assign({}, state, {
      jobsData: {},
      error: action.error
    });  

  //Browse Tasks
  case CandidateUserConstants.CANDIDATE_GET_TASK_TEMPLATES:
    return Object.assign({}, state, {
      tasksData: {},
      error: null
    });
  case CandidateUserConstants.CANDIDATE_GET_TASK_TEMPLATES_SUCCESS:
    return Object.assign({}, state, {
      tasksData: action.response,
      error: null
    });
  case CandidateUserConstants.CANDIDATE_GET_TASK_TEMPLATES_ERROR:
    return Object.assign({}, state, {
      tasksData: {},
      error: action.error
    });     

  default:
    return state;
  }
}

export default CandidateUserReducer;
