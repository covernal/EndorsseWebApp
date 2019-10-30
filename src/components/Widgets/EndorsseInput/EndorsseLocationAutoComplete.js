import React, {Component, PropTypes} from 'react';

class EndorsseLocationAutoComplete extends Component {
  constructor(props) {
    super(props);
    this.autocomplete = null;
  }

  componentDidMount() {
    let google = window.google;
    this.autocomplete = new google.maps.places.Autocomplete(this.refs.location, {
      type: ['geocode']
    });

    this.autocomplete.addListener('place_changed', this.onSelected.bind(this));
  }

  onSelected() {
    if (this.props.onPlaceSelected) {
      this.props.onPlaceSelected(this.autocomplete.getPlace());
    }
  }

  render() {
    let label = (this.props.modal != undefined) ? <label htmlFor="field-location" className="control-label">{this.props.label}</label> : '';
    return (
      <div className={this.props.className}>
        {label}
        <input 
          id="field-location"
          className="form-control" 
          type="text"
          ref="location"
          defaultValue={this.props.value}
          required
          placeholder={this.props.placeholder}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

EndorsseLocationAutoComplete.propTypes = {
  onPlaceSelected: PropTypes.func,
  onChange: PropTypes.func
};

export default EndorsseLocationAutoComplete;