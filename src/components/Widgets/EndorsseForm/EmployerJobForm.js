import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import parsley from 'parsleyjs';
import $ from 'jquery';
import EndorsseLocationAutoComplete from '../EndorsseInput/EndorsseLocationAutoComplete';

const JobTypes = [
  'Full Time', 
  'Part Time', 
  'Contract', 
  'Casual', 
  'Internship'
];

class EmployerJobForm extends Component {
  constructor(props, context) {
    super(props);

    this.state = {
      jobData: {
        title: '',
        type: JobTypes[0],
        lat: '',
        lon: '',
        locationString: '',
        keywords: '',
        keyPoints: '',
        aboutUs: '',
        aboutYou: '',
        aboutRole: '',
        howToApply: '',
        extraRequirements: ''
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    if(this.props.currentJob != undefined){
      if(!this.props.currentJob.type) {
        this.props.currentJob.type = JobTypes[0];
      }      
      this.setState({
        jobData: this.props.currentJob
      });
    }
  }

  componentDidMount() {
    $('form').parsley();
  }

  handleSelectLocation(place) {
    let data = this.state.jobData;
    data.locationString = place.formatted_address;
    data.lat = place.geometry.location.lat();
    data.lon = place.geometry.location.lng();
    this.setState({
      jobData: data
    });    
  }

  handleChange(type, e){
    let data = this.state.jobData;
    data[type] = e.target.value;
    this.setState({
      jobData: data
    });
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.processJob({
      data: this.state.jobData,
      form: $('form').parsley()
    });
  }

  render() {
    if (!this.props) {
      return null;
    }

    let jobs = [];
    JobTypes.forEach((type, i) => {
      jobs.push(
        <option key={'type_' + i} value={type}>{type}</option>
      );
    });

    return (
      <form role="form" className="job-form" data-parsley-validate noValidate onSubmit={this.handleSubmit.bind(this)}>
          <div className="row">
              <div className="col-md-12">
                  <div className="p-20">
                      <div className="form-group m-b-20">
                          <label htmlFor="propertyname">Job Title (max 150 characters)</label>
                          <input type="text" className="form-control" id="propertyname" placeholder="e.g. Senior iOS Developer" value={this.state.jobData.title} required onChange={this.handleChange.bind(this, 'title')} />
                      </div>
                      <div className="form-group m-b-20">
                          <label htmlFor="property-type">Type</label>
                          <select className="form-control" id="property-type" value={this.state.jobData.type} onChange={this.handleChange.bind(this, 'type')}>
                            {jobs}
                          </select>
                      </div>

                      <div className="form-group">
                        <EndorsseLocationAutoComplete
                          className="form-group m-b-20"
                          placeholder="e.g. Melbourne, New York"
                          value={this.state.jobData.locationString}
                          onPlaceSelected={(place) => this.handleSelectLocation(place)}
                          onChange={this.handleChange.bind(this, 'locationString')}
                          modal
                          label="Location"     
                        />                      
                      </div>

                      <div className="form-group m-b-20">
                          <label htmlFor="property-keywords">Keywords (max 150 characters, seperated by comma)</label>
                          <input type="text" className="form-control" id="property-keywords" placeholder="Keywords for search" value={this.state.jobData.keywords} required onChange={this.handleChange.bind(this, 'keywords')} />
                      </div>
                      <div className="form-group m-b-20">
                          <label htmlFor="property-keypoints">Key Points</label>
                          <textarea className="form-control" id="property-keypoints" rows="3" placeholder="Key selling points to attract candidates." value={this.state.jobData.keyPoints} required onChange={this.handleChange.bind(this, 'keyPoints')}></textarea>
                      </div>
                      <div className="form-group m-b-20">
                          <label htmlFor="property-aboutus">About Us</label>
                          <textarea className="form-control" id="property-aboutus" rows="5" placeholder="Tell about your company." value={this.state.jobData.aboutUs} required onChange={this.handleChange.bind(this, 'aboutUs')}></textarea>
                      </div>
                      <div className="form-group m-b-20">
                          <label htmlFor="property-aboutrole">About the Role</label>
                          <textarea className="form-control" id="property-aboutrole" rows="5" placeholder="Everything about the role." value={this.state.jobData.aboutRole} required onChange={this.handleChange.bind(this, 'aboutRole')}></textarea>
                      </div>
                      <div className="form-group m-b-20">
                          <label htmlFor="property-aboutyou">About You</label>
                          <textarea className="form-control" id="property-aboutyou" rows="5" placeholder="Tell what's your expectation about the candidate." value={this.state.jobData.aboutYou} required onChange={this.handleChange.bind(this, 'aboutYou')}></textarea>
                      </div>
                      <div className="form-group m-b-20">
                          <label htmlFor="property-howtoapply">How to Apply</label>
                          <textarea className="form-control" id="property-howtoapply" rows="3" placeholder="How to apply to your role." value={this.state.jobData.howToApply} required onChange={this.handleChange.bind(this, 'howToApply')}></textarea>
                      </div>
                      <div className="form-group m-b-20">
                          <label htmlFor="property-addreq">Additional Requirements (optional)</label>
                          <textarea className="form-control" id="property-addreq" rows="5" placeholder="Any additional requirements?" value={this.state.jobData.extraRequirements} onChange={this.handleChange.bind(this, 'extraRequirements')}></textarea>
                      </div>
                  </div>
              </div>
          </div> 

          <div className="row">
              <div className="col-md-4">
              </div>
              <div className="col-md-4">
                  <div className="text-center">
                      <button type="submit" className="btn btn-primary btn-block waves-effect waves-light">Save & Publish</button>
                  </div>
              </div>
          </div>
      </form>

    );
  }
}

EmployerJobForm.propTypes = {
  processJob: PropTypes.func.isRequired
};

export default EmployerJobForm;
