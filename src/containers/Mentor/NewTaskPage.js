import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import TaskForm from '../../components/Widgets/EndorsseForm/TaskForm';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';

import {MentorUserActions, TaskActions} from '../../actions';

class NewTaskPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      serverError: this.props.serverError,
      sendingRequest: false,
      isUploading: false
    };

    this.createNewTask = this.createNewTask.bind(this);
    this.setParentState = this.setParentState.bind(this);
  }

  componentWillMount() {
    if(Cookie.load('creatableTask') == undefined) {
      this.context.router.push('/my-tasks');
      return;
    }
  }

  createNewTask(data) {
    this.props.createNewTask(data, () => {
      this.setState({
        sendingRequest: false
      }, () => {
        if(this.props.serverError == null) {
          this.context.router.push('/my-tasks');
          return;
        }        

        this.setState({
          serverError: this.props.serverError
        });
      });
    });
  }  

  setParentState(obj, cb) {
    Object.keys(obj).forEach((key) => {
      this.setState({
        [key]: obj[key]
      }, () => {
        if(cb != undefined) {
          cb();
        }
      });
    });
  }

  render() {
    if (!this.props) {
      return null;
    }else{
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
                    <h4 className="page-title">Create New Task</h4>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="card-box">
                    <TaskForm
                      action="newTask"
                      setParentState={this.setParentState}
                      createNewTask={this.createNewTask}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <EndorsseOverlay
            overlayClass={overlayClass}
            message={(this.state.isUploading) ? "Uploading attachment now, please wait..." : "Creating new task now, please wait..."}
          />

          <SweetAlert
            show={this.state.serverError != null}
            type="error"
            title="Oops..."
            text={(this.state.serverError != null) ? this.state.serverError.message : ''}
            onConfirm={()=>this.setState({serverError: null})}
          />  

          <DashboardFooter />
        </div>
      );
    }
  }
}

NewTaskPage.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    taskDetails: state.TaskReducer.taskDetails,
    serverError: state.TaskReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createNewTask: (data, cb) => {
      dispatch(TaskActions.createNewTask(data, cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewTaskPage);
