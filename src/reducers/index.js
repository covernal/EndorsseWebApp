import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import MentorUserReducer from './MentorUserReducer';
import CandidateUserReducer from './CandidateUserReducer';
import EmployerUserReducer from './EmployerUserReducer';
import CommonUserReducer from './CommonUserReducer';
import TaskReducer from './TaskReducer';
import AdminUserReducer from './AdminUserReducer';

const rootReducer = combineReducers({
  CommonUserReducer,
  MentorUserReducer,
  CandidateUserReducer,
  EmployerUserReducer,
  TaskReducer,
  AdminUserReducer,
  routing
});

export default rootReducer;
