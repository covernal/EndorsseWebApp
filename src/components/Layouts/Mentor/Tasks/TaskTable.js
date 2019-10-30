import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {DeleteTaskModal} from '../../../Widgets/EndorsseModal';

class TaskTable extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    let loadingClass = (this.props.isInitTable || this.props.isInitTable == undefined) ? 'loading' : 'loading hidden';

    if (!this.props ||
    this.props.taskData == undefined) {
      return null;
    }

    let rows = [];
    this.props.taskData.forEach((task, index) => {
      let taskObj = task.attributes;
      rows.push(
        <tr className="" key={'mentor_tasks' + index}>
          <td>{taskObj.title}</td>
          <td>{taskObj.type}</td>
          <td>{(taskObj.currency).toUpperCase()} ${taskObj.price}</td>
          <td>{taskObj.estimatedCompletionTime}</td>
          <td>
            <Link to={'/edit-task/' + task.id} className="table-action-btn h3"><i className="mdi mdi-pencil text-grey"></i></Link>
            <DeleteTaskModal
              taskDetails={task}
              deleteTask={this.props.deleteTask}
            />
            <a
              className="table-action-btn h3"
              data-toggle="modal"
              data-target={`#custom-width-modal-delete-task-${task.id}`}
            >
              <i className="mdi mdi-delete text-grey"></i>
            </a>
          </td>
        </tr>
      );
    });

    return (
      <div className="table-responsive">
        <table className="table table-hover mails m-0 table table-actions-bar">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Type</th>
              <th>Price</th>
              <th>Estimated Time (hours)</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {rows}
          </tbody>
        </table>

        <div className={loadingClass}>
          <i className="fa fa-spinner fa-spin-custom" aria-hidden="true"></i>
        </div>
      </div>
    );
  }
}

TaskTable.contextTypes = {
  router: PropTypes.object.isRequired
};

TaskTable.propTypes = {
  taskData: PropTypes.array,
  isInitTable: PropTypes.bool,
  hasMoreTasks: PropTypes.bool
};

export default TaskTable;
