if (process.env.BROWSER) {
  require('./_editExperienceModal.less');
}
import React, {Component, PropTypes} from 'react';
import Utils from '../../../../utils';

class EditExperienceModal extends Component {
  constructor(props) {
    super(props);
    const isPresent = props.userExperience.endYear.iso == 'Present'?true:false;
    this.state = {
      endYear: {
        isPresent: isPresent
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.refreshModal = this.refreshModal.bind(this);
  }

  handleSubmit(e){
    const userExperience = {
      positionTitle: this.refs.positionTitle.value,
      companyName: this.refs.companyName.value,
      startYear: {
        "__type": "Date",
        iso: Utils.DateTimeHelper.yearToISOString(this.refs.startYear.value)
      },
      endYear: {
        "__type": "Date",
        iso: this.state.endYear.isPresent?'Present': Utils.DateTimeHelper.yearToISOString(this.refs.endYear.value)
      },
      description: this.refs.description.value
    };
    this.props.updateUserExperience({
      userExperience: userExperience,
      index: this.props.index
    });
  }

  handleChange(e){
    this.setState({
      endYear: {
        isPresent: !this.state.endYear.isPresent
      }
    });
  }

  refreshModal(e){
    this.setState({
      endYear: {
        isPresent: this.state.endYear.isPresent
      }
    });
  }

  render() {
    if (!this.props) {
      return null;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const startYear = Utils.DateTimeHelper.getYear(this.props.userExperience.startYear.iso);

    return (
      <div id={`custom-width-modal-edit-experience-${this.props.index}`} className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true" style={{display: 'none'}}>
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
                    <label htmlFor="field-7" className="control-label">Position Title</label>
                    <input className="form-control" type="text" ref="positionTitle" required defaultValue={this.props.userExperience.positionTitle} />
                  </div>
                  <div className="form-group no-margin">
                    <label htmlFor="field-7" className="control-label">Company Name</label>
                    <input className="form-control" type="text" ref="companyName" required defaultValue={this.props.userExperience.companyName} />
                  </div>
                  <div className="form-group no-margin">
                    <label htmlFor="field-7" className="control-label">Time Period</label>
                    <div>
                      <input className="form-control experience-input-year" type="number" ref="startYear" required max={currentYear} defaultValue={startYear} onChange={this.refreshModal}/>
                      <span className='to'>－</span>
                      {this.state.endYear.isPresent?
                        <span ref="endYear">Present</span>
                        :
                        <input
                          className="form-control experience-input-year"
                          type="number"
                          ref="endYear"
                          required
                          max={currentYear}
                          min={this.refs.startYear?this.refs.startYear.value:startYear}
                          defaultValue={this.props.userExperience.endYear.iso=="Present"?currentYear:Utils.DateTimeHelper.getYear(this.props.userExperience.endYear.iso)}
                        />
                      }
                      <div className="checkbox checkbox-primary experience-input-year-present">
                        <input id={`experience_isPresent_${this.props.index}`} type="checkbox" checked={this.state.endYear.isPresent} onChange={this.handleChange}/>
                        <label htmlFor={`experience_isPresent_${this.props.index}`}>
                          I am currently work here
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group no-margin">
                    <label htmlFor="field-7" className="control-label">Description</label>
                    <textarea className="form-control autogrow" ref="description" id="field-7" style={{
                      overflow: 'hidden',
                      wordWrap: 'break-word',
                      resize: 'horizontal',
                      height: 300
                    }} defaultValue={this.props.userExperience.description}></textarea>
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

EditExperienceModal.propTypes = {
  index: PropTypes.number.isRequired,
  userExperience: PropTypes.object.isRequired,
  updateUserExperience: PropTypes.func
};

export default EditExperienceModal;
