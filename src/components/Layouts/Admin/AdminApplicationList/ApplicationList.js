import React, {Component, PropTypes} from 'react';
import Slice from 'lodash/slice';
import Map from 'lodash/map';

import ApplicationElement from './ApplicationElement';

class ApplicationList extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    if (!this.props || this.props.applicationData == undefined) {
      return null;
    }else{
      // setting
      const applicationPerRow = 3;
      const rowCount = Math.ceil(this.props.applicationData.length / 3);

      let list = [];
      for(let i = 0; i < rowCount; i++){
        const start = i == 0 ? 0 : applicationPerRow * i;
        const end = applicationPerRow * (i + 1) > this.props.applicationData.length ? this.props.applicationData.length : applicationPerRow * (i + 1);
        const row = Map(Slice(this.props.applicationData, start, end), v => {
          return (
            <ApplicationElement
              key={v.id}
              data={v}
              approveApplication={this.props.approveApplication}
              rejectApplication={this.props.rejectApplication}
            />
          );
        });
        list.push(row);
      }
      return (
        <div className="col-lg-12">
          {list}
        </div>
      );
    }
  }
}

ApplicationList.propTypes = {
  applicationData: PropTypes.array.isRequired
};

export default ApplicationList;
