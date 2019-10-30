import React, {Component, PropTypes} from 'react';

class EditCompanyNameModal extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    this.props.updateEmployerProfile({
      companyName: this.refs.companyName.value
    });
  }

  render() {
    if (!this.props || this.props.companyName == undefined) {
      return null;
    }

    return (
      <div id="custom-width-modal-edit-companyName" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true" style={{display: 'none'}}>
        <div className="modal-dialog" style={{width: '55%'}}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h4 className="modal-title text-left" id="custom-width-modalLabel">Edit Company Name</h4>
            </div>
            <div className="modal-body">
              <div className="row text-left">
                <div className="col-md-12">
                  <div className="form-group no-margin">
                    <label htmlFor="field-7" className="control-label">Company Name</label>
                    <input className="form-control" type="text" ref="companyName" required defaultValue={this.props.companyName} />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default waves-effect" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary waves-effect waves-light" data-dismiss="modal" onClick={this.handleSubmit}>Done</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditCompanyNameModal.propTypes = {
  updateUserProfile: PropTypes.func
};

export default EditCompanyNameModal;
