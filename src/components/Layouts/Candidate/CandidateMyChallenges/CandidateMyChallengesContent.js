import React, {Component, PropTypes} from 'react';
import CandidateMyChallengesTable from './CandidateMyChallengesTable';

class CandidateMyChallengesContent extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="card-box">
            <CandidateMyChallengesTable
              challengesData={this.props.challengesData}
              hasMoreChallenges={this.props.hasMoreChallenges}
              isInitTable={this.props.isInitTable}
              submitAction={this.props.submitAction}
              reSubmitAction={this.props.reSubmitAction}
              handlePayment={this.props.handlePayment}
              handleRate={this.props.handleRate}
              payChallengeData={this.props.payChallengeData}
            />
          </div>
        </div>
      </div>
    );
  }
}

CandidateMyChallengesContent.propTypes = {
  challengesData: PropTypes.array,
  hasMoreChallenges: PropTypes.bool,
  isInitTable: PropTypes.bool
};

export default CandidateMyChallengesContent;
