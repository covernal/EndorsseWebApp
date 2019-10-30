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
import CandidateEmployerList from '../../components/Layouts/Candidate/CandidateEmployerList';

import {CandidateUserActions} from '../../actions';

class CandidateEmployerListPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      skip: 0,
      employers: [],
      hasMoreEmployers: true,
      isLoadingMore: false,
      isInitTable: true,
      serverError: null
    };

    this.loadMoreCallback = this.loadMoreCallback.bind(this);
    this.loadMoreEmployers = this.loadMoreEmployers.bind(this);
  }

  componentDidMount() {
    this.props.loadCandidateEmployers({
      skip: this.state.skip,
      cb: () => this.loadMoreCallback()
    });    
  }

  loadMoreEmployers() {
    this.setState({
      isLoadingMore: true
    }, () => {
      this.props.loadCandidateEmployers({
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

    if(this.props.candidateEmployers.length > 0){
      let limit = 0;
      this.props.candidateEmployers.forEach((employer) => {
        let existObj = Find(this.state.employers, (e) => {
          return e.id == employer.id;
        });
        if(existObj == undefined) {
          limit++;
          this.state.employers.push(employer);
          localStorage.setItem('employers', JSON.stringify(this.state.employers));
        }
      });

      this.setState({
        skip: this.state.skip + limit,
        employers: this.state.employers,
        isInitTable: false,
        isLoadingMore: false
      });
    }else{
      this.setState({
        hasMoreEmployers: false,
        isInitTable: false,
        isLoadingMore: false
      });
    }
  }

  render() {
    if (!this.props) {
      return null;
    }else{
      let disabled = (this.state.isLoadingMore || !this.state.hasMoreEmployers) ? 'disabled' : '';
      let spinnerClass = (this.state.isLoadingMore) ? 'fa fa-spinner fa-spin-custom' : 'fa fa-spinner fa-spin-custom hidden';

      return (
        <div className="page-wrapper candidate-employerlist-page">
          <header id="topnav">
            <DashboardHeader isPublic={false} />
            <DashboardSubHeader />
          </header>

          <div className="wrapper">
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <div className="page-title-box">
                    <h4 className="page-title">Browse Employers</h4>
                  </div>
                </div>
              </div>

              <CandidateEmployerList
                employersData={this.state.employers}
                hasMoreEmployers={this.state.hasMoreEmployers}
                isInitTable={this.state.isInitTable}
                profileBtnLabel="Profile"
                browseBtnLabel="Jobs"
                profileURL="/employer-profile/:username"
                browseURL="/employer-jobs/:username"
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
                  <button type="button" disabled={disabled} className="btn btn-default waves-effect w-md waves-light m-t-20 m-b-30" data-toggle="modal" data-target="#custom-width-modal" onClick={this.loadMoreEmployers}><i className={spinnerClass} aria-hidden="true"></i> {(this.state.hasMoreEmployers) ? 'Load More' : 'No More Employer'}</button>
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
    candidateEmployers: state.CandidateUserReducer.candidateEmployers,
    serverError: state.CandidateUserReducer.error    
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadCandidateEmployers: (req) => {
      dispatch(CandidateUserActions.candidateLoadEmployers(req.skip, req.cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CandidateEmployerListPage);
