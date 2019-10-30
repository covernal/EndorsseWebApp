import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import {Link} from 'react-router';
import parsley from 'parsleyjs';
import $ from 'jquery';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      rememberMe: false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    $('form').parsley();
  }

  handleChange(type, e){
    if(type != 'rememberMe'){
      this.setState({
        [type]: e.target.value
      });
    }else{
      this.setState({
        [type]: e.target.checked
      });
    }
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.login({
      data: {
        userName: this.state.username,
        password: this.state.password,
        rememberMe: this.state.rememberMe
      },
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
      <form className="form-horizontal mentor-login-form" data-parsley-validate noValidate onSubmit={this.handleSubmit.bind(this)}>
        <div className="form-group ">
          <div className="col-xs-12">
            <input className="form-control" type="text" required placeholder="Username" value={this.state.username} onChange={this.handleChange.bind(this, 'username')} />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <input className="form-control" type="password" required placeholder="Password" value={this.state.password} onChange={this.handleChange.bind(this, 'password')} />
          </div>
        </div>

        <div className="form-group ">
          <div className="col-xs-12">
            <div className="checkbox checkbox-primary">
              <input id="checkbox-signup" type="checkbox" onChange={this.handleChange.bind(this, 'rememberMe')} />
              <label>Remember me</label>
            </div>
          </div>
        </div>

        {serverErrorBlock}

        <div className="form-group text-center m-t-30">
          <div className="col-xs-12">
            <button className="btn btn-block btn-primary waves-effect waves-light" type="submit">Sign In</button>
          </div>
        </div>

        <div className="form-group text-center m-t-0">
          <div className="col-sm-12">
            <Link to="/reset-password" className="text-muted"><i className="fa fa-lock m-r-5"></i> Forgot your password?</Link>
          </div>
        </div>
      </form>
    );
  }
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
};

export default LoginForm;
