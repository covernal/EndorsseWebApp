if (process.env.BROWSER) {
  require('../EndorsseInput/_endorsseLocationAutoComplete.less');
}
import React, {Component, PropTypes} from 'react';
import EndorsseLocationAutoComplete from '../EndorsseInput/EndorsseLocationAutoComplete';

class EditLocationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationString: this.props.userDetails.locationString,
      lat: this.props.userDetails.locationGeoPoint.latitude,
      lon: this.props.userDetails.locationGeoPoint.longitude
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e){
    this.props.updateUserProfile({
      locationString: this.state.locationString,
      lat: this.state.lat,
      lon: this.state.lon
    });
  }

  handleSelectLocation(place) {
    this.setState({locationString: place.formatted_address});
    if(place.geometry.location) {
      this.setState({lat: place.geometry.location.lat()});
      this.setState({lon: place.geometry.location.lng()});
    }
  }

  handleChange() {

  }

  render() {
    if (!this.props) {
      return null;
    }

    return (
      <div id="custom-width-modal-edit-location" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true" style={{display: 'none'}}>
        <div className="modal-dialog" style={{width: '55%'}}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h4 className="modal-title text-left" id="custom-width-modalLabel">Edit Location</h4>
            </div>
            <div className="modal-body">
              <div className="row text-left">
                <EndorsseLocationAutoComplete
                  className="col-xs-12"
                  placeholder="e.g. Melbourne VIC Australia"
                  value={this.state.locationString}
                  onPlaceSelected={(place) => this.handleSelectLocation(place)}
                  onChange={this.handleChange}
                  modal
                  label="Enter Location"                  
                />              
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default waves-effect" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary waves-effect waves-light" data-dismiss="modal" onClick={this.handleSubmit}>Done</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditLocationModal.propTypes = {
  userDetails: PropTypes.object.isRequired,
  updateUserProfile: PropTypes.func
};

export default EditLocationModal;
