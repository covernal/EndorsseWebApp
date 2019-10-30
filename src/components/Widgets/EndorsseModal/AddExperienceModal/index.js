if (process.env.BROWSER) {
  require('./_addExperienceModal.less');
}
import React, {Component, PropTypes} from 'react';
import Utils from '../../../../utils';
import $ from 'jquery';

class AddExperienceModal extends Component {
  constructor(props) {
    super(props);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    this.state = {
      endYear: {
        isPresent: true
      },
      currentYear: currentYear
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.refreshModal = this.refreshModal.bind(this);
  }

  componentWillReceiveProps(nextProps){
    $(this.refs.positionTitle).val('');
    $(this.refs.companyName).val('');
    $(this.refs.startYear).val(this.state.currentYear);
    $(this.refs.endYear).val(this.state.currentYear);
    $(this.refs.description).val('');
    this.setState({
      endYear: {
        isPresent: true
      },
      currentYear: this.state.currentYear
    });
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
    this.props.addUserExperience({
      userExperience: userExperience,
      index: this.props.index
    });
  }

  handleChange(e){
    this.setState({
      endYear: {
        isPresent: !this.state.endYear.isPresent
      },
      currentYear: this.state.currentYear
    });
  }

  refreshModal(e){
    this.setState({
      endYear: {
        isPresent: this.state.endYear.isPresent
      },
      currentYear: this.state.currentYear
    });
  }

  render() {
    if (!this.props) {
      return null;
    }

    return (
      <div id="custom-width-modal-new-experience" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true" style={{display: 'none'}}>
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
                    <input className="form-control" type="text" ref="positionTitle" required defaultValue="" />
                  </div>
                  <div className="form-group no-margin">
                    <label htmlFor="field-7" className="control-label">Company Name</label>
                    <input className="form-control" type="text" ref="companyName" required defaultValue="" />
                  </div>
                  <div className="form-group no-margin">
                    <label htmlFor="field-7" className="control-label">Time Period</label>
                    <div>
                      <input className="form-control experience-input-year" type="number" ref="startYear" required max={this.state.currentYear} defaultValue={this.state.currentYear} onChange={this.refreshModal}/>
                      <span className='to'>－</span>
                      {this.state.endYear.isPresent?
                        <span ref="endYear">Present</span>
                        :
                        <input
                          className="form-control experience-input-year"
                          type="number"
                          ref="endYear"
                          required
                          max={this.state.currentYear}
                          min={this.refs.startYear?this.refs.startYear.value:this.state.currentYear}
                          defaultValue={this.state.currentYear}
                        />
                      }
                      <div className="checkbox checkbox-primary experience-input-year-present">
                        <input id="experience_isPresent_new" type="checkbox" checked={this.state.endYear.isPresent} onChange={this.handleChange}/>
                        <label htmlFor="experience_isPresent_new">
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
                    }} defaultValue=""></textarea>
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

AddExperienceModal.propTypes = {
  index: PropTypes.number.isRequired,
  addUserExperience: PropTypes.func
};

export default AddExperienceModal;
