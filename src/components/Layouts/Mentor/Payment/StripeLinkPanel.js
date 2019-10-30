import React, {Component, PropTypes} from 'react';


class StripeLinkPanel extends Component {
  constructor(props,context) {
    super(props);
  }

  render() {
    if (!this.props) {
      return null;
    }

    return (
      <div className="row">

        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Stripe</h3>
              <p className="panel-sub-title font-13 text-muted"><a href="http://www.stripe.com">www.stripe.com</a></p>
            </div>
            <div className="panel-body">
              <p>
                Stripe is a leading global payment platform helping many <a href="https://stripe.com/customers" className="text-primary">reputable companies</a>. You are required to create your own Stripe account and link it to our platform so that candidates can pay your tasks. Once it is linked, go to your <b>Stripe Dashboard</b> -> <b>Account Settings</b> -> <b>Connect</b> and you should see our platform in your connected platforms. 
              </p>
              <p>If you have difficulty in connecting your account, please email <a href="mailto:hello@endorsse.com" className="text-primary">hello@endorsse.com</a>.</p>
              {this.props.isStripeLinked ?
              <p className="text-warning">
                Warning: Revoking your access to Endorsse from Stripe dashboard manually may result future payment unsuccessful. Please contact admin for more details.</p> : null }

              <div className="form-group text-center m-t-30">
                <div className="col-xs-12">
                  {this.props.isStripeLinked?
                    <a className="btn btn-block btn-primary waves-effect waves-light disabled" type="submit" >Your Account is connecting with Endorsse</a> :
                    <a className="btn btn-block btn-primary waves-effect waves-light" type="submit" href={this.props.stripeLink}>Link My Account to Endorsse</a>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

StripeLinkPanel.propTypes = {
  isStripeLinked: PropTypes.bool.isRequired,
  stripeLink: PropTypes.string
};

export default StripeLinkPanel;
