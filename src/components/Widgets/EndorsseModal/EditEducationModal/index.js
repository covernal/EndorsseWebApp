if (process.env.BROWSER) {
  require('./_editEducationModal.less');
}
import React, {Component, PropTypes} from 'react';
import Utils from '../../../../utils';

class EditEducationModal extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.refreshModal = this.refreshModal.bind(this);
  }

  handleSubmit(e){
    const userEducation = {
      schoolName: this.refs.schoolName.value,
      certificateName: this.refs.certificateName.value,
      startYear: {
        "__type": "Date",
        iso: Utils.DateTimeHelper.yearToISOString(this.refs.startYear.value)
      },
      endYear: {
        "__type": "Date",
        iso: Utils.DateTimeHelper.yearToISOString(this.refs.endYear.value)
      },
      description: this.refs.description.value
    };
    this.props.updateUserEducation({
      userEducation: userEducation,
      index: this.props.index
    });
  }

  refreshModal(e){
    this.setState({});
  }

  render() {
    if (!this.props) {
      return null;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const startYear = Utils.DateTimeHelper.getYear(this.props.userEducation.startYear.iso);

    return (
      <div id={`custom-width-modal-edit-education-${this.props.index}`} className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true" style={{display: 'none'}}>
        <div className="modal-dialog" style={{width: '55%'}}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h4 className="modal-title text-left" id="custom-width-modalLabel">Edit Experience</h4>
            </div>
            <div className="modal-body">
              <div className="row text-left">
                <div className="col-md-12">
                  <div className="form-group no-margin">
                    <label htmlFor="field-7" className="control-label">School Name</label>
                    <input className="form-control" type="text" ref="schoolName" required defaultValue={this.props.userEducation.schoolName} />
                  </div>
                  <div className="form-group no-margin">
                    <label htmlFor="field-7" className="control-label">Certificate Name</label>
                    <input className="form-control" type="text" ref="certificateName" required defaultValue={this.props.userEducation.certificateName} />
                  </div>
                  <div className="form-group no-margin">
                    <label htmlFor="field-7" className="control-label">Time Period</label>
                    <div>
                      <input className="form-control education-input-year" type="number" ref="startYear" required max={currentYear} defaultValue={startYear} onChange={this.refreshModal}/>
                      <span className='to'>－</span>
                      <input
                        className="form-control experience-input-year"
                        type="number"
                        ref="endYear"
                        required
                        min={this.refs.startYear?this.refs.startYear.value:startYear}
                        defaultValue={Utils.DateTimeHelper.getYear(this.props.userEducation.endYear.iso)}
                      />
                      <span className='to'>Or expected graduation year</span>
                    </div>
                  </div>
                  <div className="form-group no-margin">
                    <label htmlFor="field-7" className="control-label">Description</label>
                    <textarea className="form-control autogrow" ref="description" id="field-7" style={{
                      overflow: 'hidden',
                      wordWrap: 'break-word',
                      resize: 'horizontal',
                      height: 300
                    }} defaultValue={this.props.userEducation.description}></textarea>
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

EditEducationModal.propTypes = {
  index: PropTypes.number.isRequired,
  userEducation: PropTypes.object.isRequired,
  updateUserEducation: PropTypes.func.isRequired
};

export default EditEducationModal;
