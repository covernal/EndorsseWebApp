import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class FormHeader extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    return (
      <div className="text-center account-logo-box">
        <h2 className="text-uppercase">
          <Link to="https://app.endorsse.com" className="text-success">
            <span><img src="assets/images/logo.png" alt="" height="36" /></span>
          </Link>
        </h2>
      </div>
    );
  }
}

export default FormHeader;
