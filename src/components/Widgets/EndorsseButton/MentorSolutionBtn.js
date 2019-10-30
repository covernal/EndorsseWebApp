import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import EditResubmissionModal from '../EndorsseModal/EditResubmissionModal';

class MentorSolutionBtn extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    let solution = this.props.challenge.solution;
    if(solution.length == 1 && solution[0] == "Download") {
      return (<a href={this.props.downloadURL} className="text-primary">Download</a>);
    }

    return (
      <div>
        <EditResubmissionModal challengeId={this.props.challenge.id} reSubmitAction={this.props.reSubmitAction} />
        <div className="btn-group">
            <button type="button" className="btn btn-primary btn-sm dropdown-toggle waves-effect" data-toggle="dropdown" aria-expanded="false"> Action <span className="caret"></span> </button>
            <ul className="dropdown-menu">
              {
                _.map(solution, (v, i) => {
                  let link = (<a href={this.props.downloadURL}>{v}</a>);
                  if(v == "Request Re-submission") {
                    link = (<Link data-toggle="modal" data-target={`#custom-with-modal-resubmission${this.props.challenge.id}`}>{v}</Link>);
                  }

                  return (<li key={`solution_${v}_${i}`}>{link}</li>);
                })     
              }          
                
            </ul>
        </div>
      </div>  
    );
  }
}

MentorSolutionBtn.propTypes = {
  challenge: PropTypes.object.isRequired
};

export default MentorSolutionBtn;
