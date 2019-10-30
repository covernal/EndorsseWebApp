import TaskConstants from '../constants/TaskConstants';
import Immutable from 'immutable';

const initialState = new Immutable.Map({
  taskDetails: {},
  error: null
});

/**
 * Return the Task object based on the API data.
 *
 * @param {state} state The initialState of the object
 * @param {action} action The action the user wishes to perform
 * @return {state} {*} Returns the original state or the featured articles object
 * @constructor
 */
function TaskReducer(state = initialState, action) {
  switch (action.type) {
  case TaskConstants.CREATE_TASK:
  case TaskConstants.EDIT_TASK:
    return Object.assign({}, state, {
      taskDetails: {},
      error: null
    });
  case TaskConstants.CREATE_TASK_SUCCESS:
  case TaskConstants.EDIT_TASK_SUCCESS:
    return Object.assign({}, state, {
      taskDetails: action.response,
      error: null
    });
  case TaskConstants.CREATE_TASK_ERROR:
  case TaskConstants.EDIT_TASK_ERROR:
    return Object.assign({}, state, {
      taskDetails: {},
      error: action.error
    });
  case TaskConstants.DELETE_TASK:
    return Object.assign({}, state, {
      taskDetails: {},
      error: null
    });
  case TaskConstants.DELETE_TASK_SUCCESS:
    return Object.assign({}, state, {
      taskDetails: {},
      error: null
    });
  case TaskConstants.DELETE_TASK_ERROR:
    return Object.assign({}, state, {
      taskDetails: {},
      error: action.error
    });
  default:
    return state;
  }
}

export default TaskReducer;
