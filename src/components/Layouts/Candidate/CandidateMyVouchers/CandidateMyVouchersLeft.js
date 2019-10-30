import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class CandidateMyVouchersLeft extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    return (
      <div className="col-md-4">
        <div className="card-box">
          <div className="m-t-10">
            <h5>Your Code</h5>
            <h1 className="text-primary">{this.props.code}</h1>
            <hr/>
            <p className="m-t-20">
              Share this special code with friends. When they sign up Endorsse with your code they will get a $10 off voucher and you will get a $10 off voucher when they spend with Endorsse.
              <br/><br/>
              You may use multiple vouchers in a single challenge for up to 30% of the task price.
            </p>
            <Link onClick={this.props.increaseSocialShareCount} to={this.props.shareURL} className="btn btn-sm btn-facebook waves-effect waves-light m-t-20" target="_blank"><i className="fa fa-facebook m-r-5"></i> Share on Facebook</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default CandidateMyVouchersLeft;
