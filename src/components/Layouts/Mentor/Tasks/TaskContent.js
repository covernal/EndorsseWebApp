import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import TaskTable from './TaskTable';

class TaskContent extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    if (!this.props ||
    this.props.taskData == undefined) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="card-box">
            <TaskTable
              taskData={this.props.taskData}
              hasMoreTasks={this.props.hasMoreTasks}
              isInitTable={this.props.isInitTable}
              deleteTask={this.props.deleteTask}
            />
          </div>
        </div>
      </div>
    );
  }
}

TaskContent.contextTypes = {
  router: PropTypes.object.isRequired
};

TaskContent.propTypes = {
  taskData: PropTypes.array,
  hasMoreTasks: PropTypes.bool,
  isInitTable: PropTypes.bool
};

export default TaskContent;
