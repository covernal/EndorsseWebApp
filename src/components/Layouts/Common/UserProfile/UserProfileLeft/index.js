if (process.env.BROWSER) {
  require('./_userProfileLet.less');
}
import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Parse from 'parse';
import cookie from 'react-cookie';
import EndorsseOverlay from '../../../../Widgets/EndorsseOverlay';
import {EditNameModal, EditLocationModal, EditSummaryModal, EditLinkedInModal} from '../../../../Widgets/EndorsseModal';

let ImageUploader = null;
let _this = null;
class UserProfileLeft extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedImageURL: null,
      sendingRequest: false
    };

    this.uploadImage = this.uploadImage.bind(this);
    this.rednerImageUploader = this.rednerImageUploader.bind(this);
  }

  componentWillMount() {
    ImageUploader = require('react-image-uploader');     
  }

  uploadImage(file, done, progress) {
    let error = null;    
    let _this = this;
    _this.setState({
      sendingRequest: true
    }, () => {
      let profileImageFile = new Parse.File('profile_image.png', file);
      profileImageFile.save().then((res) => {
        _this.setState({
          sendingRequest: false,
          serverError: this.props.serverError          
        });

        _this.props.updateUserProfile({
          profileImageURL: res._url
        }, function(){
          cookie.save('profileImageURL', res._url, {
            path: '/',
            maxAge: 60*60*24*365
          }); 
        });
      }, (error) => {
        _this.setState({
          sendingRequest: false,
          serverError: error
        });
      });      
    });
  }

  rednerImageUploader(props, state) {
    if (props.image) {
      return null;
    }

    let image = "/assets/images/defaultAvatar.jpg";
    if(this.props.userDetails !== undefined) {
      if(this.props.userDetails.user.attributes.profileImageURL !== undefined) {
        image = this.props.userDetails.user.attributes.profileImageURL;
      }
    } 

    return (
      <div className="thumb-xl member-thumb m-b-10 center-block">
        <img src={image} className="img-circle img-thumbnail" alt="profile-image" onClick={props.onUploadPrompt} />
      </div>      
    );
  }

  render() {    
    if (!this.props || this.props.userDetails == undefined || this.props.userDetails.user == undefined) {
      return (
        <div className="col-lg-3 col-md-4 user-profile-left">
          <div className="text-center card-box">
            <div className="member-card">
              <i className="fa fa-spinner fa-spin-custom" aria-hidden="true"></i>

              <hr/>

              <ul className="social-links list-inline m-t-30">
                <li>
                  <Link data-placement="top" data-toggle="tooltip" className="tooltips" href="" data-original-title="LinkedIn"><i className="fa fa-linkedin"></i></Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    let buttonClass = this.props.isPublic ? 'btn btn-xs btn-default waves-effect waves-light hidden' : 'btn btn-xs btn-default waves-effect waves-light';
    let overlayClass = (this.state.sendingRequest) ? 'endorsse-overlay show' : 'endorsse-overlay';   

    let image = "/assets/images/defaultAvatar.jpg";
    if(this.props.userDetails.user.attributes.profileImageURL !== undefined) {
      image = this.props.userDetails.user.attributes.profileImageURL;
    }

    let linkURL = '';
    if(this.props.userDetails.user.attributes.linkedInURL) {
      linkURL = this.props.userDetails.user.attributes.linkedInURL;
      if(!/^((http|https|ftp):\/\/)/.test(linkURL)) {
        linkURL = "http://" + linkURL;
      }   
    }

    return (
      <div className="col-lg-3 col-md-4 user-profile-left">
        <EndorsseOverlay
          overlayClass={overlayClass}
          message="Uploading your profile image now, please wait..."
        />      
        <div className="text-center card-box">
          <div className="member-card"> 
            {
              (this.props.isPublic) ?
              <div className="thumb-xl member-thumb m-b-10 center-block">
                <img src={image} className="img-circle img-thumbnail" alt="profile-image"/>
              </div> : 
              <ImageUploader onUpload={this.uploadImage} onRender={this.rednerImageUploader} image={image} />
            }
            <div className="">
              <EditNameModal
                userDetails={this.props.userDetails.user.attributes}
                updateUserProfile={this.props.updateUserProfile}
              />

              <h4 className="m-b-5">{this.props.userDetails.user.attributes.firstName + ' ' + this.props.userDetails.user.attributes.lastName}</h4>
              <button className={buttonClass} type="submit" data-toggle="modal" data-target="#custom-width-modal-edit-name"><i className="mdi mdi-pencil"></i> Edit Name</button>
            </div>

            <div className="">
              <EditLocationModal
                userDetails={this.props.userDetails.user.attributes}
                updateUserProfile={this.props.updateUserProfile}
              />

              {
                (this.props.userDetails.user.attributes.locationString) ? 
                  <p className="text-muted font-13 m-t-20">
                      <i className="fa fa-map-marker"></i> {this.props.userDetails.user.attributes.locationString}
                  </p> :
                  <p></p>
              }
              <button className={buttonClass} type="submit" data-toggle="modal" data-target="#custom-width-modal-edit-location"><i className="mdi mdi-pencil"></i> Edit Location</button>
            </div>              

            <EditSummaryModal
              userDetails={this.props.userDetails.user.attributes}
              updateUserProfile={this.props.updateUserProfile}
            />
            <p className="text-muted font-13 m-t-20">
              {this.props.userDetails.user.attributes.summary}
            </p>
            <button className={buttonClass} type="submit" data-toggle="modal" data-target="#custom-width-modal-edit-summary"><i className="mdi mdi-pencil"></i> Edit Summary</button>
            
            {
              (this.props.isPublic && (this.props.userDetails.user.attributes.type == "mentor") && (cookie.load('username') != undefined)) ?
              <div>
                <br/>
                <Link to={`/mentor-tasks/${this.props.userDetails.user.attributes.username}`} className="btn btn-primary waves-effect w-md waves-light">Browse Tasks</Link>
              </div>
              :
              <div></div>
            }
            <hr/>

            <EditLinkedInModal
              userDetails={this.props.userDetails.user.attributes}
              updateUserProfile={this.props.updateUserProfile}
            />
            <ul className="social-links list-inline m-t-30">
              <li>
                {
                  (!this.props.isPublic || linkURL) ?
                  <Link data-placement="top" data-toggle="tooltip" className="tooltips" target="_blank" href={linkURL} data-original-title="LinkedIn"><i className="fa fa-linkedin"></i></Link> : ''
                }             
                <button className={buttonClass} type="submit" data-toggle="modal" data-target="#custom-width-modal-edit-linkedinURL"><i className="mdi mdi-pencil"></i> Edit LinkedIn URL</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

UserProfileLeft.propTypes = {
  updateUserProfile: PropTypes.func,
  userDetails: PropTypes.object,
  isPublic: PropTypes.bool.isRequired
};

export default UserProfileLeft;
