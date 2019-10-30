import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

class EndorsseRating extends Component {
  render() {
    if (!this.props) {
      return null;
    }

    if(this.props.value == null) {
      return (<span>-</span>);
    }

    let rate = [];
    for(let i=0; i<5; i++) {
      rate = _.concat(rate, (i<this.props.value) ? true : false);
    }

    return (
      <Link data-toggle="modal" data-target={(this.props.target != undefined) ? this.props.target : ''}>
      {
        _.map(rate, (v, i) => {
          if(v){
            return (
              <span key={`star_${i}`}><i className="fa fa-star text-warning"></i> </span>
            );
          }else{
            return (
              <span key={`star_${i}`}><i id={`star_${i}`} className="fa fa-star"></i> </span>
            );
          }
        })     
      }
      </Link>
    );
  }
}

export default EndorsseRating;