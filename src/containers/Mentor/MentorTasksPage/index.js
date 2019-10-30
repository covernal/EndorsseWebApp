if (process.env.BROWSER) {
  require('./_mentorTasksPage.less');
}

import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import Find from 'lodash/find';
import Without from 'lodash/without';
import SweetAlert from 'sweetalert-react';
import EndorsseOverlay from '../../../components/Widgets/EndorsseOverlay';

import DashboardHeader from '../../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../../components/Layouts/Common/DashboardFooter';
import TaskContent from '../../../components/Layouts/Mentor/Tasks/TaskContent';

import {MentorUserActions, TaskActions, CommonUserActions} from '../../../actions';

class MentorTasksPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      skip: 0,
      myTasks: [],
      hasMoreTasks: true,
      isLoadingMore: false,
      isInitTable: true,
      serverError: null,
      taskServerError: null,
      sendingRequest: false,
      showConfirm: false
    };

    this.loadMoreCallback = this.loadMoreCallback.bind(this);
    this.loadMoreTasks = this.loadMoreTasks.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.createTask = this.createTask.bind(this);
    this.goToPayment = this.goToPayment.bind(this);
  }

  componentDidMount() {
    this.props.loadMentorTasks({
      skip: this.state.skip,
      cb: () => this.loadMoreCallback()
    });
  }

  loadMoreTasks() {
    this.setState({
      isLoadingMore: true
    }, () => {
      this.props.loadMentorTasks({
        skip: this.state.skip,
        cb: () => this.loadMoreCallback()
      });
    });
  }

  loadMoreCallback() {
    if(this.props.serverError != null) {
      this.setState({
        serverError: (this.props.serverError.message == undefined) ? {message: "Internal server error."} : this.props.serverError,
        isInitTable: false,
        isLoadingMore: false
      });
      return;
    }

    if(this.props.mentorTasks.length > 0){
      let limit = 0;
      this.props.mentorTasks.forEach((task) => {
        let existObj = Find(this.state.myTasks, (t) => {
          return t.id == task.id;
        });
        if(existObj == undefined) {
          this.state.myTasks.push(task);
          limit++;
          //Save task in localstorage for quick grab
          localStorage.setItem('tasks', JSON.stringify(this.state.myTasks));
        }
      });

      this.setState({
        skip: this.state.skip + limit,
        myTasks: this.state.myTasks,
        isInitTable: false,
        isLoadingMore: false
      });
    }else{
      this.setState({
        hasMoreTasks: false,
        isInitTable: false,
        isLoadingMore: false
      });
    }
  }

  deleteTask(task) {
    this.setState({
      sendingRequest: true
    }, () => {    
      this.props.deleteTask({
        id: task.id
      }, () => {
        if(this.props.taskServerError != null) {
          this.setState({
            taskServerError: (typeof this.props.taskServerError.message === 'string') ? this.props.taskServerError : this.props.taskServerError.message,
            sendingRequest: false
          });
          return;
        }

        const myTasks = Without(this.state.myTasks, task);
        this.setState({
          myTasks: myTasks,
          sendingRequest: false,
          taskServerError: null
        });
      });
    });
  }

  createTask() {
    this.setState({
      serverError: null,
      sendingRequest: true
    }, () => {        
      this.props.getUser({
        id: Cookie.load('id'),
        cb: () => {
          this.setState({
            serverError: (this.props.commonServerError) ? this.props.commonServerError.message : null,
            sendingRequest: false
          });

          if(this.props.commonServerError == null) {
            let mentor = this.props.userDetails.attributes;     
            if(mentor.stripeLinkedAccountCredentials == undefined) {
              //popup modal
              this.setState({showConfirm: true});
            }else {
              //go to normal create task process
              Cookie.save('creatableTask', 'yes', {path: '/', maxAge: 60*60});              
              this.context.router.push('/new-task');
            }
          }
        }
      });
    });
  }

  goToPayment() {
    this.setState({showConfirm: false});
    this.context.router.push('/payment');
  }

  render() {
    if (!this.props) {
      return null;
    }else{
      let disabled = (this.state.isLoadingMore || !this.state.hasMoreTasks) ? 'disabled' : '';
      let spinnerClass = (this.state.isLoadingMore) ? 'fa fa-spinner fa-spin-custom' : 'fa fa-spinner fa-spin-custom hidden';
      let overlayClass = (this.state.sendingRequest) ? 'endorsse-overlay show' : 'endorsse-overlay';

      return (
        <div className="page-wrapper mentor-tasks-page">
          <header id="topnav">
            <DashboardHeader isPublic={false} />
            <DashboardSubHeader />
          </header>

          <div className="wrapper">
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <div className="page-title-box">
                    <h4 className="page-title">My Tasks</h4>
                  </div>

                  <div className="row">
                    <div className="col-sm-4">
                      <Link onClick={this.createTask} className="btn btn-primary btn-md waves-effect waves-light m-b-30"><i className="mdi mdi-plus-circle"></i> Create New Task</Link>
                    </div>
                  </div>

                  <TaskContent
                    taskData={this.state.myTasks}
                    hasMoreTasks={this.state.hasMoreTasks}
                    isInitTable={this.state.isInitTable}
                    deleteTask={this.deleteTask}
                  />

                  <EndorsseOverlay
                    overlayClass={overlayClass}
                    message="Please wait..."
                  />

                  <SweetAlert
                    show={this.state.showConfirm}
                    title="Oops..."
                    text="To create task and receive payment from candidates, you must link your Stripe account first."
                    type="warning"
                    showCancelButton={true}
                    cancelButtonText="Later"
                    confirmButtonColor="#DD6B55"
                    confirmButtonText="Link Now"
                    onCancel={()=>this.setState({showConfirm: false})}
                    onConfirm={this.goToPayment}
                  />

                  <SweetAlert
                    show={this.state.serverError != null || this.state.taskServerError != null}
                    type="error"
                    title="Oops..."
                    text={(this.state.serverError != null) ? this.state.serverError.message : ((this.state.taskServerError != null) ? this.state.taskServerError.message : '')}
                    onConfirm={()=>this.setState({serverError: null, taskServerError: null})}
                  />                  

                  <div className="text-center">
                    <div className="text-center">
                      <button type="button" disabled={disabled} className="btn btn-default waves-effect w-md waves-light m-t-0 m-b-30" data-toggle="modal" data-target="#custom-width-modal" onClick={this.loadMoreTasks}><i className={spinnerClass} aria-hidden="true"></i> {(this.state.hasMoreTasks) ? 'Load More' : 'No More Task'}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DashboardFooter />
        </div>
      );
    }
  }
}

MentorTasksPage.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    mentorTasks: state.MentorUserReducer.mentorTasks,
    userDetails: state.CommonUserReducer.userDetails,
    commonServerError: state.CommonUserReducer.error,    
    serverError: state.MentorUserReducer.error,
    taskServerError: state.TaskReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUser: (req) => {
      dispatch(CommonUserActions.getUser(req.id, req.cb));
    },

    loadMentorTasks: (req) => {
      dispatch(MentorUserActions.mentorLoadTasks(req.skip, req.cb));
    },

    deleteTask: (data, cb) =>{
      dispatch(TaskActions.deleteTask(data, cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MentorTasksPage);
