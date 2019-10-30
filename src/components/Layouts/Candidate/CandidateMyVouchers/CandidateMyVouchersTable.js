import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import Find from 'lodash/find';

class CandidateMyVouchersTable extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      vouchers: [],
      totalDiscount: 0
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, voucher) {
    let vouchers = this.state.vouchers;
    let totalDiscount = this.state.totalDiscount;
    if(e.target.checked == true) {
      vouchers.push(voucher.id);
      totalDiscount += voucher.attributes.voucherDiscountRate;      
    }else {      
      vouchers.forEach((vId, idx) => {
        if(vId == voucher.id) {          
          vouchers.splice(idx, 1);
          totalDiscount -= voucher.attributes.voucherDiscountRate;
        }
      });      
    }

    let canDiscount = this.props.handleDiscount(totalDiscount, vouchers);
    if(canDiscount == false) {
      e.target.checked = false;
    }else {
      this.state.vouchers = vouchers;
      this.state.totalDiscount = totalDiscount;
    }
  }

  render() {
    let loadingClass = (this.props.isInitTable || this.props.isInitTable == undefined) ? 'loading' : 'loading hidden';

    if (!this.props || this.props.vouchersData == undefined) {
      return null;
    }

    let rows = [];
    let current = moment();
    this.props.vouchersData.forEach((voucher, index) => {
      let expiry = moment(voucher.createdAt).add(1, 'year');
      let diff = expiry.diff(current, 'days');
      let className = (diff <= 30) ? 'text-danger' : '';
      if(this.props.use == true) {
        rows.push(
          <tr className="" key={'voucher' + index}>
            <td><input type="checkbox" onChange={(e)=>this.handleChange(e, voucher)} /></td>
            <td>{voucher.from.firstName + ' ' + voucher.from.lastName}</td>
            <td>${voucher.attributes.voucherDiscountRate}</td>
            <td className={className} style={{width:'110px'}}>{expiry.format('YYYY-MM-DD')}</td>
          </tr>
        );
      }else {
        rows.push(
          <tr className="" key={'voucher' + index}>
            <td>{voucher.from.firstName + ' ' + voucher.from.lastName}</td>
            <td>${voucher.attributes.voucherDiscountRate}</td>
            <td className={className} style={{width:'110px'}}>{expiry.format('YYYY-MM-DD')}</td>
          </tr>
        );
      }
    });

    return (
      <div className="table-responsive"> 
        <table className="table table-hover mails m-0 table table-actions-bar">
          <thead>            
            {
              (this.props.use == true) ? (
                <tr>
                  <th>Use</th>
                  <th>From</th>
                  <th>Value</th>
                  <th>Expiry</th>                  
                </tr>
              ) : (
                <tr>
                  <th>From</th>
                  <th>Value</th>
                  <th>Expiry</th>
                </tr>
              )
            }
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

CandidateMyVouchersTable.contextTypes = {
  router: PropTypes.object.isRequired
};

CandidateMyVouchersTable.propTypes = {
  vouchersData: PropTypes.array,
  isInitTable: PropTypes.bool
};

export default CandidateMyVouchersTable;
