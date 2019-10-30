import TaskConstants from '../constants/TaskConstants';
import Parse from 'parse';
import cookie from 'react-cookie';
import _ from 'lodash';

let TaskActions = {
  //Create task
  createTaskRequest: function() {
    return {
      type: TaskConstants.CREATE_TASK
    };
  },

  createTaskError: function(error) {
    return {
      error,
      type: TaskConstants.CREATE_TASK_ERROR
    };
  },

  createTaskSuccess: function(response) {
    return {
      response,
      type: TaskConstants.CREATE_TASK_SUCCESS
    };
  },

  createNewTask: function(data, cb){
    let _obj = this;
    return dispatch => {
      Parse.Cloud.run('createTaskTemplate', data)
        .then(response => {
          dispatch(_obj.createTaskSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.createTaskError(error));
          if(cb != null){
            cb();
          }
        });
    };
  },

  //Edit task
  editTaskRequest: function() {
    return {
      type: TaskConstants.EDIT_TASK
    };
  },

  editTaskError: function(error) {
    return {
      error,
      type: TaskConstants.EDIT_TASK_ERROR
    };
  },

  editTaskSuccess: function(response) {
    return {
      response,
      type: TaskConstants.EDIT_TASK_SUCCESS
    };
  },

  editTask: function(data, cb){
    let _obj = this;
    return dispatch => {
      Parse.Cloud.run('updateTaskTemplate', data)
        .then(response => {
          dispatch(_obj.createTaskSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.createTaskError(error));
          if(cb != null){
            cb();
          }
        });
    };
  },

  //Delete task
  deleteTaskRequest: function() {
    return {
      type: TaskConstants.DELETE_TASK
    };
  },

  deleteTaskError: function(error) {
    return {
      error,
      type: TaskConstants.DELETE_TASK_ERROR
    };
  },

  deleteTaskSuccess: function(response) {
    return {
      response,
      type: TaskConstants.DELETE_TASK_SUCCESS
    };
  },

  deleteTask: function(data, cb){
    let _obj = this;
    return dispatch => {
      Parse.Cloud.run('deleteTaskTemplate', data)
        .then(response => {
          dispatch(_obj.deleteTaskSuccess(response));
          if(cb != null){
            cb();
          }
        })
        .catch(error => {
          dispatch(_obj.deleteTaskError(error));
          if(cb != null){
            cb();
          }
        });
    };
  }

};

export default TaskActions;
