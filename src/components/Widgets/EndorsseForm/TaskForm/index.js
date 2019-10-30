if (process.env.BROWSER) {
  require('./_taskForm.less');
}

import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import Parse from 'parse';
import {Link} from 'react-router';
import parsley from 'parsleyjs';
import $ from 'jquery';
import FileInput from 'react-file-input';

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

class TaskForm extends Component {
  constructor(props, context) {
    super(props);

    this.state = {
      taskData: {
        title: '',
        type: TaskTypes[0],
        skillsTested: '',
        price: 60,
        currency: 'aud',
        estimatedCompletionTime: '',
        requiredAnswerStructure: '',
        markingCriteria: '',
        fullDescription: '',
        attachedFileUrl: ''
      },
      attachedFileUrl: null,
      error: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    $('form').parsley();

    if(this.props.action == 'editTask'){
      if(this.props.currentTask && !this.props.currentTask.type) {
        this.props.currentTask.type = TaskTypes[0];
      }

      this.setState({
        taskData: this.props.currentTask
      });
    }
  }

  handleChange(type, e){
    let data = this.state.taskData;
    if(type != 'attachedFileUrl'){
      if(type == 'estimatedCompletionTime' || type == 'price'){
        data[type] = parseInt(e.target.value);
      }else{
        data[type] = e.target.value;
      }
      this.setState({
        taskData: data
      });      
    }else{
      if(e.target.files[0].size > 5242880){
        this.props.setParentState({
          serverError: {
            message: 'Maximum 5MB file size is allowed.'
          }
        });
      }else {
        this.setState({
          attachedFileUrl: e.target.files[0]
        });
      }
    }
  }

  handleSubmit(e){
    e.preventDefault();    
    let validation = $('.task-form').parsley().validate();
    if(validation != true) {
      return;
    }

    this.props.setParentState({
      sendingRequest: true
    }, () => {
      //If there is an attachment, upload first      
      if(this.state.attachedFileUrl != null){
        let parseFile = new Parse.File(this.state.attachedFileUrl.name, this.state.attachedFileUrl);

        this.props.setParentState({
          isUploading: true
        }, () => {
          parseFile.save().then((res) => {
            let parseURL = res._url;
            let data = this.state.taskData;
            data.attachedFileUrl = parseURL;

            if(this.props.action == 'editTask'){
              data = Object.assign({} , data, {
                id: data.objectId
              });
            }

            this.props.setParentState({
              isUploading: false
            }, () => {
              if(this.props.action == 'newTask'){
                this.props.createNewTask(data);
              }else{
                this.props.editTask(data);
              }
            });
          }, (error) => {
            this.props.setParentState({
              isUploading: false,
              sendingRequest: false,
              serverError: {
                message: error
              }
            });
          });
        });
      }else{
        if(this.props.action == 'newTask'){
          this.props.createNewTask(this.state.taskData);
        }else{
          let data = this.state.taskData;
          if(this.props.action == 'editTask'){
            data = Object.assign({} , data, {
              id: data.objectId
            });
          }

          this.props.editTask(data);
        }
      }
    });
  }

  render() {
    if (!this.props) {
      return null;
    }

    let prices = [];
    let tasks = [];
    
    for(let i = 60; i <= 200; i+=10){
      prices.push(
        <option key={'price_' + i} value={i}>${i}</option>
      );
    }

    TaskTypes.forEach((task, i) => {
      tasks.push(
        <option key={'task_' + i} value={task}>{task}</option>
      );
    });

    let attachmentBlock = (this.props.action == 'editTask' && this.props.currentTask.attachedFileUrl != undefined) ?
      <a href={this.props.currentTask.attachedFileUrl}>Download attachement</a> :
      <div></div>;

    return (
      <form role="form" className="task-form" data-parsley-validate noValidate onSubmit={this.handleSubmit.bind(this)}>
        <div className="row">
          <div className="col-md-12">
            <div className="p-20">
              <div className="form-group m-b-20">
                <label htmlFor="propertyname">Task Title</label>
                <input type="text" className="form-control" id="propertyname" placeholder="e.g. Make an iPhone Game" value={this.state.taskData.title} required onChange={this.handleChange.bind(this, 'title')}  />
              </div>

              <div className="form-group m-b-20">
                <label htmlFor="property-location">Task Type</label>
                <select className="form-control" value={this.state.taskData.type} onChange={this.handleChange.bind(this, 'type')}>
                  {tasks}
                </select>
              </div>
              <div className="form-group m-b-20">
                <label htmlFor="property-location">Skill Tested</label>
                <input type="text" className="form-control" id="skills-tested" placeholder="e.g. maths, c++ coding, copywritng" value={this.state.taskData.skillsTested} required onChange={this.handleChange.bind(this, 'skillsTested')} />
              </div>
              <div className="form-group m-b-20">
                <label htmlFor="property-price">Price $ (Endorsse takes a commission of 33% of the task price to each candidate’s payment)</label>
                <select className="form-control" value={this.state.taskData.price} onChange={this.handleChange.bind(this, 'price')}>
                  {prices}
                </select>
              </div>
              <div className="form-group m-b-20">
                <label htmlFor="property-price">Currency</label>
                <select className="form-control" value={this.state.taskData.currency} onChange={this.handleChange.bind(this, 'currency')}>
                  <option value="aud">Australian Dollar (AUD)</option>
                  <option value="usd">US Dollar (USD)</option>
                </select>
              </div>
              <div className="form-group m-b-20">
                <label htmlFor="property-location">Estimated Completion Time (hours)</label>
                <input type="text" className="form-control" id="estimated-completion-time" placeholder="We need intensive tasks with minimum 8 hours" value={this.state.taskData.estimatedCompletionTime} required onChange={this.handleChange.bind(this, 'estimatedCompletionTime')} />
              </div>
              <div className="form-group m-b-20">
                <label htmlFor="property-location">Required Answer Structure</label>
                <input type="text" className="form-control" id="required-answer-structure" placeholder="e.g. a series of blog posts, compiled source/project files, etc" value={this.state.taskData.requiredAnswerStructure} required onChange={this.handleChange.bind(this, 'requiredAnswerStructure')} />
              </div>
              <div className="form-group m-b-20">
                <label htmlFor="property-location">Marking Criteria</label>
                <input type="text" className="form-control" id="marketing-criteria" placeholder="e.g. code architecture design, article quality, etc" value={this.state.taskData.markingCriteria} required onChange={this.handleChange.bind(this, 'markingCriteria')} />
              </div>
              <div className="form-group m-b-20">
                <label htmlFor="property-desc">Full Description</label>
                <textarea className="form-control" id="full-description" rows="10" placeholder="Enter full task description" value={this.state.taskData.fullDescription} required onChange={this.handleChange.bind(this, 'fullDescription')}></textarea>
              </div>
              <div className="form-group m-b-20">
                <label className="control-label">Additional File (optional)</label>

                <FileInput
                  name="attached-file-url"
                  accept=".zip"
                  placeholder="Click to attachment file (Only one .zip file allowed)"
                  className="form-control attachment"
                  ref="attachedFileUrl"
                  onChange={this.handleChange.bind(this, 'attachedFileUrl')} />
                {attachmentBlock}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <button type="submit" className="btn btn-primary btn-block waves-effect waves-light">Save & Publish</button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

TaskForm.propTypes = {
  action: PropTypes.string,
  createNewTask: PropTypes.func,
  editTask: PropTypes.func,
  setParentState: PropTypes.func,
  currentTask: PropTypes.object
};

export default TaskForm;
