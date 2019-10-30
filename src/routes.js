import React from 'react';
import {Route} from 'react-router';
import App from './App';
import ResetPasswordPage from './containers/Common/ResetPasswordPage';
import LoginPage from './containers/Common/LoginPage';
import PublicProfilePage from './containers/Common/PublicProfilePage';
import PublicChallengesPage from './containers/Common/PublicChallengesPage';
import MyProfilePage from './containers/Common/MyProfilePage';

import MentorTasksPage from './containers/Mentor/MentorTasksPage';
import NewTaskPage from './containers/Mentor/NewTaskPage';
import EditTaskPage from './containers/Mentor/EditTaskPage';
import MentorPaymentPage from './containers/Mentor/MentorPaymentPage';
import MentorSignupPage from './containers/Mentor/MentorSignupPage';
import MentorMyChallengesPage from './containers/Mentor/MentorMyChallengesPage';

import AdminApplicationsPage from './containers/Admin/AdminApplicationsPage';

import EmployerSignupPage from './containers/Employer/EmployerSignupPage';
import EmployerPublicProfilePage from './containers/Employer/EmployerPublicProfilePage';
import EmployerPublicAllJobsPage from './containers/Employer/EmployerPublicAllJobsPage';
import EmployerMyJobsPage from './containers/Employer/EmployerMyJobsPage';
import EmployerCandidatesPage from './containers/Employer/EmployerCandidatesPage';
import NewEmployerJobPage from './containers/Employer/NewEmployerJobPage';
import EditEmployerJobPage from './containers/Employer/EditEmployerJobPage';
import UserProfileEmployerPage from './containers/Employer/UserProfileEmployerPage';

import CandidateSignupPage from './containers/Candidate/CandidateSignupPage';
import CandidateEmployerListPage from './containers/Candidate/CandidateEmployerListPage';
import CandidateMentorListPage from './containers/Candidate/CandidateMentorListPage';
import CandidateMyVouchersPage from './containers/Candidate/CandidateMyVouchersPage';
import CandidateMentorTasksPage from './containers/Candidate/CandidateMentorTasksPage';
import CandidateMentorTaskDetailPage from './containers/Candidate/CandidateMentorTaskDetailPage';
import CandidateMyChallengesPage from './containers/Candidate/CandidateMyChallengesPage';
import EmployerJobsPage from './containers/Candidate/EmployerJobsPage';
import JobDetailsPage from './containers/Candidate/JobDetailsPage';
import BrowseJobsPage from './containers/Candidate/BrowseJobsPage';
import BrowseTasksPage from './containers/Candidate/BrowseTasksPage';

import ErrorPage from './containers/404/ErrorPage';
import Utils from './utils';

let requireAuth = (nextState, replace) => {
  if(!Utils.AuthHelper.isLoggedIn()){
    replace({
      pathname: '/login',
      state: {
        nextPathname: nextState.location.pathname
      }
    });
  }
};

let requireMentorAuth = (nextState, replace) => {
  if(!Utils.AuthHelper.isLoggedIn() || !Utils.AuthHelper.roleCheck('mentor')){
    replace({
      pathname: '/login',
      state: {
        nextPathname: nextState.location.pathname
      }
    });
  }
};

let requireCandidateAuth = (nextState, replace) => {
  if(!Utils.AuthHelper.isLoggedIn() || !Utils.AuthHelper.roleCheck('candidate')){
    replace({
      pathname: '/login',
      state: {
        nextPathname: nextState.location.pathname
      }
    });
  }
};

let requireEmployerAuth = (nextState, replace) => {
  if(!Utils.AuthHelper.isLoggedIn() || !Utils.AuthHelper.roleCheck('employer')){
    replace({
      pathname: '/login',
      state: {
        nextPathname: nextState.location.pathname
      }
    });
  }
};

let requireAdminAuth = (nextState, replace) => {
  if(!Utils.AuthHelper.isLoggedIn() || !Utils.AuthHelper.roleCheck('admin')){
    replace({
      pathname: '/login',
      state: {
        nextPathname: nextState.location.pathname
      }
    });
  }
};

export default (
  <Route component={App}>
    <Route path="/" component={LoginPage} />
    <Route path="/profile/:username" component={PublicProfilePage} />
    <Route path="/challenges/:username" component={PublicChallengesPage} onEnter={requireAuth} />
    <Route path="/my-profile" component={MyProfilePage} onEnter={requireAuth} />
    <Route path="/my-tasks" component={MentorTasksPage} onEnter={requireMentorAuth} />
    <Route path="/new-task" component={NewTaskPage} onEnter={requireMentorAuth} />
    <Route path="/edit-task/:id" component={EditTaskPage} onEnter={requireMentorAuth} />
    <Route path="/payment" component={MentorPaymentPage} onEnter={requireMentorAuth}/>
    <Route path="/mentor-challenges" component={MentorMyChallengesPage} onEnter={requireMentorAuth}/>
    <Route path="/reset-password" component={ResetPasswordPage} />
    <Route path="/mentor-signup" component={MentorSignupPage} />
    <Route path="/employer-signup" component={EmployerSignupPage} />    
    <Route path="/employer-profile-edit" component={UserProfileEmployerPage} onEnter={requireEmployerAuth} />
    <Route path="/my-jobs" component={EmployerMyJobsPage} onEnter={requireEmployerAuth} />
    <Route path="/candidates/:id" component={EmployerCandidatesPage} onEnter={requireEmployerAuth}  />
    <Route path="/new-job" component={NewEmployerJobPage} onEnter={requireEmployerAuth}  />
    <Route path="/edit-job/:id" component={EditEmployerJobPage} onEnter={requireEmployerAuth}  />    
    <Route path="/candidate-signup" component={CandidateSignupPage} />    
    <Route path="/employers" component={CandidateEmployerListPage} onEnter={requireCandidateAuth} />
    <Route path="/mentors" component={CandidateMentorListPage} onEnter={requireCandidateAuth} />
    <Route path="/vouchers" component={CandidateMyVouchersPage} onEnter={requireCandidateAuth} />
    <Route path="/mentor-tasks/:username" component={CandidateMentorTasksPage} onEnter={requireCandidateAuth} />
    <Route path="/task-detail/:id" component={CandidateMentorTaskDetailPage} onEnter={requireAuth} />
    <Route path="/candidate-challenges" component={CandidateMyChallengesPage} onEnter={requireCandidateAuth} />
    <Route path="/employer-jobs/:username" component={EmployerJobsPage} onEnter={requireCandidateAuth} />
    <Route path="/browse-jobs" component={BrowseJobsPage} onEnter={requireCandidateAuth} />
    <Route path="/browse-tasks" component={BrowseTasksPage} onEnter={requireCandidateAuth} />    
    <Route path="/employer-profile/:username" component={EmployerPublicProfilePage} />
    <Route path="/all-jobs/:username" component={EmployerPublicAllJobsPage} onEnter={requireAuth} />
    <Route path="/job-details/:id" component={JobDetailsPage} onEnter={requireAuth} />    
    <Route path="/mentor-applications" component={AdminApplicationsPage} onEnter={requireAdminAuth} />    
    <Route path="/login" component={LoginPage} />
    <Route path="*" component={ErrorPage} />
  </Route>
);
