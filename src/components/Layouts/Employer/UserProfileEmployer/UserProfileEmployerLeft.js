import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Parse from 'parse';
import cookie from 'react-cookie';
import EndorsseOverlay from '../../../Widgets/EndorsseOverlay';
import {EditCompanyNameModal, EditCompanyLocationModal, EditCompanySummaryModal, EditCompanyURLModal} from '../../../Widgets/EndorsseModal';

let ImageUploader = null;
let _this = null;
class UserProfileEmployerLeft extends Component {
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
        _this.props.updateEmployerProfile({
          profileImageURL: res._url
        }, function(){
          _this.props.profileData.profileImageURL = res._url;
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
    if(this.props.profileData !== undefined) {
      if(this.props.profileData.profileImageURL !== undefined) {
        image = this.props.profileData.profileImageURL;
      }
    }

    return (
      <div className="thumb-xl member-thumb m-b-10 center-block">
        <img src={image} className="img-circle img-thumbnail" alt="profile-image" onClick={props.onUploadPrompt} />
      </div>      
    );
  }

  render() {
    if (!this.props || this.props.profileData == undefined) {
      return (
        <div className="col-lg-3 col-md-4 user-profile-left">
          <div className="text-center card-box">
            <div className="member-card">
              <i className="fa fa-spinner fa-spin-custom" aria-hidden="true"></i>
              <hr/>
              <ul className="social-links list-inline m-t-30">
                <li>
                  <Link data-placement="top" data-toggle="tooltip" className="tooltips" href="" data-original-title="Company Website"><i className="fa fa-link"></i></Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    let profile = this.props.profileData;
    let buttonClass = this.props.isPublic ? 'btn btn-xs btn-default waves-effect waves-light hidden' : 'btn btn-xs btn-default waves-effect waves-light';
    let overlayClass = (this.state.sendingRequest) ? 'endorsse-overlay show' : 'endorsse-overlay';   
    let image = "/assets/images/defaultAvatar.jpg";
    if(profile.profileImageURL !== undefined) {
      image = profile.profileImageURL;
    }

    let linkURL = '';
    if(this.props.profileData.companyURL) {
      linkURL = this.props.profileData.companyURL;
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
            <ImageUploader onUpload={this.uploadImage} onRender={this.rednerImageUploader} image={image} />

            <div className="">
              <EditCompanyNameModal
                companyName={this.props.profileData.companyName}
                updateEmployerProfile={this.props.updateEmployerProfile}
              />

              <h4 className="m-b-5">{this.props.profileData.companyName}</h4>
              <button className="btn btn-xs btn-default waves-effect waves-light" type="submit" data-toggle="modal" data-target="#custom-width-modal-edit-companyName"><i className="mdi mdi-pencil"></i> Edit Company Name</button>
            </div>


            <EditCompanyLocationModal
              locationString={this.props.profileData.locationString}
              lat={this.props.profileData.lat}
              lon={this.props.profileData.lon}
              updateEmployerProfile={this.props.updateEmployerProfile}
            />
            {
              (this.props.profileData.locationString) ? 
                <p className="text-muted font-13 m-t-20">
                    <i className="fa fa-map-marker"></i> {this.props.profileData.locationString}
                </p> :
                <p></p>
            }
            <button className="btn btn-xs btn-default waves-effect waves-light" type="submit" data-toggle="modal" data-target="#custom-width-modal-edit-companyLocation"><i className="mdi mdi-pencil"></i> Edit Location</button>

            <EditCompanySummaryModal
              summary={this.props.profileData.summary}
              updateEmployerProfile={this.props.updateEmployerProfile}
            />
            <p className="text-muted font-13 m-t-20">
              {this.props.profileData.summary}
            </p>
            <button className="btn btn-xs btn-default waves-effect waves-light" type="submit" data-toggle="modal" data-target="#custom-width-modal-edit-companySummary"><i className="mdi mdi-pencil"></i> Edit Summary</button>

            <hr/>

            <EditCompanyURLModal
              companyURL={this.props.profileData.companyURL}
              updateEmployerProfile={this.props.updateEmployerProfile}
            />
            <ul className="social-links list-inline m-t-30">
              <li>
                <Link to={linkURL} data-placement="top" data-toggle="tooltip" className="tooltips" target="_blank" data-original-title="Company Website"><i className="fa fa-link"></i></Link>
                <button className="btn btn-xs btn-default waves-effect waves-light" type="submit" data-toggle="modal" data-target="#custom-width-modal-edit-companyURL"><i className="mdi mdi-pencil"></i> Edit Company URL</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

UserProfileEmployerLeft.propTypes = {
  updateEmployerProfile: PropTypes.func,
  profileData: PropTypes.object
};

export default UserProfileEmployerLeft;
