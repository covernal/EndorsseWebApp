import React, {Component, PropTypes} from 'react';
import Cookie from 'react-cookie';
import {Link} from 'react-router';

class CandidateMentorTaskDetailRight extends Component {
  render() {
    if (!this.props || !this.props.taskData) {
      return null;
    }

    let type = Cookie.load('type');
    let viewChallenge = (type == "candidate" && Cookie.load('hasChallengeBtn') == 'yes') ?
      (<div>
        <div id="custom-width-modal-challenge-task" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true">
          <div className="modal-dialog" style={{width: '55%'}}>
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 className="modal-title" id="custom-width-modalLabel">Start a Challenge</h4>
              </div>
              <div className="modal-body">
                <h4>How it works</h4>
                <ol>
                  <li>
                      Confirm and start the challenge, the mentor will be notified and get ready for reviewing your solution.
                  </li>
                  <li>
                      Complete the task and submitted your solution, your mentor will rate and comment on your solution. You will have an email when the mentor completes the review.
                  </li>
                  <li>
                      Pay the task to see your mentor's review. The challenge will then appear on your profile page.
                  </li>
                  <li>
                      Leave a review to your mentor.
                  </li>
                </ol>
              </div>
              <div className="modal-footer">
                  <button type="button" className="btn btn-default waves-effect" data-dismiss="modal">Cancel</button>
                  <button type="button" className="btn btn-primary waves-effect waves-light" onClick={this.props.challengeTask}>Confirm & Start</button>
              </div>
            </div>
          </div>
        </div>

        <button type="button" className="btn btn-primary waves-effect w-md waves-light m-t-20" data-toggle="modal" data-target="#custom-width-modal-challenge-task">I Want to Challenge</button>
      </div>)
      :
      '';
    return (
      <div className="col-md-8">
        <div className="card-box">
          <div className="m-t-30">
            <h3>{this.props.taskData.title}</h3>
            <p className="m-t-20" dangerouslySetInnerHTML={{__html: this.props.taskData.fullDescription}} ></p>
            {viewChallenge}
          </div>
        </div>
      </div>
    );
  }
}

export default CandidateMentorTaskDetailRight;
