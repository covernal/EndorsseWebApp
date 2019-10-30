import React, {Component, PropTypes} from 'react';
import parsley from 'parsleyjs';
import $ from 'jquery';
import EndorsseOverlay from '../EndorsseOverlay';
import ServerConfig from '../../../../cfg/NodeJS';

let Stripe = window.Stripe;
class StripePayModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverError: null,
      sendingRequest: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    $('form').parsley();    
    let publisableKey = (process.env.REACT_WEBPACK_ENV != 'local') ? process.env.STRIPE_PUBLIC_KEY : ServerConfig.stripe[process.env.REACT_WEBPACK_ENV].STRIPE_PUBLIC_KEY;
    Stripe.setPublishableKey(publisableKey);
  }

  handleSubmit(e){
    e.preventDefault();
    let validation = $('.modal.fade.in .payment-form').parsley().validate();
    if(validation == true) {
      //success
      this.setState({
        sendingRequest: true,
        serverError: null
      });
      let _this = this;  
      Stripe.card.createToken(e.currentTarget, function (status, response) {
        _this.setState({
          serverError: response.error,
          sendingRequest: false
        });

        if(response.error == null) {
          let challengeId = _this.props.challengeData.id;
          let vouchers = JSON.parse(localStorage.getItem("selectedVouchers"));    
          let cardToken = response.id;
          $(".custom-with-modal-strip-pay").modal('hide');
          _this.props.handlePayment(challengeId, vouchers, cardToken);
        }
      });      
    }
  }

  render() {
    if (!this.props) {
      return null;
    }

    let overlayClass = (this.state.sendingRequest) ? 'endorsse-overlay show' : 'endorsse-overlay';
    return (
      <div  id={`custom-with-modal-stripe${this.props.challengeData.id}`} className="custom-with-modal-strip-pay modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true" style={{display: 'none', zIndex: 1051}}>
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <EndorsseOverlay
              overlayClass={overlayClass}
              message="Please wait..."
            />          
            <form className="form-horizontal payment-form" data-parsley-validate noValidate onSubmit={this.handleSubmit.bind(this)}>              
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 className="modal-title" id="custom-width-modalLabel">Checkout with Stripe</h4>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group1">
                      <label htmlFor="field-cardnumber" className="control-label">Card Number</label>
                      <input type="text" className="form-control" id="field-cardnumber" required data-parsley-required-message="" data-stripe="number"/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-7">
                    <div className="form-group1">
                      <label htmlFor="field-mm" className="control-label">Expiration (MM/YY)</label>
                      <div className="row">
                        <div className="col-md-5">
                          <input type="text" className="form-control" id="field-mm" required data-parsley-required-message="" data-stripe="exp_month"/>
                        </div>
                        <div className="col-md-1" style={{marginTop: '9px'}}>/</div>
                        <div className="col-md-5">
                          <input type="text" className="form-control col-md-6" id="field-yy" required data-parsley-required-message="" data-stripe="exp_year"/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="form-group1">
                      <label htmlFor="field-cvc" className="control-label">CVC</label>
                      <input type="text" className="form-control" id="field-mm" required data-parsley-required-message="" data-stripe="cvc"/>
                    </div>
                  </div>
                </div>
                {
                  (this.state.serverError != null) ?
                  <div className="row">
                    <div className="col-md-12">
                      <h6 className="server-error">{this.state.serverError.message}</h6>
                    </div>
                  </div> : ''
                }
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default waves-effect" data-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary waves-effect waves-light">Submit</button>
              </div>
            </form>
          </div>          
        </div>
      </div>
    );
  }
}

export default StripePayModal;
