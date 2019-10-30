if (process.env.BROWSER) {
  require('../EndorsseInput/_endorsseLocationAutoComplete.less');
}
import React, {Component, PropTypes} from 'react';
import EndorsseLocationAutoComplete from '../EndorsseInput/EndorsseLocationAutoComplete';

class EditCompanyLocationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationString: this.props.locationString,
      lat: this.props.lat,
      lon: this.props.lon
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e){
    this.props.updateEmployerProfile({
      locationString: this.state.locationString,
      lat: this.state.lat,
      lon: this.state.lon
    });
  }

  handleSelectLocation(place) {
    this.setState({
      locationString: place.formatted_address,
      lat: place.geometry.location.lat(),
      lon: place.geometry.location.lng()
    });
  }

  handleChange() {

  }

  render() {
    if (!this.props || this.props.locationString == undefined) {
      return null;
    }

    return (
      <div id="custom-width-modal-edit-companyLocation" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true" style={{display: 'none'}}>
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
                  value={this.props.locationString}
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

EditCompanyLocationModal.propTypes = {
  updateUserProfile: PropTypes.func
};

export default EditCompanyLocationModal;
