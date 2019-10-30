import React, {Component, PropTypes} from 'react';

class DeleteTaskModal extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.refreshModel = this.refreshModel.bind(this);
  }

  handleSubmit(e){
    this.props.deleteTask(this.props.taskDetails);
  }

  refreshModel(){
    this.setState({});
  }

  render() {
    if (!this.props) {
      return null;
    }

    return (
      <div id={`custom-width-modal-delete-task-${this.props.taskDetails.id}`} className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true" style={{display: 'none'}}>
        <div className="modal-dialog modal-sm" >
          <div className="modal-content p-0 b-0">
            <div className='panel panel-color panel-warning'>
              <div className="panel-heading error">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h3 className="panel-title" id="custom-width-modalLabel">Are you ABSOLUTELY sure?</h3>
              </div>
              <div className="panel-body">
                <div className="row text-left">
                  <div className="col-md-12">
                    <div className="form-group">
                      <p>This action <b>CANNOT</b> be undone. This will permanently delete the  <b>{this.props.taskDetails.get('title')}</b> task.</p>
                    </div>
                    <div className="form-group">
                      <label htmlFor="field-7" className="control-label">Please type in the name of the task to confirm.</label>
                      <input className="form-control" type="text" ref='taskName' onChange={this.refreshModel} required defaultValue='' />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <button
                      type="button"
                      className={this.refs.taskName?this.refs.taskName.value == this.props.taskDetails.get('title')?"btn btn-block btn-warning waves-effect waves-light":"btn btn-block btn-warning waves-effect waves-light disabled":"btn btn-block btn-warning waves-effect waves-light disabled"}
                      data-dismiss={this.refs.taskName?this.refs.taskName.value == this.props.taskDetails.get('title')?"modal":null:null}
                      onClick={this.refs.taskName?this.refs.taskName.value == this.props.taskDetails.get('title')?this.handleSubmit:null:null}
                    >Delete the task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


DeleteTaskModal.propTypes = {
  taskDetails: PropTypes.object.isRequired,
  deleteTask: PropTypes.func.isRequired
};

export default DeleteTaskModal;
