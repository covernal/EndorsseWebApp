if (process.env.BROWSER) {
  require('./_submitSolutionModal.less');
}

import React, {Component, PropTypes} from 'react';
import FileInput from 'react-file-input';
import $ from 'jquery';

class SubmitSolutionModal extends Component {
  constructor(props, context) {
    super(props);

    this.state = {
      error: '',
      solutionFile: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(type, e){
    let error = '';
    let file = e.target.files[0];
    if(file.size > 1024*1024 * 10){
      error = 'Maximum 10MB file size is allowed.';
    }
    this.state.error = error;
    this.state[type] = (error == '') ? file : '';       
  }

  handleSubmit() {
    if(this.state.error != '') {
      return;
    }
    if(this.state.solutionFile == '') {
      this.setState({error: 'The solution file is required.'});
      return;
    }

    this.setState({error: ''});
    $(".custom-width-modal-solution").modal('hide');
    this.props.submitAction(this.props.challengeId, this.state.solutionFile);    
  }

  render() {
    if (!this.props) {
      return null;
    }

    let attachmentBlock = (this.props.solutionFile != undefined) ?
      <a href={this.props.solutionFile}>Download attachement</a> :
      <div></div>;    

    return (
      <div id={`custom-width-modal-solution${this.props.challengeId}`} className="modal fade custom-width-modal-solution" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true">
        <div className="modal-dialog" style={{width: '55%'}}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h4 className="modal-title" id="custom-width-modalLabel">Task Solution</h4>
            </div>
            <div className="modal-body">
                <h4>You must submit the solution file.</h4>
                <form role="form">
                  <div className="form-group">
                    <FileInput
                      name="attached-file-url"
                      accept=".zip"
                      placeholder="Click to upload solution file"
                      className="form-control attachment"
                      ref="solutionFile"
                      onChange={this.handleChange.bind(this, 'solutionFile')} />
                    {attachmentBlock}     
                  </div>                  
                </form>
                {(this.state.error != '') ? (<h6 className="error">{this.state.error}</h6>) : ''}
                {(this.props.serverError != '' && this.props.serverError != undefined) ? (<h6 className="error">{this.props.serverError.error.message}</h6>) : ''}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default waves-effect" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary waves-effect waves-light" onClick={this.handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SubmitSolutionModal;
