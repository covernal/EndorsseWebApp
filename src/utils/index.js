import Cookie from 'react-cookie';
import moment from 'moment';

let Utils = {
  AuthHelper: {
    isLoggedIn: () => {
      return Cookie.load('session');
    },

    roleCheck: (role) => {
      return Cookie.load('type') == role;
    },

    logout: () => {
      Object.keys(Cookie.select()).forEach(name => {
        Cookie.remove(name, {path: '/'});
      });
    }
  },

  DateTimeHelper: {
    getYear: (datetime) => {
      if(datetime != 'Present'){
        return moment(datetime).format('YYYY');
      }else{
        return datetime;
      }
    },

    yearToISOString: (year) => {
      if(year != 'Present'){
        return moment().year(year).toISOString();
      }else{
        return year;
      }
    }
  }
};

export default Utils;
