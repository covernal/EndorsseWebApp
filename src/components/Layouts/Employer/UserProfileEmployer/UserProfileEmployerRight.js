import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import EndorssePublicURL from '../../../Widgets/EndorssePublicURL';
import parsley from 'parsleyjs';
import $ from 'jquery';

class UserProfileEmployerRight extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();
    let form = $('form').parsley();
    if((form.length > 1)) {
      form = form[0];
    }
    if(form.validate() == true) {
      this.props.updateEmployerProfile({
        firstName: this.refs.firstName.value,
        lastName: this.refs.lastName.value,
        contactNumber: this.refs.contactNumber.value
      });
    }
  }

  render() {
    if (!this.props || this.props.contactData.firstName == undefined) {
      return null;
    }

    return (
      <div className="col-md-8 col-lg-9">
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <EndorssePublicURL type="employer" profilename={this.props.companyName} />
            <form id="contact-personal-form" className="form-horizontal" data-parsley-validate noValidate onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-group">
                <div className="col-xs-12">
                  <h4 className="m-t-0 header-title"><b>Contact Personal Details</b></h4>
                </div>
              </div>
              <div className="form-group ">
                <div className="col-xs-12">
                  <input className="form-control" type="text" required placeholder="First Name" ref="firstName" defaultValue={this.props.contactData.firstName} />
                </div>
              </div>
              <div className="form-group ">
                <div className="col-xs-12">
                  <input className="form-control" type="text" required placeholder="Last Name" ref="lastName" defaultValue={this.props.contactData.lastName} />
                </div>
              </div>
              <div className="form-group ">
                <div className="col-xs-12">
                  <input className="form-control" type="text" required placeholder="Phone Number" ref="contactNumber" defaultValue={this.props.contactData.contactNumber} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-block waves-effect waves-light">Save</button>
                  </div>
                </div>
              </div>
            </form>
            <div className="clearfix"></div>                                            
          </div>
        </div>        
      </div>
    );
  }
}

export default UserProfileEmployerRight;
