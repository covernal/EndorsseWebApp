import EmployerUserConstants from '../constants/EmployerUserConstants';
import ServerConfig from '../../cfg/NodeJS';
import fetch from 'isomorphic-fetch';
import Parse from 'parse';

let EmployerUserActions = {
  //Employer Signup
  employerSignupRequest: function() {
    return {
      type: EmployerUserConstants.EMPLOYER_SIGN_UP
    };
  },

  employerSignupError: function(error) {
    return {
      error,
      type: EmployerUserConstants.EMPLOYER_SIGN_UP_ERROR
    };
  },

  employerSignupSuccess: function(response) {
    return {
      response,
      type: EmployerUserConstants.EMPLOYER_SIGN_UP_SUCCESS
    };
  },

  signup: function(data, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('newEmployerApplication', data)
        .then(response => {
          dispatch(_obj.employerSignupSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.employerSignupError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Employer load my jobs
  employerLoadMyJobsError: function(error) {
    return {
      error,
      type: EmployerUserConstants.EMPLOYER_LOAD_MYJOBS_ERROR
    };
  },

  employerLoadMyJobsSuccess: function(response) {
    return {
      response,
      type: EmployerUserConstants.EMPLOYER_LOAD_MYJOBS_SUCCESS
    };
  },

  emplyerLoadMyJobs: function(skip, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getMyJobs', {skip: skip})
        .then(response => {
          dispatch(_obj.employerLoadMyJobsSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.employerLoadMyJobsError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Delete Employer Job
  employerDeleteJobError: function(error) {
    return {
      error,
      type: EmployerUserConstants.EMPLOYER_DELETE_JOB_ERROR
    };
  },

  employerDeleteJobSuccess: function(response) {
    return {
      response,
      type: EmployerUserConstants.EMPLOYER_DELETE_JOB_SUCCESS
    };
  },

  employerDeleteJob: function(id, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('deleteJob', {id: id})
        .then(response => {
          dispatch(_obj.employerDeleteJobSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.employerDeleteJobError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Load Employer Job Applications
  employerLoadJobApplicationsError: function(error) {
    return {
      error,
      type: EmployerUserConstants.EMPLOYER_LOAD_JOB_APPLICATIONS_ERROR
    };
  },

  employerLoadJobApplicationsSuccess: function(response) {
    return {
      response,
      type: EmployerUserConstants.EMPLOYER_LOAD_JOB_APPLICATIONS_SUCCESS
    };
  },

  employerLoadJobApplications: function(jobId, skip, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getJobApplications', {jobId: jobId, skip: skip})
        .then(response => {
          dispatch(_obj.employerLoadJobApplicationsSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.employerLoadJobApplicationsError(error));
          if(cb != null){
            cb();
          }
        });
  },  

  //Update Employer Profile
  updateEmployerProfileError: function(error) {
    return {
      error,
      type: EmployerUserConstants.EMPLOYER_UPDATE_PROFILE_ERROR
    };
  },

  updateEmployerProfileSuccess: function(response) {
    return {
      response,
      type: EmployerUserConstants.EMPLOYER_UPDATE_PROFILE_SUCCESS
    };
  },

  updateEmployerProfile: function(data, cb){
    /*
    Request Params:
      - firstName: string
      - lastName: string
      - profileImageURL: string
      - summary: string
      - companyName: string
      - companyURL: string
      - contactNumber: string
      - lat: String
      - lon: String
      - locationString: String    
    */
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('updateEmployerProfile', data)
        .then(response => {
          dispatch(_obj.updateEmployerProfileSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.updateEmployerProfileError(error));
          if(cb != null){
            cb();
          }
        });
  },

  publicUserProfileError: function(error) {
    return {
      error,
      type: EmployerUserConstants.GET_PUBLIC_USER_PROFILE_ERROR
    };
  },

  publicUserProfileSuccess: function(response) {
    return {
      response,
      type: EmployerUserConstants.GET_PUBLIC_USER_PROFILE_SUCCESS
    };
  },

  getPublicUserProfile: function(username, cb){
    let _obj = this;
    return dispatch => {
      Parse.Cloud.run('getPublicUserProfile', {username: username})
      .then(response => {
        dispatch(_obj.publicUserProfileSuccess(response));
        if(cb != null){
          cb();
        }
      })
      .catch(error => {
        dispatch(_obj.publicUserProfileError(error));
        if(cb != null){
          cb();
        }
      });
    };
  },

  //Create New Job
  employerCreateJobError: function(error) {
    return {
      error,
      type: EmployerUserConstants.EMPLOYER_CREATE_JOB_ERROR
    };
  },

  employerCreateJobSuccess: function(response) {
    return {
      response,
      type: EmployerUserConstants.EMPLOYER_CREATE_JOB_SUCCESS
    };
  },

  employerCreateJob: function(data, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('createNewJob', data)
        .then(response => {
          dispatch(_obj.employerCreateJobSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.employerCreateJobError(error));
          if(cb != null){
            cb();
          }
        });
  },  

  //Update Job
  employerUpdateJobError: function(error) {
    return {
      error,
      type: EmployerUserConstants.EMPLOYER_UPDATE_JOB_ERROR
    };
  },

  employerUpdateJobSuccess: function(response) {
    return {
      response,
      type: EmployerUserConstants.EMPLOYER_UPDATE_JOB_SUCCESS
    };
  },

  employerUpdateJob: function(data, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('updateJob', data)
        .then(response => {
          dispatch(_obj.employerUpdateJobSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.employerUpdateJobError(error));
          if(cb != null){
            cb();
          }
        });
  }   
};

export default EmployerUserActions;
