import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import {Link} from 'react-router';
import EndorsseLocationAutoComplete from '../EndorsseInput/EndorsseLocationAutoComplete';
import parsley from 'parsleyjs';
import $ from 'jquery';

class EmployerSignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employerData: {
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        companyName: '',
        companyURL: '',
        contactNumber: '',
        locationString: '',
        lat: '',
        lon: '',
        summary: ''
      }
    };
  }

  componentDidMount() {
    $('form').parsley();
  }

  handleSelectLocation(place) {
    let data = this.state.employerData;
    data.locationString = place.formatted_address;
    data.lat = place.geometry.location.lat();
    data.lon = place.geometry.location.lng();

    this.setState({
      employerData: data
    });
  }

  handleChange(type, e, value){
    let data = this.state.employerData;
    data[type] = e.target.value;

    this.setState({
      employerData: data
    });
  }

  handleSubmit(e){
    e.preventDefault();

    this.props.signup({
      data: this.state.employerData,
      form: $('form').parsley()
    });
  }

  render() {
    if (!this.props) {
      return null;
    }

    let serverErrorBlock = (this.props.serverError != undefined) ?
      <h6 className="server-error">{this.props.serverError.message}</h6> : <div></div>;

    return (
      <form className="form-horizontal mentor-signup-form" data-parsley-validate noValidate onSubmit={this.handleSubmit.bind(this)}>
        <div className="form-group">
          <div className="col-xs-12">
            <h4 className="m-t-0 header-title"><b>Employer Registration</b></h4>
            {serverErrorBlock}
          </div>
        </div>

        <div className="form-group ">
          <div className="col-xs-12">
            <input className="form-control" type="text" value={this.state.employerData.firstName} required placeholder="First Name" onChange={this.handleChange.bind(this, 'firstName')} />
          </div>
        </div>

        <div className="form-group ">
          <div className="col-xs-12">
            <input className="form-control" type="text" value={this.state.employerData.lastName} required placeholder="Last Name" onChange={this.handleChange.bind(this, 'lastName')} />
          </div>
        </div>

        <div className="form-group ">
          <div className="col-xs-12">
            <input className="form-control" type="text" value={this.state.employerData.email} required  placeholder="Email" data-parsley-pattern="/^\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i" data-parsley-error-message="Please enter a valid email address in lowercase." onChange={this.handleChange.bind(this, 'email')} />
          </div>
        </div>

        <div className="form-group ">
          <div className="col-xs-12">
            <input className="form-control" type="text" value={this.state.employerData.username} required placeholder="Username" data-parsley-pattern="^[a-z0-9_\-]+$" data-parsley-error-message="Please enter a valid username in lowercase." onChange={this.handleChange.bind(this, 'username')}  />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <input className="form-control" type="password" value={this.state.employerData.password} required placeholder="Password" data-parsley-minlength="8" data-parsley-error-message="Please enter a password with at least 8 characters length." onChange={this.handleChange.bind(this, 'password')}  />
          </div>
        </div>

        <div className="form-group ">
          <div className="col-xs-12">
            <input className="form-control" type="text" value={this.state.employerData.companyName} required placeholder="Company Name" onChange={this.handleChange.bind(this, 'companyName')} />
          </div>
        </div>

        <div className="form-group ">
          <div className="col-xs-12">
            <input className="form-control" type="text" value={this.state.employerData.companyURL} required placeholder="Company Website" onChange={this.handleChange.bind(this, 'companyURL')} />
          </div>
        </div>

        <div className="form-group ">
          <div className="col-xs-12">
            <input className="form-control" type="text" value={this.state.employerData.contactNumber} required placeholder="Phone Number" onChange={this.handleChange.bind(this, 'contactNumber')} />
          </div>
        </div>

        <div className="form-group">
          <EndorsseLocationAutoComplete
            className="col-xs-12"
            placeholder="Location, e.g. Melbourne VIC Australia"
            onPlaceSelected={(place) => this.handleSelectLocation(place)}
          />
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <textarea className="form-control" rows="5" placeholder="Company summary" onChange={this.handleChange.bind(this, 'summary')}>{this.state.summary}</textarea>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <div className="checkbox checkbox-success">
              <input id="checkbox-signup" type="checkbox" required data-parsley-error-message="Please tick the agreement checkbox." />
              <label>I accept <Link to="https://www.endorsse.com/terms.html" target="_blank">Terms and Conditions</Link> and <Link to="http://www.endorsse.com/privacy.html" target="_blank">Privacy Policy</Link></label>
            </div>
          </div>
        </div>

        <div className="form-group text-center m-t-30">
          <div className="col-xs-12">
            <button className="btn btn-block btn-primary waves-effect waves-light">Sign Up</button>
          </div>
        </div>
      </form>
    );
  }
}

EmployerSignupForm.propTypes = {
  signup: PropTypes.func.isRequired,
  serverError: PropTypes.object
};

export default EmployerSignupForm;
