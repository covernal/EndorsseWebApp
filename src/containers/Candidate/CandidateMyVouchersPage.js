import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import Find from 'lodash/find';
import _ from 'lodash';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import CandidateMyVouchersLeft from '../../components/Layouts/Candidate/CandidateMyVouchers/CandidateMyVouchersLeft';
import CandidateMyVouchersRight from '../../components/Layouts/Candidate/CandidateMyVouchers/CandidateMyVouchersRight';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';

import {CandidateUserActions} from '../../actions';

class CandidateMyVouchersPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      skip: 0,
      location: '',
      username: Cookie.load('username'),
      sendingRequest: false,
      serverError: this.props.serverError,
      code: Cookie.load('username'),
      shareURL: '',
      vouchersData: [],
      hasMoreVouchers: true,
      isLoadingMore: false,
      isInitTable: true
    };
    this.loadMoreCallback = this.loadMoreCallback.bind(this);
    this.loadMoreVouchers = this.loadMoreVouchers.bind(this);
  }

  componentDidMount(){   
    this.setState({
      shareURL: "https://facebook.com/sharer.php" + this._objectToGetParams({
        u: "https://endorsse.com/",
        title: "Are you a talented developer like me?",
        description: "Challenge tasks and get endorsements from mentors from reputable companies. Join Endorsse today with my code " + this.state.code.toUpperCase() + " to receive 10% OFF."
      })        
    }); 

    this.props.loadCandidateMyVouchers({
      skip: this.state.skip,
      cb: () => this.loadMoreCallback()
    });    
  }

  _objectToGetParams(object) {
    return '?' + _.map(object, (v, i) => {
      return i + '=' + encodeURIComponent(v);
    }).join('&');
  } 

  loadMoreVouchers() {
    this.setState({
      isLoadingMore: true
    }, () => {
      this.props.loadCandidateMyVouchers({
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

    if(this.props.candidateMyVouchers.length > 0){
      let limit = 0;
      this.props.candidateMyVouchers.forEach((voucher) => {
        let existObj = Find(this.state.vouchersData, (e) => {
          return e.id == voucher.id;
        });
        if(existObj == undefined) {
          limit++;
          this.state.vouchersData.push(voucher);
          localStorage.setItem('vouchers', JSON.stringify(this.state.vouchersData));
        }
      });

      this.setState({
        skip: this.state.skip + limit,
        vouchersData: this.state.vouchersData,
        isInitTable: false,
        isLoadingMore: false
      });
    }else{
      this.setState({
        hasMoreVouchers: false,
        isInitTable: false,
        isLoadingMore: false
      });
    }
  }

  render() {
    if (!this.props) {
      return null;
    }else{
      let overlayClass = (this.state.sendingRequest) ? 'endorsse-overlay show' : 'endorsse-overlay';

      return (
        <div className="page-wrapper mentor-tasks-page">
          <header id="topnav">
            <DashboardHeader isPublic={false} />
            <DashboardSubHeader />
          </header>

          <div className="wrapper">
            <div className="container">

              <div className="row">
                <div className="col-sm-12">
                  <div className="page-title-box">
                    <h4 className="page-title">My Vouchers</h4>
                  </div>
                </div>
              </div>

              <div className="row">
                  <CandidateMyVouchersLeft 
                    code={this.state.code} 
                    shareURL={this.state.shareURL} 
                    increaseSocialShareCount={this.props.increaseSocialShareCount} 
                  />
                  <CandidateMyVouchersRight 
                    hasMoreVouchers={this.state.hasMoreVouchers}
                    isLoadingMore={this.state.isLoadingMore}
                    vouchersData={this.state.vouchersData} 
                    isInitTable={this.state.isInitTable}
                    loadMoreVouchers={this.loadMoreVouchers}
                  />
              </div>

            </div>
          </div>

          <EndorsseOverlay
            overlayClass={overlayClass}
            message="Please wait..."
          />

          <SweetAlert
            show={this.state.serverError != null}
            type="error"
            title="Oops..."
            text={(this.state.serverError != null) ? this.state.serverError.message : ''}
            onConfirm={()=>this.setState({serverError: null})}
          />

          <DashboardFooter />
        </div>
      );
    }
  }
}

CandidateMyVouchersPage.propTypes = {
  serverError: PropTypes.object
};


const mapStateToProps = (state) => {
  return {
    candidateMyVouchers: state.CandidateUserReducer.candidateMyVouchers,
    serverError: state.CandidateUserReducer.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    increaseSocialShareCount: () => {
      dispatch(CandidateUserActions.increaseSocialShareCount());
    },
    loadCandidateMyVouchers: (req) => {
      dispatch(CandidateUserActions.candidateLoadMyVouchers(req.skip, req.cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CandidateMyVouchersPage);