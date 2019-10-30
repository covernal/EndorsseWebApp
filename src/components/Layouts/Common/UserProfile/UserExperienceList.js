import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Utils from '../../../../utils';
import {EditExperienceModal, AddExperienceModal} from '../../../Widgets/EndorsseModal';

class UserExperienceList extends Component {
  constructor(props) {
    super(props);
    this.updateUserExperience = this.updateUserExperience.bind(this);
    this.addUserExperience = this.addUserExperience.bind(this);
  }

  updateUserExperience(object){
    const index = object.index;
    const experience = object.userExperience;
    let userExperience = JSON.parse(this.props.userDetails.user.get('experience'));
    userExperience.sort((a, b) => {
      if((a.endYear.iso == 'Present' && b.endYear.iso == 'Present')||(a.endYear.iso != 'Present' && b.endYear.iso != 'Present')){
        return Utils.DateTimeHelper.getYear(a.startYear.iso) < Utils.DateTimeHelper.getYear(b.startYear.iso);
      }else if(a.endYear.iso == 'Present'){
        return false;
      }else if(b.endYear.iso == 'Present'){
        return true;
      }
    });
    if(experience){
      userExperience[index] = experience;
    }else{
      userExperience.splice(index, 1);
    }
    const data = {
      experience: JSON.stringify(userExperience)
    };
    this.props.updateUserProfile(data);
  }

  addUserExperience(object){
    const index = object.index;
    const experience = object.userExperience;
    let userExperience = [];
    if(index == 0 && !this.props.userDetails.user.has('experience')){
      userExperience = [experience];
    }else{
      userExperience = JSON.parse(this.props.userDetails.user.get('experience'));
      userExperience[userExperience.length] = experience;
    }
    const data = {
      experience: JSON.stringify(userExperience)
    };
    this.props.updateUserProfile(data);
  }

  render() {
    if (!this.props ||
    this.props.userDetails == undefined) {
      return (
        <div className="col-md-12 col-sm-12 user-experience-list">
          <h4>Experience </h4>
          <i className="fa fa-spinner fa-spin-custom" aria-hidden="true"></i>
        </div>
      );
    }

    let buttonClass = this.props.isPublic ? 'btn btn-xs btn-default waves-effect waves-light hidden' : 'btn btn-xs btn-default waves-effect waves-light';

    let rows = [];
    let experienceData = {};
    if(this.props.userDetails.user.has('experience')){
      experienceData = JSON.parse(this.props.userDetails.user.get('experience'));
      experienceData.sort((a, b) => {
        if((a.endYear.iso == 'Present' && b.endYear.iso == 'Present')||(a.endYear.iso != 'Present' && b.endYear.iso != 'Present')){
          return Utils.DateTimeHelper.getYear(a.startYear.iso) < Utils.DateTimeHelper.getYear(b.startYear.iso);
        }else if(a.endYear.iso == 'Present'){
          return false;
        }else if(b.endYear.iso == 'Present'){
          return true;
        }
      });

      if(experienceData.length == 0 || this.props.userDetails.user.get('experience') == undefined){
        rows.push(
          <div className="p-t-10" key="no-experience-details">
            <h5 className="text-custom m-b-5">No experience details.</h5>
          </div>
        );
      }else{
        experienceData.forEach((experience, index) => {

          rows.push(
            <div className="p-t-10" key={'education_' + index}>
              <EditExperienceModal
                index={index}
                userExperience={experience}
                updateUserExperience={this.updateUserExperience}
              />

              <h5 className="text-custom m-b-5">{experience.positionTitle}
                <button className={buttonClass} type="submit" data-toggle="modal" data-target={`#custom-width-modal-edit-experience-${index}`} ><i className="mdi mdi-pencil"></i> Edit</button>
                <button className={buttonClass} type="submit" onClick={() => {this.updateUserExperience({index:index});}}><i className="mdi mdi-delete"></i> Delete</button>
              </h5>
              <p className="m-b-0">{experience.companyName}</p>
              <p><b>{Utils.DateTimeHelper.getYear(experience.startYear.iso)}-{Utils.DateTimeHelper.getYear(experience.endYear.iso)}</b></p>

              <p className="text-muted font-13 m-b-0 with-paragraphs">{experience.description}</p>
            </div>
          );
          rows.push(<br key={'experience_break_' + index} />);
        });
      }
    }else{
      rows.push(
        <div className="p-t-10" key="no-experience">
          <h5 className="text-custom m-b-5">No experience details.</h5>
        </div>
      );
    }

    return (
      <div className="col-md-12 col-sm-12 user-experience-list">
        <AddExperienceModal
          index={this.props.userDetails.user.has('experience')?JSON.parse(this.props.userDetails.user.get('experience')).length:0}
          addUserExperience={this.addUserExperience}
          />
        <h4>Experience <button className={buttonClass} type="submit" data-toggle="modal" data-target="#custom-width-modal-new-experience"><i className="mdi mdi-plus-circle"></i> Add New</button></h4>

        {rows}
      </div>
    );
  }
}

UserExperienceList.propTypes = {
  userDetails: PropTypes.object,
  isPublic: PropTypes.bool.isRequired
};

export default UserExperienceList;
