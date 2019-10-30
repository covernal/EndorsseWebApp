import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import EndorsseLocationAutoComplete from '../../../Widgets/EndorsseInput/EndorsseLocationAutoComplete';

class BrowseJobsLeft extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    return (
      <div className="col-lg-3 col-md-4">
        <div className="text-left card-box">
            <div className="member-card">
                <h4 className="m-b-20">Filters</h4>
                <hr/>
                <form role="form">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="p-0">
                                <div className="form-group m-b-20">
                                    <EndorsseLocationAutoComplete
                                      className=""
                                      placeholder="e.g. Melbourne"
                                      modal={true}
                                      label="Location"
                                      value={this.props.locationString}
                                      onPlaceSelected={(place) => this.props.handleSelectLocation(place)}       
                                    />                                    
                                </div>
                                <button type="button" className="btn btn-primary waves-effect w-md waves-light" onClick={this.props.onApply}>Apply</button>
                                &nbsp;
                                <button type="button" className="btn btn-default waves-effect w-md waves-light" onClick={this.props.onClear}>Clear</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      </div>
    );
  }
}

export default BrowseJobsLeft;
