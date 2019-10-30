import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import EmployerCandidatesTable from './EmployerCandidatesTable';

class EmployerCandidatesContent extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    if (!this.props ||
    this.props.candidateData == undefined) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="card-box">
            <EmployerCandidatesTable
              candidateData={this.props.candidateData}
              hasMoreCandidates={this.props.hasMoreCandidates}
              isInitTable={this.props.isInitTable}
            />
          </div>
        </div>
      </div>
    );
  }
}

EmployerCandidatesContent.contextTypes = {
  router: PropTypes.object.isRequired
};

EmployerCandidatesContent.propTypes = {
  candidateData: PropTypes.array,
  hasMoreCandidates: PropTypes.bool,
  isInitTable: PropTypes.bool
};

export default EmployerCandidatesContent;
