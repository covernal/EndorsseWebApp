import AdminUserConstants from '../constants/AdminUserConstants';
import ServerConfig from '../../cfg/NodeJS';
import Parse from 'parse';

let UserActions = {
  //Admin load tasks
  adminLoadApplicationsRequest: function() {
    return {
      type: AdminUserConstants.ADMIN_LOAD_APPLICATIONS
    };
  },

  adminLoadApplicationsError: function(error) {
    return {
      error,
      type: AdminUserConstants.ADMIN_LOAD_APPLICATIONS_ERROR
    };
  },

  adminLoadApplicationsSuccess: function(response) {
    return {
      response,
      type: AdminUserConstants.ADMIN_LOAD_APPLICATIONS_SUCCESS
    };
  },

  adminLoadApplications: function(data, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getNewMentorApplications', {skip: data})
        .then(response => {
          dispatch(_obj.adminLoadApplicationsSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.adminLoadApplicationsError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //approve application
  adminApproveApplicationRequest: function() {
    return {
      type: AdminUserConstants.ADMIN_APPROVE_APPLICATION
    };
  },

  adminApproveApplicationError: function(error) {
    return {
      error,
      type: AdminUserConstants.ADMIN_APPROVE_APPLICATION_ERROR
    };
  },

  adminApproveApplicationSuccess: function(response) {
    return {
      response,
      type: AdminUserConstants.ADMIN_APPROVE_APPLICATION_SUCCESS
    };
  },

  adminApproveApplication: function(data, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('approveMentorApplication', {mentorId: data.id})
        .then(response => {
          dispatch(_obj.adminApproveApplicationSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.adminApproveApplicationError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //reject application
  adminRejectApplicationRequest: function() {
    return {
      type: AdminUserConstants.ADMIN_REJECT_APPLICATION
    };
  },

  adminRejectApplicationError: function(error) {
    return {
      error,
      type: AdminUserConstants.ADMIN_REJECT_APPLICATION_ERROR
    };
  },

  adminRejectApplicationSuccess: function(response) {
    return {
      response,
      type: AdminUserConstants.ADMIN_REJECT_APPLICATION_SUCCESS
    };
  },

  adminRejectApplication: function(data, cb){
    let _obj = this;
    return dispatch =>
      Parse.Cloud.run('rejectMentorApplication', {mentorId: data.id})
        .then(response => {
          dispatch(_obj.adminRejectApplicationSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.adminRejectApplicationError(error));
          if(cb != null){
            cb();
          }
        });
  }

};

export default UserActions;
