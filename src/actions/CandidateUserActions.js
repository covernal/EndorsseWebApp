import CandidateUserConstants from '../constants/CandidateUserConstants';
import ServerConfig from '../../cfg/NodeJS';
import fetch from 'isomorphic-fetch';
import Parse from 'parse';
import _ from 'lodash';

let UserActions = {
  //Candidate Signup
  candidateSignupRequest: function() {
    return {
      type: CandidateUserConstants.CANDIDATE_SIGN_UP
    };
  },

  candidateSignupError: function(error) {
    return {
      error,
      type: CandidateUserConstants.CANDIDATE_SIGN_UP_ERROR
    };
  },

  candidateSignupSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.CANDIDATE_SIGN_UP_SUCCESS
    };
  },

  signup: function(data, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('candidateSignUp', data)
        .then(response => {
          dispatch(_obj.candidateSignupSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.candidateSignupError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Candidate load employers
  candidateLoadEmployersRequest: function() {
    return {
      type: CandidateUserConstants.CANDIDATE_LOAD_EMPLOYERS
    };
  },

  candidateLoadEmployersError: function(error) {
    return {
      error,
      type: CandidateUserConstants.CANDIDATE_LOAD_EMPLOYERS_ERROR
    };
  },

  candidateLoadEmployersSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.CANDIDATE_LOAD_EMPLOYERS_SUCCESS
    };
  },

  candidateLoadEmployers: function(data, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getEmployers', {skip: data})
        .then(response => {
          dispatch(_obj.candidateLoadEmployersSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.candidateLoadEmployersError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Candidate load mentors
  candidateLoadMentorsRequest: function() {
    return {
      type: CandidateUserConstants.CANDIDATE_LOAD_MENTORS
    };
  },

  candidateLoadMentorsError: function(error) {
    return {
      error,
      type: CandidateUserConstants.CANDIDATE_LOAD_MENTORS_ERROR
    };
  },

  candidateLoadMentorsSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.CANDIDATE_LOAD_MENTORS_SUCCESS
    };
  },

  candidateLoadMentors: function(data, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getMentors', {skip: data})
        .then(response => {
          dispatch(_obj.candidateLoadMentorsSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.candidateLoadMentorsError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Candidate load metor tasks
  candidateLoadMentorTasksRequest: function() {
    return {
      type: CandidateUserConstants.CANDIDATE_LOAD_MENTOR_TASKS
    };
  },

  candidateLoadMentorTasksError: function(error) {
    return {
      error,
      type: CandidateUserConstants.CANDIDATE_LOAD_MENTOR_TASKS_ERROR
    };
  },

  candidateLoadMentorTasksSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.CANDIDATE_LOAD_MENTOR_TASKS_SUCCESS
    };
  },

  candidateLoadMentorTasks: function(mentorId, skip, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getMentorTaskTemplates', {mentorId: mentorId, skip: skip})
        .then(response => {
          dispatch(_obj.candidateLoadMentorTasksSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.candidateLoadMentorTasksError(error));
          if(cb != null){
            cb();
          }
        });
  },    

  //Candidate my vouchers
  candidateLoadMyVouchersRequest: function() {
    return {
      type: CandidateUserConstants.CANDIDATE_LOAD_MYVOUCHERS
    };
  },

  candidateLoadMyVouchersError: function(error) {
    return {
      error,
      type: CandidateUserConstants.CANDIDATE_LOAD_MYVOUCHERS_ERROR
    };
  },

  candidateLoadMyVouchersSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.CANDIDATE_LOAD_MYVOUCHERS_SUCCESS
    };
  },

  candidateLoadMyVouchers: function(data, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getMyVouchers', {skip: data})
        .then(vouchers => {
          if(vouchers.length > 0) {
            let gotUsers = 0;
            _.map(vouchers, (v, i) => {
              let fromId = (v.attributes.voucherForUser == v.attributes.inviter) ? v.attributes.inviter : v.attributes.invitee;
              Parse.Cloud.run('getUser', {id: fromId})
                .then(response => {
                  vouchers[i]['from'] = response.attributes;
                  gotUsers++;
                  if(gotUsers == vouchers.length) {
                    dispatch(_obj.candidateLoadMyVouchersSuccess(vouchers));
                    if(cb != null){
                      cb();
                    }
                  }
                })
                .catch(error => {
                  dispatch(_obj.candidateLoadMyVouchersError(error));
                  if(cb != null){
                    cb();
                  }
                });
            });
          }else {
            dispatch(_obj.candidateLoadMyVouchersSuccess(vouchers));
            if(cb != null){
              cb();
            }
          }
        })
        .catch(error => {
          dispatch(_obj.candidateLoadMyVouchersError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Challenge Task
  candidateChallengeTaskError: function(error) {
    return {
      error,
      type: CandidateUserConstants.CANDIDATE_CHALLENGE_TASK_ERROR
    };
  },

  candidateChallengeTaskSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.CANDIDATE_CHALLENGE_TASK_SUCCESS
    };
  },

  challengeTask: function(taskTemplateId, templateCreatedBy, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('challengeTask', {taskTemplateId: taskTemplateId, templateCreatedBy: templateCreatedBy})
        .then(response => {
          dispatch(_obj.candidateChallengeTaskSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.candidateChallengeTaskError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Candidate load employer jobs
  candidateLoadEmployerJobsError: function(error) {
    return {
      error,
      type: CandidateUserConstants.CANDIDATE_EMPLOYER_JOBS_ERROR
    };
  },

  candidateLoadEmployerJobsSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.CANDIDATE_EMPLOYER_JOBS_SUCCESS
    };
  },

  candidateLoadEmployerJobs: function(employerId, skip, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getEmployerJobs', {employerId: employerId, skip: skip})
        .then(response => {
          dispatch(_obj.candidateLoadEmployerJobsSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.candidateLoadEmployerJobsError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Apply Job Application
  candidateApplyJobError: function(error) {
    return {
      error,
      type: CandidateUserConstants.CANDIDATE_APPLY_JOB_ERROR
    };
  },

  candidateApplyJobSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.CANDIDATE_APPLY_JOB_SUCCESS
    };
  },

  applyJob: function(jobId, coverLetterURL, resumeURL, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('applyJob', {jobId: jobId, coverLetterURL: coverLetterURL, resumeURL: resumeURL})
        .then(response => {
          dispatch(_obj.candidateApplyJobSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.candidateApplyJobError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Candidate load task challenges
  candidateLoadTaskChallengesError: function(error) {
    return {
      error,
      type: CandidateUserConstants.CANDIDATE_LOAD_TASK_CHALLENGES_ERROR
    };
  },

  candidateLoadTaskChallengesSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.CANDIDATE_LOAD_TASK_CHALLENGES_SUCCESS
    };
  },

  candidateLoadTaskChallenges: function(skip, cb){
    let _obj = this;
    return dispatch =>
      Parse.Cloud.run('getCandidateTaskChallenges', {skip: skip})
        .then(response => {
          dispatch(_obj.candidateLoadTaskChallengesSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.candidateLoadTaskChallengesError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Retrieve User
  getTaskTemplateError: function(error) {
    return {
      error,
      type: CandidateUserConstants.CANDIDATE_GET_TASK_TEMPLATE_ERROR
    };
  },

  getTaskTemplateSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.CANDIDATE_GET_TASK_TEMPLATE_SUCCESS
    };
  },

  getTaskTemplate: function(id, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getTaskTemplate', {id: id})
        .then(response => {
          dispatch(_obj.getTaskTemplateSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.getTaskTemplateError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Submit solution 
  candidateSubmitFileToChallengeError: function(error) {
    return {
      error,
      type: CandidateUserConstants.CANDIDATE_SUBMIT_SOLUTION_FILE_ERROR
    };
  },

  candidateSubmitFileToChallengeSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.CANDIDATE_SUBMIT_SOLUTION_FILE_SUCCESS
    };
  },

  candidateSubmitFileToChallenge: function(challengeId, fileURL, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('candidateSubmitFileToChallenge', {challengeId: challengeId, fileURL: fileURL})
        .then(response => {
          dispatch(_obj.candidateSubmitFileToChallengeSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.candidateSubmitFileToChallengeError(error));
          if(cb != null){
            cb();
          }
        });
  }, 

  //Pay Challenge
  candidatePayChallengeError: function(error) {
    return {
      error,
      type: CandidateUserConstants.CANDIDATE_PAY_CHALLENGE_ERROR
    };
  },

  candidatePayChallengeSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.CANDIDATE_PAY_CHALLENGE_SUCCESS
    };
  },

  candidatePayChallenge: function(challengeId, cardToken, vouchers, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('candidatePayChallenge', {challengeId: challengeId, cardToken: cardToken, vouchers: vouchers})
        .then(response => {
          dispatch(_obj.candidatePayChallengeSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.candidatePayChallengeError(error));
          if(cb != null){
            cb();
          }
        });
  }, 

  //Review Mentor
  candidateReviewMentorError: function(error) {
    return {
      error,
      type: CandidateUserConstants.CANDIDATE_REVIEW_MENTOR_ERROR
    };
  },

  candidateReviewMentorSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.CANDIDATE_REVIEW_MENTOR_SUCCESS
    };
  },

  candidateReviewMentor: function(challengeId, rate, comment, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('candidateReviewMentor', {challengeId: challengeId, rate: rate, comment: comment})
        .then(response => {
          dispatch(_obj.candidateReviewMentorSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.candidateReviewMentorError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //checkIfCandidateAlreadyInChallenge
  checkIfCandidateAlreadyInChallengeError: function(error) {
    return {
      error,
      type: CandidateUserConstants.CHECKIF_CANDIDATE_ALREADY_CHALLENGE_ERROR
    };
  },

  checkIfCandidateAlreadyInChallengeSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.CHECKIF_CANDIDATE_ALREADY_CHALLENGE_SUCCESS
    };
  },

  checkIfCandidateAlreadyInChallenge: function(cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('checkIfCandidateAlreadyInChallenge', {})
        .then(response => {
          dispatch(_obj.checkIfCandidateAlreadyInChallengeSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.checkIfCandidateAlreadyInChallengeError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //getuserPublic
  getUserPublicError: function(error) {
    return {
      error,
      type: CandidateUserConstants.GET_USER_PUBLIC_ERROR
    };
  },

  getUserPublicSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.GET_USER_PUBLIC_SUCCESS
    };
  },

  getUserPublic: function(id, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getUserPublic', {id: id})
        .then(response => {
          dispatch(_obj.getUserPublicSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.getUserPublicError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Browse Jobs
  getJobsError: function(error) {
    return {
      error,
      type: CandidateUserConstants.GET_JOBS_ERROR
    };
  },

  getJobsSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.GET_JOBS_SUCCESS
    };
  },

  getJobs: function(params, cb){
    /*
    Request params:
        lat: String (optional)
        lon: String (optional)
        skip: int    
    */
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getJobs', params)
        .then(response => {
          dispatch(_obj.getJobsSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.getJobsError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Browse Tasks
  getTaskTemplatesError: function(error) {
    return {
      error,
      type: CandidateUserConstants.CANDIDATE_GET_TASK_TEMPLATES_ERROR
    };
  },

  getTaskTemplatesSuccess: function(response) {
    return {
      response,
      type: CandidateUserConstants.CANDIDATE_GET_TASK_TEMPLATES_SUCCESS
    };
  },

  getTaskTemplates: function(params, cb) {
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getTaskTemplates', params)
        .then(response => {
          dispatch(_obj.getTaskTemplatesSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.getTaskTemplatesError(error));
          if(cb != null){
            cb();
          }
        });
  },

  increaseSocialShareCount: function() {
    return dispatch =>
      Parse.Cloud.run('increaseSocialShareCount');
  }
};

export default UserActions;
