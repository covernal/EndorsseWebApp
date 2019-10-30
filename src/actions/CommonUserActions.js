import CommonUserConstants from '../constants/CommonUserConstants';
import Parse from 'parse';
import cookie from 'react-cookie';
import _ from 'lodash';

let CommonUserActions = {
  //Reset Password
  commonUserResetPasswordRequest: function() {
    return {
      type: CommonUserConstants.COMMON_USER_RESET_PASSWORD
    };
  },

  commonUserResetPasswordError: function(error) {
    return {
      error,
      type: CommonUserConstants.COMMON_USER_RESET_PASSWORD_ERROR
    };
  },

  commonUserResetPasswordSuccess: function(response) {
    return {
      response,
      type: CommonUserConstants.COMMON_USER_RESET_PASSWORD_SUCCESS
    };
  },

  resetPassword: function(data, cb){
    let _obj = this;
    return dispatch => {
      Parse.User.requestPasswordReset(data)
      .then(response => {
        dispatch(_obj.commonUserResetPasswordSuccess(response));
        if(cb != null){
          cb();
        }
      })
      .catch(error => {
        dispatch(_obj.commonUserResetPasswordError(error));
        if(cb != null){
          cb();
        }
      });
    };
  },

  //Retrieve public user profile
  publicUserProfileRequest: function() {
    return {
      type: CommonUserConstants.GET_PUBLIC_USER_PROFILE
    };
  },

  publicUserProfileError: function(error) {
    return {
      error,
      type: CommonUserConstants.GET_PUBLIC_USER_PROFILE_ERROR
    };
  },

  publicUserProfileSuccess: function(response) {
    return {
      response,
      type: CommonUserConstants.GET_PUBLIC_USER_PROFILE_SUCCESS
    };
  },

  getPublicUserProfile: function(data, cb){
    let _obj = this;
    return dispatch => {
      Parse.Cloud.run('getPublicUserProfile', data)
      .then(response => {
        const type = response.user.attributes.type;
        if(response.challenges.length > 0){
          let promises = [];
          let userIdsSet = new Set();
          _.forEach(response.challenges, challenge => {
            const userId = challenge.get((type == "candidate") ? "mentor" : "candidate");
            userIdsSet.add(userId);
          });
          const userIdsArray = [...userIdsSet];
          _.forEach(userIdsArray, id => {
            const req = {
              id: id
            };
            promises.push(Parse.Cloud.run('getUserPublic', req));
          });
          Parse.Promise.when(promises).then(users => {
            _.forEach(response.challenges, (challenge, index) => {
              response.challenges[index].set('type', type);
              //for Candidate
              if(type == "candidate") {
                const mentorId = challenge.get('mentor');
                const mentorUser = _.find(users, user => {
                  return user.id == mentorId;
                });
                if(mentorUser){
                  const mentorFullName = `${mentorUser.get('firstName')} ${mentorUser.get('lastName')}`;
                  const mentorUsername = mentorUser.get('username');
                  response.challenges[index].set('mentorFullName', mentorFullName);
                  response.challenges[index].set('mentorUsername', mentorUsername);
                }
              }

              //for Mentor
              if(type == "mentor") {
                const candidateId = challenge.get('candidate');
                const candidateUser = _.find(users, user => {
                  return user.id == candidateId;
                });
                if(candidateUser){
                  const candidateFullName = `${candidateUser.get('firstName')} ${candidateUser.get('lastName')}`;
                  const candidateUsername = candidateUser.get('username');
                  response.challenges[index].set('candidateFullName', candidateFullName);
                  response.challenges[index].set('candidateUsername', candidateUsername);
                }              
              }
            });
            dispatch(_obj.publicUserProfileSuccess(response));
            if(cb != null){
              cb();
            }
          });
        }else{
          dispatch(_obj.publicUserProfileSuccess(response));
          if(cb != null){
            cb();
          }
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

  // Login
  userLoginRequest: function() {
    return {
      type: CommonUserConstants.USER_LOGIN
    };
  },

  userLoginError: function(error) {
    return {
      error,
      type: CommonUserConstants.USER_LOGIN_ERROR
    };
  },

  userLoginSuccess: function(response) {
    return {
      response,
      type: CommonUserConstants.USER_LOGIN_SUCCESS
    };
  },

  login: function(data, cb){
    let _obj = this;
    const session = cookie.load('session');
    if(session){
      return dispatch => {
        Parse.User.become(session)
        .then(response => {
          dispatch(_obj.userLoginSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.UserLoginError(error));
          if(cb != null){
            cb();
          }
        });
      };
    }else{
      const {userName, password} = data;
      return dispatch => {
        Parse.User.logIn(userName,password)
        .then(response => {
          dispatch(_obj.userLoginSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.userLoginError(error));
          if(cb != null){
            cb();
          }
        });
      };
    }
  },

  // Update user
  userUpdateRequest: function() {
    return {
      type: CommonUserConstants.USER_UPDATE
    };
  },

  userUpdateError: function(error) {
    return {
      error,
      type: CommonUserConstants.USER_UPDATE_ERROR
    };
  },

  userUpdateSuccess: function(response) {
    return {
      response,
      type: CommonUserConstants.USER_UPDATE_SUCCESS
    };
  },

  userUpdate: function(data, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('updateUserProfile', data)
        .then(response => {
          dispatch(_obj.userUpdateSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.userUpdateError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Retrieve User
  getUserError: function(error) {
    return {
      error,
      type: CommonUserConstants.GET_USER_ERROR
    };
  },

  getUserSuccess: function(response) {
    return {
      response,
      type: CommonUserConstants.GET_USER_SUCCESS
    };
  },

  getUser: function(id, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getUser', {id: id})
        .then(response => {
          dispatch(_obj.getUserSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.getUserError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //Get the most recent completed challenge
  getUserMostRecentTaskChallengesError: function(error) {
    return {
      error,
      type: CommonUserConstants.GET_USER_RECENT_CHALLENGES_ERROR
    };
  },

  getUserMostRecentTaskChallengesSuccess: function(response) {
    return {
      response,
      type: CommonUserConstants.GET_USER_RECENT_CHALLENGES_SUCCESS
    };
  },

  getUserMostRecentTaskChallenges: function(userType, userId, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getUserMostRecentTaskChallenges', {userType: userType, userId: userId})
        .then(response => {
          dispatch(_obj.getUserMostRecentTaskChallengesSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.getUserMostRecentTaskChallengesError(error));
          if(cb != null){
            cb();
          }
        });
  },

  //load All Challenges  
  loadAllChallengesError: function(error) {
    return {
      error,
      type: CommonUserConstants.LOAD_ALL_CHALLENGES_ERROR
    };
  },

  loadAllChallengesSuccess: function(response) {
    return {
      response,
      type: CommonUserConstants.LOAD_ALL_CHALLENGES_SUCCESS
    };
  },

  loadAllChallenges: function(userType, userId, skip, cb){
    let _obj = this;

    return dispatch =>
      Parse.Cloud.run('getUserTaskChallenges', {userType: userType, userId: userId, skip: skip})
        .then(response => {
          dispatch(_obj.loadAllChallengesSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.loadAllChallengesError(error));
          if(cb != null){
            cb();
          }
        });
  }
};

export default CommonUserActions;
