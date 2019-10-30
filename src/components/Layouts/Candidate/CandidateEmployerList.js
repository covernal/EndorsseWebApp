import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import EndorsseBrowseCard from '../../Widgets/EndorsseCard/EndorsseBrowseCard';

class CandidateEmployerLis extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    let loadingClass = (this.props.isInitTable || this.props.isInitTable == undefined) ? 'loading' : 'loading hidden';
    if (!this.props || this.props.employersData == undefined) {
      return null;
    }

    let rows = [];
    this.props.employersData.forEach((employer, index) => {
      let data = {
        image: employer.attributes.profileImageURL,
        username: employer.attributes.username,
        name: employer.attributes.companyName,
        link: employer.attributes.companyURL,
        locationString: employer.attributes.locationString,
        description: employer.attributes.summary
      };
      rows.push(
        <div key={'col_' + index} className="col-md-4">
          <EndorsseBrowseCard
            data={data}
            profileBtnLabel={this.props.profileBtnLabel}
            browseBtnLabel={this.props.browseBtnLabel}
            profileURL={this.props.profileURL}
            browseURL={this.props.browseURL}
            isEmployer={true}
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

CandidateEmployerLis.contextTypes = {
  router: PropTypes.object.isRequired
};

CandidateEmployerLis.propTypes = {
  employersData: PropTypes.array,
  hasMoreEmployers: PropTypes.bool,
  isInitTable: PropTypes.bool
};

export default CandidateEmployerLis;
