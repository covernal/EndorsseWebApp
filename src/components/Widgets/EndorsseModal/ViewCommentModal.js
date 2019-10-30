import React, {Component, PropTypes} from 'react';

class ViewCommentModal extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    return (
      <div id={`custom-with-modal-view-comment${this.props.id}`} className="custom-with-modal-view-comment modal fade" tabIndex="-1" role="dialog" aria-labelledby="custom-width-modalLabel" aria-hidden="true" style={{display: 'none'}}>
        <div className="modal-dialog" style={{width: '55%'}}>
          <div className="modal-content">
              <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 className="modal-title" id="custom-width-modalLabel">{this.props.title}</h4>
              </div>
              <div className="modal-body">
                  <div className="row">
                      <div className="col-md-12">
                          <div className="form-group no-margin">
                            <p className="with-paragraphs">{this.props.comment}</p>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="modal-footer">
                  <button type="button" className="btn btn-default waves-effect" data-dismiss="modal">OK</button>
              </div>
          </div>          
        </div>
      </div>
    );
  }
}

ViewCommentModal.propTypes = {
  title: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired
};

export default ViewCommentModal;
