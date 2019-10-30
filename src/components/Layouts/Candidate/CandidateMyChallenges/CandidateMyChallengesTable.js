import React, {Component, PropTypes} from 'react';
import cookie from 'react-cookie';
import EndorsseRating from '../../../Widgets/EndorsseRating';
import RateMentorModal from '../../../Widgets/EndorsseModal/RateMentorModal';
import CandidateSolutionBtn from '../../../Widgets/EndorsseButton/CandidateSolutionBtn';
import ViewCommentModal from '../../../Widgets/EndorsseModal/ViewCommentModal';
import PayChallengeModal from '../../../Widgets/EndorsseModal/PayChallengeModal';
import StripePayModal from '../../../Widgets/EndorsseModal/StripePayModal';
import {Link} from 'react-router';

class CandidateMyChallengesTable extends Component {
  constructor(props, context) {
    super(props);
    this.goToTaskDetailPage = this.goToTaskDetailPage.bind(this);
  }

  goToTaskDetailPage(taskId) {
    let maxAge = 60*60;
    cookie.save('hasChallengeBtn', 'yes', {path: '/', maxAge: maxAge});
    this.context.router.push('/task-detail/' + taskId);
  }

  render() {
    let loadingClass = (this.props.isInitTable || this.props.isInitTable == undefined) ? 'loading' : 'loading hidden';

    if (!this.props ||
    this.props.challengesData == undefined) {
      return null;
    }

    let rows = [];
    this.props.challengesData.forEach((c, index) => {
      let challenge = c;
      let candidates = (challenge.candidates == 0) ? '-' : (<Link to="#" className="table-action-btn text-primary">{challenge.candidates}</Link>);
      let mentorsRate = '-';
      let mentorsComment = '-';
      let payment = '-';
      let rateMentor = '-';
      let commentMentor = '-';   
      let solution = [];       

      if(challenge.rateToCandidate == 0) {
        //1. Begin of challenge: It means candidate just started challenge and the mentor hasn't response yet.
        if(challenge.submittedFileURL == undefined || challenge.submittedFileURL == '') {
          //Case 1.1: Candidate Hasn't submit any solution
          challenge['solution'] = ["Submit"];
        }else {
          //Case 1.2: Candidate has submitted a solution.
          challenge['solution'] = ["Download", "Re-submit"];
        }
      }else {
        challenge['solution'] = ["Download"];
        if(challenge.stripeChargeJSONString == ''){
          //2. Mentor has rated and commented the candidate's solution: It means the mentor has reviewed the candidate's solution and now the candidate has to pay to see the rate and comment
          mentorsRate = (<Link className="table-action-btn h3"><i className="mdi mdi-lock-outline text-grey"></i></Link>);
          mentorsComment = mentorsRate;
          payment = (
            <div>
              <StripePayModal challengeData={challenge} handlePayment={this.props.handlePayment} />
              <PayChallengeModal 
                challenge={challenge}                 
                vouchersData={this.props.payChallengeData.vouchersData}
                hasMoreVouchers={this.props.payChallengeData.hasMoreVouchers}
                isInitVouchersTable={this.props.payChallengeData.isInitVouchersTable}
                isLoadingMoreVouchers={this.props.payChallengeData.isLoadingMoreVouchers}
                loadMoreVouchers={this.props.payChallengeData.loadMoreVouchers}
                />
              <Link data-toggle="modal" data-target={`#custom-with-modal-view-paychallenge-${challenge.id}`} className="btn btn-sm btn-primary">Pay</Link>
            </div>
          );
        }else {
          payment = 'Paid';
          mentorsRate = (<EndorsseRating value={challenge.rateToCandidate}/>);
          mentorsComment = (
            <div>
              <Link data-toggle="modal" data-target={`#custom-with-modal-view-comment${index}`} className="table-action-btn h3"><i className="mdi mdi-information-outline text-grey"></i></Link>
              <ViewCommentModal id={index} title="Comment To Candidate" comment={challenge.mentorsComment} />
            </div>);    

          if(challenge.rateToMentor == 0) {
            //3. Candidate has paid the challenge: This means the candidate has paid the challenge but hasn't review the mentor.
            commentMentor = '-';
            rateMentor = (
              <div>
                <EndorsseRating value={challenge.rateToMentor} target={`#custom-with-modal-rate-mentor-${challenge.id}`} />
                <RateMentorModal 
                  id={`custom-with-modal-rate-mentor-${challenge.id}`} 
                  challengeID={challenge.id}
                  handleRate={this.props.handleRate}                 
                />
              </div>);
          }else {
            //4. Complete rating and commeting mentor: This means the whole "challenge" has been completed. Show everything.
            commentMentor = (
              <div>
                <Link data-toggle="modal" data-target={`#custom-with-modal-view-comment-mentor${index}`} className="table-action-btn h3"><i className="mdi mdi-information-outline text-grey"></i></Link>
                <ViewCommentModal id={`-mentor${index}`} title="Comment To Mentor" comment={challenge.commentMentor} />
              </div>);
            rateMentor = (<EndorsseRating value={challenge.rateToMentor} />);
          }
        }
      }
      rows.push(
        <tr className="" key={`challenge_${index}`}>
          <td>{challenge.title}</td>
          <td><Link to={`/profile/${challenge.mentorUsername}`} className="text-primary">{challenge.mentorFullname}</Link></td>
          <td><Link onClick={()=>this.goToTaskDetailPage(challenge.taskId)} className="table-action-btn h3"><i className="mdi mdi-information-outline text-grey"></i></Link></td>
          <td>
            <CandidateSolutionBtn   
              challenge={challenge}
              downloadURL={challenge.submittedFileURL}
              submitAction={this.props.submitAction}
              reSubmitAction={this.props.reSubmitAction}
            />
          </td>
          <td>{mentorsRate}</td>
          <td>{mentorsComment}</td>
          <td>{payment}</td>
          <td>{rateMentor}</td>
          <td>{commentMentor}</td>
        </tr>
      );
    });
    return (
      <div className="table-responsive" style={{overflowX: "visible"}}>        
        <table className="table table-hover mails m-0 table table-actions-bar">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Mentor</th>
              <th>Task Details</th>
              <th>Solution</th>
              <th>Mentor's Rate</th>
              <th>Mentor's Comment</th>
              <th>Payment</th>
              <th>Rate Mentor</th>
              <th>Comment Mentor</th>
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

CandidateMyChallengesTable.contextTypes = {
  router: PropTypes.object.isRequired
};

CandidateMyChallengesTable.propTypes = {
  challengesData: PropTypes.array,
  isInitTable: PropTypes.bool
};

export default CandidateMyChallengesTable;
