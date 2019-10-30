import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class EndorsseBrowseCard extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    let data = this.props.data;
    let profileURL = this.props.profileURL;
    let browseURL = this.props.browseURL;

    let found = profileURL.indexOf('/:');
    if(found > 0) {
      let field = profileURL.substring(found + 2);
      profileURL = profileURL.replace(':'+field, data[field]);
    }

    found = browseURL.indexOf('/:');
    if(found > 0) {
      let field = browseURL.substring(found + 2);
      browseURL = browseURL.replace(':'+field, data[field]);      
    }

    let linkURL = data.link;
    if(linkURL) {
      if(!/^((http|https|ftp):\/\/)/.test(linkURL)) {
        linkURL = "http://" + linkURL;
      }    
    }    
    
    let image = (data.image !== undefined) ? data.image : "/assets/images/defaultAvatar.jpg";
    return (
      <div className="text-center card-box">
        <div className="clearfix"></div>
        <div className="member-card">
          <div className="thumb-xl member-thumb m-b-10 center-block">
            <img src={image} className="img-circle img-thumbnail" alt="profile-image"/>
          </div>
          <div className="">
            <h4 className="m-b-5" style={{height:'19px', overflow:'hidden'}}>
              {(data.name !== undefined && data.name.length > 55) ? data.name.substr(0, 55) + "..." : data.name}
            </h4>
          </div>          
          <ul className="social-links list-inline m-t-10" style={{minHeight:'30px'}}>
            {
              (linkURL) ?
              <li>
                <Link to={linkURL} target="_blank">
                  {
                    (this.props.isEmployer==true) ? <i className="fa fa-link"></i> : <i className="fa fa-linkedin"></i>
                  }                
                </Link>
              </li> : ''
            }
          </ul>          
          <p className="text-muted font-13 m-t-10" style={{height:'40px', overflow:'hidden'}}>
            {(data.description !== undefined && data.description.length > 165) ? data.description.substr(0, 165) + "..." : data.description}
          </p>
          <p className="text-muted font-13 m-t-20"><i className="fa fa-map-marker"></i> {data.locationString}</p>
          <div className="row">
            <Link to={`${profileURL}`} className="btn btn-default btn-rounded btn-sm waves-effect m-t-10 waves-light">{this.props.profileBtnLabel}</Link>
            <span> </span>
            <Link to={`${browseURL}`} className="btn btn-primary btn-rounded btn-sm waves-effect m-t-10 waves-light">{this.props.browseBtnLabel}</Link>
          </div>
        </div>
      </div>

    );
  }
}

export default EndorsseBrowseCard;
