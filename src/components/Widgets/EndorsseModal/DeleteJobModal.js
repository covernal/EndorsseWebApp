import React, {Component, PropTypes} from 'react';

class DeleteJobModal extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.refreshModel = this.refreshModel.bind(this);
  }

  handleSubmit(e){
    this.props.deleteJob(this.props.jobDetails);
  }

  refreshModel(){
    this.setState({});
  }

  render() {
    if (!this.props) {
      return null;
    }

    return (
      <div id={`custom-width-modal-delete-job-${this.props.jobDetails.id}`} className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true" style={{display: 'none'}}>
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
                      <p>This action <b>CANNOT</b> be undone. This will permanently delete the  <b>{this.props.jobDetails.title}</b> job.</p>
                    </div>
                    <div className="form-group">
                      <label htmlFor="field-7" className="control-label">Please type in the name of the job to confirm.</label>
                      <input className="form-control" type="text" ref='jobName' onChange={this.refreshModel} required defaultValue='' />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <button
                      type="button"
                      className={this.refs.jobName?this.refs.jobName.value == this.props.jobDetails.title?"btn btn-block btn-warning waves-effect waves-light":"btn btn-block btn-warning waves-effect waves-light disabled":"btn btn-block btn-warning waves-effect waves-light disabled"}
                      data-dismiss={this.refs.jobName?this.refs.jobName.value == this.props.jobDetails.title?"modal":null:null}
                      onClick={this.refs.jobName?this.refs.jobName.value == this.props.jobDetails.title?this.handleSubmit:null:null}
                    >Delete the job
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


DeleteJobModal.propTypes = {
  jobDetails: PropTypes.object.isRequired,
  deleteJob: PropTypes.func.isRequired
};

export default DeleteJobModal;
