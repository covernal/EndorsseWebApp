import React, {Component, PropTypes} from 'react';

class EditSummaryModal extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    this.props.updateUserProfile({
      summary: this.refs.summary.value
    });
  }

  render() {
    if (!this.props) {
      return null;
    }

    return (
      <div id="custom-width-modal-edit-summary" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true" style={{display: 'none'}}>
        <div className="modal-dialog" style={{width: '55%'}}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h4 className="modal-title text-left" id="custom-width-modalLabel">Edit Summary</h4>
            </div>
            <div className="modal-body">
              <div className="row text-left">
                <div className="col-md-12">
                  <div className="form-group no-margin">
                    <label htmlFor="field-7" className="control-label">Summary</label>
                    <textarea className="form-control autogrow" ref="summary" id="field-7" style={{
                      overflow: 'hidden',
                      wordWrap: 'break-word',
                      resize: 'horizontal',
                      height: 300
                    }} defaultValue={this.props.userDetails.summary}></textarea>
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

EditSummaryModal.propTypes = {
  userDetails: PropTypes.object.isRequired,
  updateUserProfile: PropTypes.func
};

export default EditSummaryModal;
