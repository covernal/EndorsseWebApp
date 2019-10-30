if (process.env.BROWSER) {
  require('./_endorsseOverlay.less');
}
import React, {Component, PropTypes} from 'react';

class EndorsseOverlay extends Component {
  render() {
    if (!this.props) {
      return null;
    }else{
      return (
        <div className={this.props.overlayClass}>
          <i className="fa fa-spinner fa-spin-custom" aria-hidden="true"></i>
          <h6>{this.props.message}</h6>
        </div>
      );
    }
  }
}

EndorsseOverlay.propTypes = {
  overlayClass: PropTypes.string.isRequired,
  message: PropTypes.string
};

export default EndorsseOverlay;
