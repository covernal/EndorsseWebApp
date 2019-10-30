import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

const TaskTypes = [
  'Mobile Development', 
  'Web Front-end Development', 
  'Backend Development', 
  'Full-stack Development (Mobile)', 
  'Full-stack Development (Web)', 
  'Game Development', 
  'Architecture Design', 
  'Database Design', 
  'Business Intelligence', 
  'Big Data', 
  'Other IT Development'
];

class BrowseTasksLeft extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    let tasks = [];
    TaskTypes.forEach((task, i) => {
      tasks.push(
        <option key={'task_' + i} value={task}>{task}</option>
      );
    });

    return (
      <div className="col-lg-3 col-md-4">
        <div className="text-left card-box">
            <div className="member-card">
                <h4 className="m-b-20">Filters</h4>
                <hr/>
                <form role="form">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="p-0">
                                <div className="form-group m-b-20">
                                  <label htmlFor="property-location">Task Type</label>
                                  <select className="form-control" value={this.props.type} onChange={this.props.onChangeType.bind(this)}>
                                    <option value="">-</option>
                                    {tasks}
                                  </select>                                   
                                </div>
                                <button type="button" className="btn btn-primary waves-effect w-md waves-light" onClick={this.props.onApply}>Apply</button>
                                &nbsp;
                                <button type="button" className="btn btn-default waves-effect w-md waves-light" onClick={this.props.onClear}>Clear</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      </div>
    );
  }
}

export default BrowseTasksLeft;
