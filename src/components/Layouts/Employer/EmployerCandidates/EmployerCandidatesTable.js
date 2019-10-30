import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import EndorsseRating from '../../../Widgets/EndorsseRating';
import ViewCommentModal from '../../../Widgets/EndorsseModal/ViewCommentModal';

class EmployerCandidatesTable extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    let loadingClass = (this.props.isInitTable || this.props.isInitTable == undefined) ? 'loading' : 'loading hidden';
    if (!this.props ||
    this.props.candidateData == undefined) {
      return null;
    }

    let rows = [];
    this.props.candidateData.forEach((candidate, index) => {
      rows.push(
        <tr className="" key={'candidate' + index}>
          <td><Link to={`/profile/${candidate.username}`} className="text-primary">{candidate.name}</Link></td>
          <td><Link to={`/task-detail/${candidate.taskId}`} className="text-primary">{candidate.recentChallenge}</Link></td>
          <td><EndorsseRating value={candidate.rate} /></td>
          <td>
            <Link data-toggle="modal" data-target={`#custom-with-modal-view-comment${index}`} className="table-action-btn h3"><i className="mdi mdi-information-outline text-grey"></i></Link>
            <ViewCommentModal id={index} title="Mentor Comment" comment={candidate.comment} />
          </td>
          <td><a href={candidate.attributes.coverLetterURL} className="text-primary">Download</a></td>
          <td><a href={candidate.attributes.resumeURL} className="text-primary">Download</a></td>
        </tr>
      );
    });

    return (
      <div className="table-responsive">
        <table className="table table-hover mails m-0 table table-actions-bar">
          <thead>
            <tr>
              <th>Name</th>
              <th>Recent Challenge</th>
              <th>Mentor<br/>Rate</th>
              <th>Mentor<br/>Comment</th>
              <th>Cover Letter</th>
              <th>Resume</th>
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

EmployerCandidatesTable.contextTypes = {
  router: PropTypes.object.isRequired
};

EmployerCandidatesTable.propTypes = {
  candidateData: PropTypes.array,
  isInitTable: PropTypes.bool,
  hasMoreCandidates: PropTypes.bool
};

export default EmployerCandidatesTable;
