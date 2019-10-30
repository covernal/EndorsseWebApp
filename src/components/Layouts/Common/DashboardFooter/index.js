if (process.env.BROWSER) {
  require('./_dashboardFooter.less');
}
import React, {Component, PropTypes} from 'react';

class DashboardFooter extends Component {
  getThisYear() {
    return new Date().getFullYear();
  }

  render() {
    if (!this.props) {
      return null;
    }

    return (
      <footer className="footer text-right">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-center">
              &copy; {this.getThisYear()} Endorsse. All rights reserved. Support: <a href="mailto:hello@endorsse.com" className="text-primary">hello@endorsse.com</a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default DashboardFooter;
