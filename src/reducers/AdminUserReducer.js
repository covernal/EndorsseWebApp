import AdminUserConstants from '../constants/AdminUserConstants';
import Immutable from 'immutable';

const initialState = new Immutable.Map({
  applications: [],
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
function AdminUserReducer(state = initialState, action) {
  switch (action.type) {
  case AdminUserConstants.ADMIN_LOAD_APPLICATIONS:
    return Object.assign({}, state, {
      applications: [],
      error: null
    });
  case AdminUserConstants.ADMIN_LOAD_APPLICATIONS_SUCCESS:
    return Object.assign({}, state, {
      applications: action.response,
      error: null
    });
  case AdminUserConstants.ADMIN_LOAD_APPLICATIONS_ERROR:
    return Object.assign({}, state, {
      applications: [],
      error: action.error
    });
  default:
    return state;
  }
}

export default AdminUserReducer;
