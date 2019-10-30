import React, {Component, PropTypes} from 'react';
import parsley from 'parsleyjs';
import $ from 'jquery';

class EditResubmissionModal extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    $('.resubmission-form').parsley();
  }

  handleSubmit(e){
    e.preventDefault();
    let validation = $('.resubmission-form').parsley().validate();
    if(validation == true) {
      //success
      this.props.reSubmitAction(this.props.challengeId, this.refs.comment.value);  
      $(".custom-with-modal-resubmission").modal('hide');
    }
  }

  render() {
    if (!this.props) {
      return null;
    }

    return (
      <div id={`custom-with-modal-resubmission${this.props.challengeId}`} className="modal fade custom-with-modal-resubmission" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true" style={{display: 'none'}}>
        <div className="modal-dialog" style={{width: '55%'}}>
          <div className="modal-content">
            <form className="form-horizontal resubmission-form" data-parsley-validate noValidate onSubmit={this.handleSubmit.bind(this)}>
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 className="modal-title text-left" id="custom-width-modalLabel">Ask Candidate To Resubmit</h4>
              </div>
              <div className="modal-body">
                <div className="row text-left">
                  <div className="col-md-12">
                    <div className="no-margin">
                      <label htmlFor="field-7" className="control-label">Comment</label>
                      <textarea className="form-control autogrow" ref="comment" required id="field-comment" style={{
                        overflow: 'hidden',
                        wordWrap: 'break-word',
                        resize: 'horizontal',
                        height: 300
                      }}></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default waves-effect" data-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary waves-effect waves-light">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

EditResubmissionModal.propTypes = {
  
};

export default EditResubmissionModal;
