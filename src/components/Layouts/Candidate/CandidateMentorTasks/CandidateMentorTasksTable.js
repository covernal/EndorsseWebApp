import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import cookie from 'react-cookie';

class CandidateMentorTasksTable extends Component {
  constructor(props, context) {
    super(props);
    this.goToTaskDetailPage = this.goToTaskDetailPage.bind(this);
  }

  goToTaskDetailPage(taskId) {
    let maxAge = 60*60;
    cookie.save('hasChallengeBtn', 'yes', {path: '/', maxAge: maxAge});
    this.context.router.push('/task-detail/' + taskId);
  }

  render() {
    let loadingClass = (this.props.isInitTable || this.props.isInitTable == undefined) ? 'loading' : 'loading hidden';

    if (!this.props ||
    this.props.tasksData == undefined) {
      return null;
    }else{
      let rows = [];
      this.props.tasksData.forEach((task, index) => {
        rows.push(
          <tr className="" key={'task' + index}>
            <td>{task.attributes.title}</td>
            <td>{task.attributes.type}</td>
            <td>{task.attributes.currency.toUpperCase()} ${task.attributes.price}</td>
            <td>{task.attributes.estimatedCompletionTime}</td>
            <td><Link onClick={()=>this.goToTaskDetailPage(task.id)} className="table-action-btn h3"><i className="mdi mdi-information-outline text-grey"></i></Link></td>
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
                <th>Estimated Time(hours)</th>
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
}

CandidateMentorTasksTable.contextTypes = {
  router: PropTypes.object.isRequired
};

CandidateMentorTasksTable.propTypes = {
  tasksData: PropTypes.array,
  isInitTable: PropTypes.bool
};

export default CandidateMentorTasksTable;
