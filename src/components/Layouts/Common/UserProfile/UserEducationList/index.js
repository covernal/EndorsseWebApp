if (process.env.BROWSER) {
  require('./_userEducationList.less');
}
import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Utils from '../../../../../utils';
import {EditEducationModal, AddEducationModal} from '../../../../Widgets/EndorsseModal';

class UserEducationList extends Component {
  constructor(props) {
    super(props);
    this.updateUserEducation = this.updateUserEducation.bind(this);
    this.addUserEducation = this.addUserEducation.bind(this);
  }

  updateUserEducation(object){
    const index = object.index;
    const education = object.userEducation;
    let userEducation = JSON.parse(this.props.userDetails.user.get('education'));
    userEducation.sort((a, b) => {
      return Utils.DateTimeHelper.getYear(a.endYear.iso) < Utils.DateTimeHelper.getYear(b.endYear.iso) || Utils.DateTimeHelper.getYear(a.startYear.iso) < Utils.DateTimeHelper.getYear(b.startYear.iso);
    });
    if(education){
      userEducation[index] = education;
    }else{
      userEducation.splice(index, 1);
    }
    const data = {
      education: JSON.stringify(userEducation)
    };
    this.props.updateUserProfile(data);
  }

  addUserEducation(object){
    const index = object.index;
    const education = object.userEducation;
    let userEducation = [];
    if(index == 0 && !this.props.userDetails.user.has('education')){
      userEducation = [education];
    }else{
      userEducation = JSON.parse(this.props.userDetails.user.get('education'));
      userEducation[userEducation.length] = education;
    }
    const data = {
      education: JSON.stringify(userEducation)
    };
    this.props.updateUserProfile(data);
  }

  render() {
    if (!this.props ||
    this.props.userDetails == undefined) {
      return (
        <div className="col-md-12 col-sm-12 user-education-list">
          <h4>Education </h4>
          <i className="fa fa-spinner fa-spin-custom" aria-hidden="true"></i>
        </div>
      );
    }

    let buttonClass = this.props.isPublic ? 'btn btn-xs btn-default waves-effect waves-light hidden' : 'btn btn-xs btn-default waves-effect waves-light';

    let rows = [];
    let educationData = {};

    if(this.props.userDetails.user.has('education') && this.props.userDetails.user.get('education') != ''){
      educationData = JSON.parse(this.props.userDetails.user.get('education'));

      educationData.sort((a, b) => {
        return Utils.DateTimeHelper.getYear(a.endYear.iso) < Utils.DateTimeHelper.getYear(b.endYear.iso) || Utils.DateTimeHelper.getYear(a.startYear.iso) < Utils.DateTimeHelper.getYear(b.startYear.iso);
      });

      if(educationData.length == 0 || !this.props.userDetails.user.has('education')){
        rows.push(
          <div className=" p-t-10">
            <h5 className="text-custom m-b-5">No education details.</h5>
          </div>
        );
      }else{
        educationData.forEach((education, index) => {
          rows.push(
            <div className=" p-t-10" key={'education_' + index}>
              <EditEducationModal
                index={index}
                userEducation={education}
                updateUserEducation={this.updateUserEducation}
              />
              <h5 className="text-custom m-b-5">{education.schoolName}
                <button className={buttonClass} type="submit" data-toggle="modal" data-target={`#custom-width-modal-edit-education-${index}`}>
                  <i className="mdi mdi-pencil"></i> Edit
                </button>
                <button className={buttonClass} type="submit" onClick={() => {this.updateUserEducation({index:index});}}>
                  <i className="mdi mdi-delete"></i> Delete
                </button>
              </h5>
              <p className="m-b-0">{education.certificateName}</p>
              <p><b>{Utils.DateTimeHelper.getYear(education.startYear.iso)}-{Utils.DateTimeHelper.getYear(education.endYear.iso)}</b></p>

              <p className="text-muted font-13 m-b-0 with-paragraphs">{education.description}</p>
            </div>
          );
          rows.push(<br key={'education_break_' + index} />);
        });
      }
    }else{
      rows.push(
        <div className=" p-t-10" key="no-education">
          <h5 className="text-custom m-b-5">No education details.</h5>
        </div>
      );
    }

    return (
      <div className="col-md-12 col-sm-12 user-education-list">
        <AddEducationModal
          index={this.props.userDetails.user.has('education')?JSON.parse(this.props.userDetails.user.get('education')).length:0}
          addUserEducation={this.addUserEducation}
        />
        <h4>Education <button className={buttonClass} type="submit" data-toggle="modal" data-target="#custom-width-modal-new-education"><i className="mdi mdi-plus-circle"></i> Add New</button></h4>
        {rows}
      </div>
    );
  }
}

UserEducationList.propTypes = {
  userDetails: PropTypes.object,
  isPublic: PropTypes.bool.isRequired
};

export default UserEducationList;
