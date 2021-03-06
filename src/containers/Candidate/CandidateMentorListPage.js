import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import Find from 'lodash/find';
import Without from 'lodash/without';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import CandidateMentorList from '../../components/Layouts/Candidate/CandidateMentorList';

import {CandidateUserActions} from '../../actions';

class CandidateMentorListPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      skip: 0,
      mentors: [],
      hasMoreMentors: true,
      isLoadingMore: false,
      isInitTable: true,
      serverError: null
    };

    this.loadMoreCallback = this.loadMoreCallback.bind(this);
    this.loadMoreMentors = this.loadMoreMentors.bind(this);
  }

  componentDidMount() {
    this.props.loadCandidateMentors({
      skip: this.state.skip,
      cb: () => this.loadMoreCallback()
    });
  }

  loadMoreMentors() {
    this.setState({
      isLoadingMore: true
    }, () => {
      this.props.loadCandidateMentors({
        skip: this.state.skip,
        cb: () => this.loadMoreCallback()
      });
    });    
  }

  loadMoreCallback() {
    if(this.props.serverError != null) {
      this.setState({
        serverError: (this.props.serverError.message == undefined) ? {message: "Internal server error."} : this.props.serverError,
        isInitTable: false,
        isLoadingMore: false
      });
      return;
    }

    if(this.props.candidateMentors.length > 0){
      let limit = 0;
      this.props.candidateMentors.forEach((mentor) => {
        let existObj = Find(this.state.mentors, (m) => {
          return m.id == mentor.id;
        });
        if(existObj == undefined) {
          limit++;
          this.state.mentors.push(mentor);
          localStorage.setItem('mentors', JSON.stringify(this.state.mentors));
        }
      });

      this.setState({
        skip: this.state.skip + limit,
        employers: this.state.mentors,
        isInitTable: false,
        isLoadingMore: false
      });
    }else{
      this.setState({
        hasMoreMentors: false,
        isInitTable: false,
        isLoadingMore: false
      });
    }
  }

  render() {
    if (!this.props) {
      return null;
    }else{
      let disabled = (this.state.isLoadingMore || !this.state.hasMoreMentors) ? 'disabled' : '';
      let spinnerClass = (this.state.isLoadingMore) ? 'fa fa-spinner fa-spin-custom' : 'fa fa-spinner fa-spin-custom hidden';

      return (
        <div className="page-wrapper candidate-mentorlist-page">
          <header id="topnav">
            <DashboardHeader isPublic={false} />
            <DashboardSubHeader />
          </header>

          <div className="wrapper">
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <div className="page-title-box">
                    <h4 className="page-title">Browse Mentors</h4>
                  </div>
                </div>
              </div>
              
              <CandidateMentorList
                mentorsData={this.state.mentors}
                hasMoreMentors={this.state.hasMoreMentors}
                isInitTable={this.state.isInitTable}
                profileBtnLabel="Full Profile"
                browseBtnLabel="Browse Tasks"                
                profileURL="/profile/:username"
                browseURL="/mentor-tasks/:username"      
              />

              <SweetAlert
                show={this.state.serverError != null}
                type="error"
                title="Oops..."
                text={(this.state.serverError != null) ? this.state.serverError.message : ''}
                onConfirm={()=>this.setState({serverError: null})}
              />

              <div className="row">
                <div className="col-sm-12 text-center">
                  <button type="button" disabled={disabled} className="btn btn-default waves-effect w-md waves-light m-t-20 m-b-30" data-toggle="modal" data-target="#custom-width-modal" onClick={this.loadMoreMentors}><i className={spinnerClass} aria-hidden="true"></i> {(this.state.hasMoreMentors) ? 'Load More' : 'No More Mentor'}</button>
                </div>
              </div>
            </div>
          </div>
          <DashboardFooter />
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    candidateMentors: state.CandidateUserReducer.candidateMentors,
    serverError: state.CandidateUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadCandidateMentors: (req) => {
      dispatch(CandidateUserActions.candidateLoadMentors(req.skip, req.cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CandidateMentorListPage);
