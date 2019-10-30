import React, {Component, PropTypes} from 'react';
import '../../../../plugins/raty-fa/jquery.raty-fa.js';
import '../../../assets/templates/js/rating.js';
import parsley from 'parsleyjs';
import $ from 'jquery';

class RateMentorModal extends Component {
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

  handleSubmit(e){
    e.preventDefault();
    let validation = $('.modal.fade.in .rate-form').parsley().validate();
    if(validation == true && this.getRate() > 0) {
      //success
      this.handlePublish(this.getRate());      
      $(".custom-with-modal-rate-mentor").modal('hide');
    }else {
      //error
      if(this.getRate() == 0) {
        this.setState({isEmptyRate: true});
      }
    }
  }  

  handlePublish(rate){
    this.props.handleRate(this.props.challengeID, {
      rateMentor: rate,
      mentorsComment: this.refs.comments.value
    });
  }

  render() {
    if (!this.props) {
      return null;
    }

    let rateValidationBlock = (this.state.isEmptyRate == true) ? (<ul className="rate-validation parsley-errors-list filled"><li className="parsley-required">This value is required.</li></ul>) : '';

    return (
      <div id={this.props.id} className="custom-with-modal-rate-mentor modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true" style={{display: 'none'}}>
        <div className="modal-dialog" style={{width: '55%'}}>
          <div className="modal-content">
            <form className="form-horizontal rate-form" data-parsley-validate noValidate onSubmit={this.handleSubmit.bind(this)}>
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 className="modal-title" id="custom-width-modalLabel">Review Your Mentor</h4>
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
                      <label htmlFor="field-comment" className="control-label">Comments</label>
                      <textarea 
                        className="form-control autogrow" 
                        id="field-comment" 
                        ref="comments" 
                        required
                        placeholder="What do you think about your mentor's review? Have you learned anything from it?" 
                        style={{overflow: 'hidden', wordWrap: 'break-word', resize: 'horizontal', height: '104px'}}>
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

export default RateMentorModal;
