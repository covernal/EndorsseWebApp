import React,{PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory, Link} from 'react-router';
import Cookie from 'react-cookie';
import Find from 'lodash/find';
import SweetAlert from 'sweetalert-react';

import DashboardHeader from '../../components/Layouts/Common/DashboardHeader';
import DashboardSubHeader from '../../components/Layouts/Common/DashboardSubHeader';
import DashboardFooter from '../../components/Layouts/Common/DashboardFooter';
import EmployerPublicProfileLeft from '../../components/Layouts/Employer/EmployerPublicProfile/EmployerPublicProfileLeft';
import EmployerPublicProfileRight from '../../components/Layouts/Employer/EmployerPublicProfile/EmployerPublicProfileRight';
import EndorsseOverlay from '../../components/Widgets/EndorsseOverlay';
import MenuConstants from '../../constants/MenuConstants';

import {EmployerUserActions} from '../../actions';

class EmployerPublicProfilePage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      sendingRequest: false,
      isInitTable: false,
      serverError: this.props.serverError,
      loadedAllJobs: false,
      user: {},
      jobs: []
    };

    this.loadAllJobs = this.loadAllJobs.bind(this);
    this.pushJob = this.pushJob.bind(this);
  }

  componentDidMount(){
    this.setState({
      sendingRequest: true
    }, () => {    
      this.props.getPublicUserProfile({
        username: this.props.params.username,
        cb: () => {
          if(this.props.serverError == null) {
            let userData = this.props.employerDetails.user.attributes;
            this.setState({
              user: {
                avatar: userData.profileImageURL,
                name: userData.companyName,
                location: userData.locationString,
                description: userData.summary,
                link: userData.companyURL
              }
            });

            if(this.props.employerDetails.jobs.length > 0){
              let back_jobs = [];
              this.props.employerDetails.jobs.forEach((job, idx) => {
                this.pushJob(userData, job);

                let row = JSON.stringify(job.attributes);
                row = JSON.parse(row);             
                row['objectId'] = job.id;

                back_jobs.push(row);
              });
              localStorage.setItem('jobs', JSON.stringify(back_jobs));
            }
          }
          this.setState({
            serverError: this.props.serverError,
            sendingRequest: false
          });          
        }
      });   
    });
  }

  pushJob(userData, job) {
    this.state.jobs.push({
      id: job.id,                  
      attributes: {
        title: job.attributes.title,
        employerName: userData.companyName,
        locationString: job.attributes.locationString,
        keyPoints: job.attributes.keyPoints
      }
    });
  }

  loadAllJobs() {
    if(Cookie.load('username') == undefined || Cookie.load('username') == null) {
      //redirect to login page
      this.context.router.push('/login');
      return;
    }

    this.context.router.push('/all-jobs/' + this.props.params.username);
  }


  render() {
    if (!this.props) {
      return null;
    }else{
      const userProfile = this.props.publicUserProfile;
      let overlayClass = (this.state.sendingRequest) ? 'endorsse-overlay show' : 'endorsse-overlay';
      
      return (
        <div className="page-wrapper mentor-tasks-page">
          <header id="topnav">
            <DashboardHeader isPublic={true} />
            {
              (Cookie.load('username') == undefined) ? (<DashboardSubHeader menuList={MenuConstants.common} />) : (<DashboardSubHeader />)
            }
          </header>

          <div className="wrapper">
            <div className="container">

              <div className="row">
                <div className="col-sm-12">
                  <div className="page-title-box">
                    <h4 className="page-title">User Profile</h4>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <div className="card-box">
                    <div className="row">
                      <EmployerPublicProfileLeft user={this.state.user} />
                      <EmployerPublicProfileRight 
                        jobs={this.state.jobs} 
                        employer={this.state.user} 
                        isInitTable={this.state.isInitTable} 
                        loadAllJobs={this.loadAllJobs} />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <EndorsseOverlay
            overlayClass={overlayClass}
            message="Please wait..."
          />

          <SweetAlert
            show={this.state.serverError != null}
            type="error"
            title="Oops..."
            text={(this.state.serverError != null) ? this.state.serverError.message : ''}
            onConfirm={()=>this.setState({serverError: null})}
          />

          <DashboardFooter />
        </div>
      );
    }
  }
}

EmployerPublicProfilePage.propTypes = {
  serverError: PropTypes.object
};

EmployerPublicProfilePage.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    employerDetails: state.EmployerUserReducer.employerDetails,
    serverError: state.EmployerUserReducer.error   
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPublicUserProfile: (req) => {
      dispatch(EmployerUserActions.getPublicUserProfile(req.username, req.cb));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployerPublicProfilePage);