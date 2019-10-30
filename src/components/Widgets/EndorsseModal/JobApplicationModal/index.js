if (process.env.BROWSER) {
  require('./_jobApplicationModal.less');
}

import React, {Component, PropTypes} from 'react';
import FileInput from 'react-file-input';

class JobApplicationModal extends Component {
  constructor(props, context) {
    super(props);

    this.state = {
      error: '',
      coverLetterFile: '',
      resumeFile: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(type, e){
    let error = '';
    let file = e.target.files[0];
    if(file.size > 1024*1024){
      error = 'Maximum 1MB file size is allowed.';
    }

    this.state.error = error;
    this.state[type] = (error == '') ? file : '';       
  }

  handleSubmit() {
    if(this.state.error != '') {
      return;
    }
    if(this.state.resumeFile == '' || this.state.coverLetterFile == '') {
      this.setState({error: 'Both of the files are all required.'});
      return;
    }

    this.setState({error: ''});
    this.props.handleSubmit(this.state.coverLetterFile, this.state.resumeFile);    
  }

  render() {
    if (!this.props) {
      return null;
    }

    let attachmentBlock = (this.props.coverLetterFile != undefined) ?
      <a href={this.props.coverLetterFile}>Download attachement</a> :
      <div></div>;    

    return (
      <div id="custom-width-modal-job-application" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true">
        <div className="modal-dialog" style={{width: '55%'}}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h4 className="modal-title" id="custom-width-modalLabel">Job Application</h4>
            </div>
            <div className="modal-body">
                <h4>You must also submit the following</h4>
                <form role="form">
                  <div className="form-group">
                    <FileInput
                      name="attached-file-url"
                      accept=".pdf,.doc,.docx,.txt"
                      placeholder="Click to upload cover letter"
                      className="form-control attachment"
                      ref="coverLetterFile"
                      onChange={this.handleChange.bind(this, 'coverLetterFile')} />
                    {attachmentBlock}     
                  </div>
                  <div className="form-group">          
                    <FileInput
                      name="attached-file-url"
                      accept=".pdf,.doc,.docx,.txt"
                      placeholder="Click to upload resume"
                      className="form-control attachment"
                      ref="resumeFile"
                      onChange={this.handleChange.bind(this, 'resumeFile')} />
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

export default JobApplicationModal;
