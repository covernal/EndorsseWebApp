import './_errorPage.css';

import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';

class ErrorPage extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props) {
      return null;
    }

    return (
      <div className="page-wrapper">
        <h1>Page not found: 404 error</h1>
      </div>
    );
  }
}

export default ErrorPage;
