import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import Find from 'lodash/find';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import BrowseTasksLeft from '../../components/Layouts/Candidate/BrowseTasks/BrowseTasksLeft';
import BrowseTasksRight from '../../components/Layouts/Candidate/BrowseTasks/BrowseTasksRight';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';

import {CandidateUserActions} from '../../actions';
import {CommonUserActions} from '../../actions';

class BrowseTasksPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      username: Cookie.load('username'),
      serverError: this.props.serverError,
      tasks: [],
      skip: 0,
      hasMoreTasks: true,
      isLoadingMore: false,
      isInitTable: true,
      type: ''
    };

    this.loadMoreCallback = this.loadMoreCallback.bind(this);
    this.loadMoreTasks = this.loadMoreTasks.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onClear = this.onClear.bind(this);
    this.filter = this.filter.bind(this);
    this._filterTasks = this._filterTasks.bind(this);
  }

  componentDidMount() {
    this.filter();
  }

  loadMoreTasks() {
    this.setState({
      isLoadingMore: true
    }, () => {
      this._filterTasks();
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

    if(this.props.tasksData.length > 0){
      let limit = 0;
      let tmpTasks = [];

      this.props.tasksData.forEach((task) => {
        this.props.getUser({
          id: task.attributes.createdBy,
          cb: () => {
            limit++;   

            if(this.props.commonServerError == null) {
              //If no user exist, no need to show the task.
              task['userDetails'] = this.props.userDetails.attributes;
              tmpTasks.push(task);              
            }

            if(this.props.tasksData.length == limit) {
              let sub_limit = 0;
              if(tmpTasks.length > 0) {
                tmpTasks.forEach((j) => {
                  let existObj = Find(this.state.tasks, (mj) => {
                    return mj.id == j.id;
                  });
                  if(existObj == undefined) {
                    sub_limit++;                  
                    this.state.tasks.push(j);
                  }
                });                
              }else {
                this.setState({
                  hasMoreTasks: false
                });
              }

              this.setState({
                serverError: null,
                skip: this.state.skip + sub_limit,
                tasks: this.state.tasks,
                isInitTable: false,
                isLoadingMore: false
              });
              localStorage.setItem('tasks', JSON.stringify(this.state.tasks));
            }             
          }
        });
      });
    }else{
      this.setState({
        hasMoreTasks: false,
        isInitTable: false,
        isLoadingMore: false
      });
    }
  }

  onChangeType(e) {
    this.setState({
      type: e.target.value
    });
  }

  onClear() {
    this.setState({
      type: '',
      skip: 0,
      tasks: [],
      isInitTable: true,
      hasMoreTasks: true
    }, () => {
      this._filterTasks();
    });
  }

  filter() {    
    this.setState({
      skip: 0,
      tasks: [],
      isInitTable: true,
      hasMoreTasks: true
    }, () => {
      this._filterTasks();
    });
  }

  _filterTasks() {
    let params = {
      skip: this.state.skip 
    };
    if(this.state.type) {
      params['type'] = this.state.type;
    }
    this.props.loadTasks({
      params: params,
      cb: () => this.loadMoreCallback()
    });
  }

  render() {
    if (!this.props) {
      return null;
    }

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
                  <h4 className="page-title">Browse Tasks</h4>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="card-box">
                  <div className="row">
                    <BrowseTasksLeft 
                      type={this.state.type}
                      onChangeType={this.onChangeType}
                      onApply={this.filter} 
                      onClear={this.onClear} />
                    <BrowseTasksRight                         
                      hasMoreTasks={this.state.hasMoreTasks}
                      isLoadingMore={this.state.isLoadingMore}
                      tasks={this.state.tasks} 
                      isInitTable={this.state.isInitTable}
                      loadMoreTasks={this.loadMoreTasks}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

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

BrowseTasksPage.propTypes = {
  serverError: PropTypes.object
};


const mapStateToProps = (state) => {
  return {
    tasksData: state.CandidateUserReducer.tasksData,
    serverError: state.CandidateUserReducer.error,
    userDetails: state.CommonUserReducer.userDetails,
    commonServerError: state.CommonUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUser: (req) => {
      dispatch(CommonUserActions.getUser(req.id, req.cb));
    },    
    loadTasks: (req) => {
      dispatch(CandidateUserActions.getTaskTemplates(req.params, req.cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowseTasksPage);