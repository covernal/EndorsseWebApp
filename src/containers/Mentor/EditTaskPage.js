import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import Find from 'lodash/find';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import TaskForm from '../../components/Widgets/EndorsseForm/TaskForm';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';

import {MentorUserActions, TaskActions} from '../../actions';

class EditTaskPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      serverError: this.props.serverError,
      sendingRequest: false,
      isUploading: false,
      currentTask: {}
    };

    this.editTask = this.editTask.bind(this);
    this.setParentState = this.setParentState.bind(this);
  }

  componentWillMount() {
    let allTasks = JSON.parse(localStorage.getItem('tasks'));
    let currentTask = Find(allTasks, (task) => {
      return task.objectId == this.props.params.id;
    });

    this.setState({
      currentTask: currentTask
    });
  }

  editTask(data) {
    this.props.editTask(data, () => {
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
                    <h4 className="page-title">Edit Task</h4>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="card-box">
                    <TaskForm
                      action="editTask"
                      setParentState={this.setParentState}
                      editTask={this.editTask}
                      currentTask={this.state.currentTask}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <EndorsseOverlay
            overlayClass={overlayClass}
            message={(this.state.isUploading) ? "Uploading attachment now, please wait..." : "Updating new task now, please wait..."}
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

EditTaskPage.contextTypes = {
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
    editTask: (data, cb) => {
      dispatch(TaskActions.editTask(data, cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTaskPage);
