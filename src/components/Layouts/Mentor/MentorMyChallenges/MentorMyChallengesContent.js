import React, {Component, PropTypes} from 'react';
import MentorMyChallengesTable from './MentorMyChallengesTable';

class MentorMyChallengesContent extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="card-box">
            <MentorMyChallengesTable
              challengesData={this.props.challengesData}
              hasMoreChallenges={this.props.hasMoreChallenges}
              isInitTable={this.props.isInitTable}
              reSubmitAction={this.props.reSubmitAction}
              handleRate={this.props.handleRate}
            />
          </div>
        </div>
      </div>
    );
  }
}

MentorMyChallengesContent.propTypes = {
  challengesData: PropTypes.array,
  hasMoreChallenges: PropTypes.bool,
  isInitTable: PropTypes.bool
};

export default MentorMyChallengesContent;
