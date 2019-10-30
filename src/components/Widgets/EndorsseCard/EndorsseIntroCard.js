import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class EndorsseIntroCard extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    let header = '';
    let image = (this.props.image !== undefined) ? this.props.image : "/assets/images/defaultAvatar.jpg";

    if (this.props.title != undefined) {
      header = (
        <div className="text-left">
          <h4 className="header-title m-t-0 m-b-20">{this.props.title}</h4>
        </div>             
      );
    }

    let linkURL = this.props.link;
    if(linkURL) {
      if(!/^((http|https|ftp):\/\/)/.test(linkURL)) {
        linkURL = "http://" + linkURL;
      }    
    }

    return (
      <div className="text-center card-box">
        {header}
        <div className="member-card">
          <div className="thumb-xl member-thumb m-b-10 center-block">
            {
              (this.props.username != undefined) ?
              <Link to={`/profile/${this.props.username}`}><img src={image} className="img-circle img-thumbnail" alt="profile-image"/></Link>
              :
              <img src={image} className="img-circle img-thumbnail" alt="profile-image"/>
            }
            
          </div>
          <div className="">            
            {
              (this.props.username != undefined) ?
              <Link to={`/profile/${this.props.username}`}><h4 className="m-b-5">{this.props.name}</h4></Link>
              :
              <h4 className="m-b-5">{this.props.name}</h4>
            }
            {(this.props.location != undefined) ? <p className="text-muted font-13 m-t-20"><i className="fa fa-map-marker"></i> {this.props.location}</p> : ''}
          </div>
          <p className="text-muted font-13 m-t-20">
            {(this.props.description !== undefined && this.props.description.length > 150) ? this.props.description.substr(0, 150) + "..." : this.props.description}
          </p>
          {
            (linkURL) ? 
            <div>
              <hr/>
              <ul className="social-links list-inline m-t-30">
                <li>
                  <Link to={linkURL} target="_blank">
                    {
                      (this.props.isEmployer != undefined && this.props.isEmployer==true) ? <i className="fa fa-link"></i> : <i className="fa fa-linkedin"></i>
                    }               
                  </Link>
                </li>
              </ul>
            </div> : ''
          }
        </div>
      </div>
    );
  }
}

export default EndorsseIntroCard;
