if (process.env.BROWSER) {
  require('./_userChallengeList.less');
}
import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import cookie from 'react-cookie';
import $ from 'jquery';
import ViewCommentModal from '../../../../Widgets/EndorsseModal/ViewCommentModal';

class UserChallengeList extends Component {
  constructor(props, context) {
    super(props);
    this.loadAllChallenges = this.loadAllChallenges.bind(this);
    this.goToTaskDetailPage = this.goToTaskDetailPage.bind(this);
  }

  loadAllChallenges() {
    if(cookie.load('username')) {
      this.props.loadAllChallenges();
    }else {      
      //redirect to login page
      this.context.router.push('/login');
    }        
  }

  goToTaskDetailPage(taskId) {
    let maxAge = 60*60;
    cookie.save('hasChallengeBtn', 'no', {path: '/', maxAge: maxAge});
    this.context.router.push('/task-detail/' + taskId);
  }

  render() {
    if (!this.props ||
    this.props.isInitTable == true) {
      return (
        <div className="col-md-12 col-sm-12 user-experience-list">
          <center><i className="fa fa-spinner fa-spin-custom loading" aria-hidden="true"></i></center>
        </div>
      );
    }

    let rows = [];
    let challengeData = {};
    let _this = this;
    if(this.props.challengesData && this.props.challengesData.length > 0){
      const dataLength = this.props.challengesData.length;
      challengeData = this.props.challengesData;
      challengeData.forEach((challenge, index) => {
        let rate = [true, true, true, true, true];
        let rateValue = 0;
        let username = '';
        let fullname = '';
        let comment = '';
        let commentModalTitle = '';
        if(challenge.get('type') == "mentor") {
          rateValue = challenge.get('rateToMentor');
          comment = challenge.get('commentToMentor');
          username = challenge.get('candidateUsername');
          fullname = challenge.get('candidateFullName');
          commentModalTitle = 'Candidate’s Review';
        }else {
          rateValue = challenge.get('rateToCandidate');
          comment = challenge.get('commentToCandidate');
          username = challenge.get('mentorUsername');
          fullname = challenge.get('mentorFullName');
          commentModalTitle = 'Mentor’s Review';
        }
        rate = _.map(rate, (v, i) => {
          if(rateValue){
            if(rateValue> i){
              return true;
            }else{
              return false;
            }
          }else{
            return false;
          }
        });
        let task = JSON.parse(challenge.get('taskJSONString'));
        rows.push(
          <div className=" p-t-10" key={'challenge_' + index}>
            {
              (cookie.load('username')) ?
              <h5 className="text-custom m-b-5"><Link onClick={()=>_this.goToTaskDetailPage(task.objectId)}>{task.title}</Link></h5>
              :
              <h5 className="text-custom m-b-5">{task.title}</h5>
            }
            <p className="m-b-0">By <i><a href={`${document.location.origin}/profile/${username}`} className="text-muted">{fullname}</a></i></p>
            <p></p>
            <p>
              {
                _.map(rate, (v, i) => {
                  if(v){
                    return (
                      <span key={`challenge_${index}_star_${i}`}><i className="fa fa-star text-warning"></i> </span>
                    );
                  }else{
                    return (
                      <span key={`challenge_${index}_star_${i}`}><i className="fa fa-star"></i> </span>
                    );
                  }
                })
              }
            </p>
            <p className="text-muted font-13 m-b-0">
              {(comment.length > 300) ? comment.substr(0, 300) + "..." : comment}
              <i><Link data-toggle="modal" data-target={`#custom-with-modal-view-comment${challenge.id}`}> Show All</Link></i>
            </p>            
            <ViewCommentModal id={challenge.id} title={commentModalTitle} comment={comment} />
          </div>
        );
        rows.push(<br key={'challenge_break_' + index} />);
      });

    }else{
      rows.push(
        <div className=" p-t-10" key="no-education">
          <h5 className="text-custom m-b-5">No challenge details.</h5>
        </div>
      );
    }
    
    if(this.props.all) {
      let disabled = (this.props.isLoadingMore || !this.props.hasMoreChallenges) ? 'disabled' : '';
      let spinnerClass = (this.props.isLoadingMore) ? 'fa fa-spinner fa-spin-custom' : 'fa fa-spinner fa-spin-custom hidden';
      return (
        <div className="col-md-12 col-sm-12 user-challenge-list">
          <h4>All Challenges</h4>
          {rows}
          <hr/>
          <button type="button" disabled={disabled} className="btn btn-default waves-effect w-md waves-light" onClick={this.loadAllChallenges}><i className={spinnerClass} aria-hidden="true"></i> {(this.props.hasMoreChallenges) ? 'Load More' : 'No More Challenge'}</button>        
        </div>      
      );
    }

    return (
      <div className="col-md-12 col-sm-12 user-challenge-list">
        <h4>Recent Challenges</h4>
        {rows}
        <div className=" p-t-10" key='see_all'>
          <p className="m-b-0"><Link onClick={this.loadAllChallenges}><i>See all challenges from this user</i></Link></p>
        </div>          
      </div>        
    );
  }
}

UserChallengeList.contextTypes = {
  router: PropTypes.object.isRequired
};

UserChallengeList.propTypes = {
  userDetails: PropTypes.object
};

export default UserChallengeList;
