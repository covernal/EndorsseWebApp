import React, {Component, PropTypes} from 'react';
import Find from 'lodash/find';
import CandidateMyVouchersTable from '../../Layouts/Candidate/CandidateMyVouchers/CandidateMyVouchersTable';
import $ from 'jquery';

class PayChallengeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discount: 0,
      vouchers: []
    };
    this.handleDiscount = this.handleDiscount.bind(this);
    this.showStripPayModal = this.showStripPayModal.bind(this);
  }

  showStripPayModal() {
    $('.modal').modal('hide');
    let challengeId = this.props.challenge.id;
    localStorage.setItem('selectedVouchers', JSON.stringify(this.state.vouchers));
    $("#custom-with-modal-stripe" + challengeId).modal('show');
  }

  handleDiscount(total, vouchers) {
    if(total == undefined) {
      return false;
    }

    let rate = total / this.props.challenge.price * 100;
    if(rate > 30) {
      return false;
    }

    this.setState({
      discount: total,
      vouchers: vouchers
    });
    return true;    
  }

  render() {
    if (!this.props) {
      return null;
    }

    let disabled = (this.props.isLoadingMoreVouchers || !this.props.hasMoreVouchers) ? 'disabled' : '';
    let spinnerClass = (this.props.isLoadingMoreVouchers) ? 'fa fa-spinner fa-spin-custom' : 'fa fa-spinner fa-spin-custom hidden';    
    return (
      <div id={`custom-with-modal-view-paychallenge-${this.props.challenge.id}`} className="custom-with-modal-view-paychallenge modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true" style={{display: 'none'}}>
        <div className="modal-dialog" style={{width: '55%'}}>
          <div className="modal-content">
            <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 className="modal-title" id="custom-width-modalLabel">Pay Challenge</h4>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <h1 className="text-primary">${this.props.challenge.price - this.state.discount}</h1>

                  <h5 className="text-muted">Discount ${this.state.discount}</h5>
                  <br/>
                  <p className="">
                    By paying the task you will unlock mentor's rate and review. The challenge will also be visable on your public profile.
                  </p>
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-md-12">
                  <h5 className="page-title">Select vouchers (optional, up to 30% of the task price):</h5>
                  <br/>
                  <div className="card-box">
                    <CandidateMyVouchersTable
                      vouchersData={this.props.vouchersData}
                      isInitTable={this.props.isInitVouchersTable}
                      handleDiscount={this.handleDiscount}
                      use={true}
                    />
                  </div>
                  <div className="text-center">
                    <button type="button" disabled={disabled} className="btn btn-default waves-effect w-md waves-light m-t-0 m-b-30" onClick={this.props.loadMoreVouchers}>
                      <i className={spinnerClass} aria-hidden="true"></i> 
                      {(this.props.hasMoreVouchers) ? 'Load More' : 'No More Voucher'}
                    </button>
                  </div>  
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default waves-effect" data-dismiss="modal">Cancel</button>
              <button className="btn btn-primary waves-effect waves-light" onClick={this.showStripPayModal}>Pay Now</button>              
            </div>
          </div>          
        </div>
      </div>
    );
  }
}

export default PayChallengeModal;
