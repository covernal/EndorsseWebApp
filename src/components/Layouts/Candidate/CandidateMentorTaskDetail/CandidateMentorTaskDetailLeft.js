import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Find from 'lodash/find';
import EndorsseIntroCard from '../../../Widgets/EndorsseCard/EndorsseIntroCard';

class CandidateMentorTaskDetailLeft extends React.Component{
  render() {
    if (!this.props || !this.props.taskData) {
      return null;
    }

    let task = this.props.taskData;
    let mentor = this.props.mentorData;
    return (
      <div className="col-md-4">
        <div className="card-box">
          <div className="table-responsive">
            <table className="table table-bordered m-b-0">
              <tbody>
                <tr>
                  <th scope="row">Type:</th>
                  <td>{task.type}</td>
                </tr>
                <tr>
                  <th scope="row">Skill tested: </th>
                  <td>{task.skillsTested}</td>
                </tr>
                <tr>
                  <th scope="row">Price:</th>
                  <td>{task.currency.toUpperCase()} ${task.price}</td>
                </tr>
                <tr>
                  <th scope="row">Estimated completion time:</th>
                  <td>{task.estimatedCompletionTime} hours</td>
                </tr>
                <tr>
                  <th scope="row">Required answer structure:</th>
                  <td>{task.requiredAnswerStructure}</td>
                </tr>
                <tr>
                  <th scope="row">Marking criteria:</th>
                  <td>{task.markingCriteria}</td>
                </tr>
                <tr>
                  <th scope="row">Attached file:</th>
                  <td>{(task.attachedFileUrl !== undefined) ? <a href={task.attachedFileUrl}>Download Attached File</a> : ''}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <EndorsseIntroCard title="Mentor" image={mentor.profileImageURL} name={mentor.firstName + ' ' + mentor.lastName} description={mentor.summary} link={mentor.linkedInURL} location={mentor.locationString} username={mentor.username} />
      </div>

    );
  }
}

export default CandidateMentorTaskDetailLeft;
