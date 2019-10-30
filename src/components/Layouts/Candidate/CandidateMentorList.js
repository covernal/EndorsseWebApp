import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import EndorsseBrowseCard from '../../Widgets/EndorsseCard/EndorsseBrowseCard';

class CandidateMentorList extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    let loadingClass = (this.props.isInitTable || this.props.isInitTable == undefined) ? 'loading' : 'loading hidden';
    if (!this.props || this.props.mentorsData == undefined) {
      return null;
    }

    let rows = [];
    this.props.mentorsData.forEach((mentor, index) => {
      let data = {
        image: mentor.attributes.profileImageURL,
        username: mentor.attributes.username,
        name: mentor.attributes.firstName + " " + mentor.attributes.lastName,
        link: mentor.attributes.linkedInURL,
        locationString: mentor.attributes.locationString,
        description: mentor.attributes.summary
      };      
      rows.push(
        <div key={'col_' + index} className="col-md-4">
          <EndorsseBrowseCard
            data={data}
            profileBtnLabel={this.props.profileBtnLabel}
            browseBtnLabel={this.props.browseBtnLabel}
            profileURL={this.props.profileURL}
            browseURL={this.props.browseURL}
            isEmployer={false}
          />
        </div>
      );
    });

    return (
      <div className="row">
        {rows}
        <div className={loadingClass}>
          <i className="fa fa-spinner fa-spin-custom" aria-hidden="true"></i>
        </div>           
      </div>
    );
  }
}

CandidateMentorList.contextTypes = {
  router: PropTypes.object.isRequired
};

CandidateMentorList.propTypes = {
  mentorsData: PropTypes.array,
  hasMoreMentors: PropTypes.bool,
  isInitTable: PropTypes.bool
};

export default CandidateMentorList;
