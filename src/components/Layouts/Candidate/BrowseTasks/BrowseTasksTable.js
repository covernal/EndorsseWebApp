import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import cookie from 'react-cookie';

class BrowseTasksTable extends Component {
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
    let rows = [];

    if(loadingClass != 'loading') {
      this.props.items.forEach((item, index) => {
        let task = item.attributes;
        rows.push(
          <div className="p-t-10" key={'col_' + index}>
            {
              (cookie.load('username')) ?
              <h5 className="text-custom m-b-10"><Link onClick={()=>this.goToTaskDetailPage(item.id)}>{task.title}</Link></h5>
              :
              <h5 className="text-custom m-b-10">{task.title}</h5>
            }        
            <p className="m-b-10">By <i><Link to={`/profile/${item.userDetails.username}`} className="text-muted">{item.userDetails.firstName} {item.userDetails.lastName}</Link></i></p>
            <p><b>Price: ${task.price}</b></p>
            <p className="font-13 m-b-10">
              {(task.fullDescription !== undefined && task.fullDescription.length > 300) ? task.fullDescription.substr(0, 300) + "..." : task.fullDescription}
            </p>     
            <p className="text-muted font-13 m-b-5">Skill tested: {task.skillsTested}</p>
            <p className="text-muted font-13 m-b-5">Type: <i>{task.type}</i></p>
            <p className="text-muted font-13 m-b-5">Estimated completion time: <i>{task.estimatedCompletionTime} hours</i></p>
            <br/>
          </div>
        );
      });
    }
    return (
      <div>
        {rows}
        <div className={loadingClass}>
          <i className="fa fa-spinner fa-spin-custom" aria-hidden="true"></i>
        </div>        
      </div>);
  }  
}

BrowseTasksTable.contextTypes = {
  router: PropTypes.object.isRequired
};

export default BrowseTasksTable;
