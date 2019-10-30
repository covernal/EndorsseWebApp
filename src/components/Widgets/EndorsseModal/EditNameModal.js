import React, {Component, PropTypes} from 'react';

class EditNameModal extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    this.props.updateUserProfile({
      firstName: this.refs.firstName.value,
      lastName: this.refs.lastName.value
    });
  }

  render() {
    if (!this.props) {
      return null;
    }

    return (
      <div id="custom-width-modal-edit-name" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true" style={{display: 'none'}}>
        <div className="modal-dialog" style={{width: '55%'}}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h4 className="modal-title text-left" id="custom-width-modalLabel">Edit Name</h4>
            </div>
            <div className="modal-body">
              <div className="row text-left">
                <div className="col-md-12">
                  <div className="form-group no-margin">
                    <label htmlFor="field-7" className="control-label">First Name</label>
                    <input className="form-control" type="text" ref="firstName" required defaultValue={this.props.userDetails.firstName} />
                  </div>
                  <div className="form-group no-margin">
                    <label htmlFor="field-7" className="control-label">Last Name</label>
                    <input className="form-control" type="text" ref="lastName" required defaultValue={this.props.userDetails.lastName} />
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

EditNameModal.propTypes = {
  userDetails: PropTypes.object.isRequired,
  updateUserProfile: PropTypes.func
};

export default EditNameModal;
