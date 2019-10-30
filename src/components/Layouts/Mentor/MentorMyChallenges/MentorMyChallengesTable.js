import React, {Component, PropTypes} from 'react';
import EndorsseRating from '../../../Widgets/EndorsseRating';
import RateModal from '../../../Widgets/EndorsseModal/RateModal';
import ViewCommentModal from '../../../Widgets/EndorsseModal/ViewCommentModal';
import MentorSolutionBtn from '../../../Widgets/EndorsseButton/MentorSolutionBtn';
import {Link} from 'react-router';

class MentorMyChallengesTable extends Component {
  render() {
    let loadingClass = (this.props.isInitTable || this.props.isInitTable == undefined) ? 'loading' : 'loading hidden';

    if (!this.props ||
    this.props.challengesData == undefined) {
      return null;
    }

    let rows = [];
    this.props.challengesData.forEach((c, index) => {
      let challenge = c;
      let rateCandidate = '-';
      let commentCandidate = '-';
      let payment = '-';
      let candidatesRate = '-';
      let candidatesComment = '-';

      challenge['solution'] = [];
      if(challenge.submittedFileURL == undefined) {
        //1. New Challenge
        //This means the candidate hasn't uploaded the solution file. Use "-" for all other except first three columns.

      }else {
        if(challenge.rateToCandidate == undefined) {
          //2. Candidate submitted solution file
          /*
            This means the candidate has submitted a solution and waiting for the mentor to review. 
            Show a drop down list for Solution column. The mentor can download the solution or request to re-submission if needed          
          */
          challenge.solution = ["Download", "Request Re-submission"];
          rateCandidate = (
            <div>
              <EndorsseRating value="0" target={`#custom-with-modal-rate-${challenge.id}`} />
              <RateModal 
                id={`custom-with-modal-rate-${challenge.id}`} 
                challengeID={challenge.id}
                handleRate={this.props.handleRate}
              />
            </div>);
        }else {
          challenge.solution = ["Download"];
          rateCandidate = (<EndorsseRating value={challenge.rateToCandidate} />);

          commentCandidate = (
            <div>
              <Link data-toggle="modal" data-target={`#custom-with-modal-view-comment${index}`} className="table-action-btn h3"><i className="mdi mdi-information-outline text-grey"></i></Link>
              <ViewCommentModal id={index} title="Comment To Candidate" comment={challenge.commentToCandidate} />
            </div>); 

          if(challenge.stripeChargeJSONString == undefined || challenge.stripeChargeJSONString == '') {
            //3. Mentor reviewed candidate but candidate has not paid yet.
            //The mentor can only Download the solution, read-only Rate, read-only Comment. All other columns are "-"

          }else {
            payment = 'Paid';
            if(challenge.rateToMentor == undefined) {
              //4. Candidate paid the challenge but hasn't reviewed the mentor yet

            }else {
              //5. Candidate reviewed mentor. Whole challenge completed
              candidatesRate = (<EndorsseRating value={challenge.rateToMentor} />);
              candidatesComment = (
                <div>
                  <Link data-toggle="modal" data-target={`#custom-with-modal-view-comment-mentor${index}`} className="table-action-btn h3"><i className="mdi mdi-information-outline text-grey"></i></Link>
                  <ViewCommentModal id={`-mentor${index}`} title="Comment To Mentor" comment={challenge.commentToMentor} />
                </div>); 
            }
          }
        }
      }

      rows.push(
        <tr className="" key={'challenge' + index}>
          <td>{challenge.title}</td>
          <td><Link to={`/profile/${challenge.candidateUsername}`} className="text-primary">{challenge.candidateFullname}</Link></td>
          <td><Link to={`/task-detail/${challenge.taskId}`} className="table-action-btn h3"><i className="mdi mdi-information-outline text-grey"></i></Link></td>
          <td>
          {
            (challenge.solution.length > 0) ?
              (<MentorSolutionBtn   
                challenge={challenge}
                downloadURL={challenge.submittedFileURL}
                reSubmitAction={this.props.reSubmitAction}
                />) : '-'
          }
          </td>
          <td>{rateCandidate}</td>
          <td>{commentCandidate}</td>
          <td>{payment}</td>
          <td>{candidatesRate}</td>
          <td>{candidatesComment}</td>
        </tr>
      );
    });

    return (
      <div className="table-responsive" style={{overflowX: "visible"}}>
        <table className="table table-hover mails m-0 table table-actions-bar">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Candidate</th>
              <th>Task Details</th>
              <th>Solution</th>
              <th>Rate</th>
              <th>Comment</th>
              <th>Payment</th>
              <th>Candidate's Rate</th>
              <th>Candidate's Comment</th>
            </tr>
          </thead>

          <tbody>
            {rows}
          </tbody>
        </table>

        <div className={loadingClass}>
          <i className="fa fa-spinner fa-spin-custom" aria-hidden="true"></i>
        </div>
      </div>
    );
  }
}

MentorMyChallengesTable.propTypes = {
  challengesData: PropTypes.array,
  isInitTable: PropTypes.bool
};

export default MentorMyChallengesTable;
