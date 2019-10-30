import React, {Component, PropTypes} from 'react';
import '../../../../plugins/raty-fa/jquery.raty-fa.js';
import '../../../assets/templates/js/rating.js';
import parsley from 'parsleyjs';
import $ from 'jquery';

class RateModal extends Component {
  constructor(props) {
    super(props);
    this.handlePublish = this.handlePublish.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      isEmptyRate: false
    };
  }

  componentDidMount() {
    $('form').parsley();
  }

  getRate() {
    return $('.modal.fade.in .rating-lg').attr('data-value');
  }

  handlePublish(rate){
    this.props.handleRate(this.props.challengeID, {
      rate: rate,
      comment: this.refs.comment.value
    });
  }

  handleSubmit(e){
    e.preventDefault();
    let validation = $('.modal.fade.in .rate-form').parsley().validate();
    if(validation == true && this.getRate() > 0) {
      //success
      this.handlePublish(this.getRate());      
      $(".custom-with-modal-rate").modal('hide');
    }else {
      //error
      if(this.getRate() == 0) {
        this.setState({isEmptyRate: true});
      }
    }
  }

  render() {
    if (!this.props) {
      return null;
    }

    let rateValidationBlock = (this.state.isEmptyRate == true) ? (<ul className="rate-validation parsley-errors-list filled"><li className="parsley-required">This value is required.</li></ul>) : '';
      
    return (
      <div id={this.props.id} className="custom-with-modal-rate modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true" style={{display: 'none'}}>
        <div className="modal-dialog" style={{width: '55%'}}>
          <div className="modal-content">
            <form className="form-horizontal rate-form" data-parsley-validate noValidate onSubmit={this.handleSubmit.bind(this)}>
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 className="modal-title" id="custom-width-modalLabel">Review Your Candidate</h4>
              </div>
              <div className="modal-body">              
                <div className="row">
                  <div className="col-md-12">
                    <div className="no-margin">
                      <label className="control-label">Rate</label>
                      <div className="rating-lg" data-value="0"></div>                      
                      {rateValidationBlock}
                    </div>                    
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">                  
                    <div className="no-margin">
                      <label htmlFor="field-comment" className="control-label">Comment</label>
                      <textarea 
                        className="form-control autogrow" 
                        id="field-comment" 
                        ref="comment" 
                        required
                        placeholder="How was the candidate's solution? Does it meet your expectation? We require mentors to give comprehensive review on candidate's solution, including detailed comments and suggestions to candidate's solution as per your marking criteria. Keep in mind this review will be published on candidate public profile and might be viewed by their potential employers. Therefore the more details and suggestions you give, the more credits the candidate may have. We would strongly suggest that you write the comments in a local Notepad and copy/paste back to avoid data loss." 
                        style={{overflow: 'hidden', wordWrap: 'break-word', resize: 'horizontal', height: '300px'}}>
                      </textarea>
                    </div>                  
                  </div>
                </div>              
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default waves-effect" data-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary waves-effect waves-light">Publish</button>
              </div>
            </form>
          </div>          
        </div>
      </div>
    );
  }
}

export default RateModal;
