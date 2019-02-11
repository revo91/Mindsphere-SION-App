import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ListIcon from '@material-ui/icons/List';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import LocalizedStrings from 'react-localization';
import LanguageIcon from '@material-ui/icons/Language';

let strings = new LocalizedStrings({
  en:{
    bottomNavigationLabelCircuitBreakers:"Circuit breakers",
    bottomNavigationLabelLogs:"Logs",
    bottomNavigationLabelLanguage:"Language"
  },
  pl: {
    bottomNavigationLabelCircuitBreakers:"Wyłączniki",
    bottomNavigationLabelLogs:"Logi",
    bottomNavigationLabelLanguage:"Język"
  }
})

const styles = theme => ({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: '0px',
    left: '0px',
    backgroundColor: '#f7f7f7',
    boxShadow: '0px -1px 5px 0px rgba(0,0,0,0.25)',
    zIndex: '1200'
  },
  bottomNavButtons: {
    color: theme.palette.primary.main
  }
});

class SimpleBottomNavigation extends React.Component {
  state = {
    value: '',
  };

  componentWillReceiveProps(lang) {
    strings.setLanguage(lang.language);
    this.setState({})
  }

  navigateTo = (menu) => {
    switch(menu) {
      case 'circuit_breakers': 
      this.props.navigate('circuit_breakers');
      break;
      case 'logs':
      this.props.navigate('logs');
      break;
      case 'language_selection':
      this.props.navigate('language_selection');
      break;
      default:
      break;
    }
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
    <BottomNavigation value={value} showLabels className={classes.root}>
      <BottomNavigationAction label={strings.bottomNavigationLabelCircuitBreakers} icon={<ListIcon />}
      className={classes.bottomNavButtons}
      onClick={()=>this.navigateTo('circuit_breakers')} />
      <BottomNavigationAction label={strings.bottomNavigationLabelLogs} icon={<CalendarIcon />}
      className={classes.bottomNavButtons}
      onClick={()=>this.navigateTo('logs')}/>
      <BottomNavigationAction label={strings.bottomNavigationLabelLanguage} icon={<LanguageIcon />}
      className={classes.bottomNavButtons}
      onClick={()=>this.navigateTo('language_selection')}/>
    </BottomNavigation>
    );
  }
}

SimpleBottomNavigation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleBottomNavigation);