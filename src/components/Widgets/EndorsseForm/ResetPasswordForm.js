import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import parsley from 'parsleyjs';
import $ from 'jquery';

class ResetPasswordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: ''
    };
  }

  componentDidMount() {
    $('form').parsley();
  }

  handleChange(e, value){
    this.setState({
      userEmail: e.target.value
    });
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.resetPassword({
      data: this.state.userEmail,
      form: $('form').parsley()
    });
  }

  render() {
    if (!this.props) {
      return null;
    }

    return (
      <form className="form-horizontal reset-password-form" data-parsley-validate noValidate  onSubmit={this.handleSubmit.bind(this)}>
        <div className="text-center m-b-20">
          <p className="text-muted m-b-0 font-13">Enter your email address and we'll send you an email with instructions to reset your password.  </p>
        </div>
        <div className="form-group">
          <div className="col-xs-12">
            <input
              className="form-control"
              value={this.state.userEmail}
              type="text"
              parsley-type="email"
              required
              placeholder="Enter email"
              data-parsley-pattern="/^\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i"
              data-parsley-error-message="Please enter a valid email address in lowercase."
              onChange={this.handleChange.bind(this)}
            />
          </div>
        </div>

        <div className="form-group account-btn text-center m-t-10 non-fixed-btn">
          <div className="col-xs-12">
            <button className="btn btn-block btn-primary waves-effect waves-light">Send Email</button>
          </div>
        </div>
        {this.props.resetPasswordEmailStatus!=undefined?
          <div className="text-center m-b-20">
            {this.props.resetPasswordEmailStatus?
              <p className="m-b-0 font-13 text-success">Email send successfully!</p>
              :
              <p className="m-b-0 font-13 text-failure">{this.props.errorMessage}</p>
            }
          </div>
          :null
        }
      </form>
    );
  }
}

ResetPasswordForm.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  resetPasswordEmail: PropTypes.bool,
  errorMessage: PropTypes.string.isRequired
};

export default ResetPasswordForm;
