import React from 'react';
import PropTypes from 'prop-types';
import {
  withStyles
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SelectionIcon from '@material-ui/icons/KeyboardArrowRight';
import axios from 'axios';
import {
  withSnackbar
} from 'notistack';
import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
  en: {
    errorNotification400: "Bad request. Check time range corectness.",
    errorNotification403: "Session expired. Reload page.",
    errorNotification404: "Connection error. Check your internet connection and reload the app.",
  },
  pl: {
    errorNotification400: "Nieprawidłowe zapytanie. Sprawdź poprawność przedziału czasu.",
    errorNotification403: "Sesja wygasła. Odśwież stronę.",
    errorNotification404: "Błąd połączenia. Sprawdź czy masz połączenie z internetem i odśwież stronę.",
  }
})

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};

class SwipeableTemporaryDrawer extends React.Component {
    state = {
      assets: ''
    }

    componentWillReceiveProps(lang) {
      strings.setLanguage(lang.language);
      this.setState({})
    }

    handleSnackbar = (type, message) => {
      this.props.enqueueSnackbar(message, {
        variant: type,
      });
    }

    toggleDrawer = (side, open) => () => {
      this.props.open(open);
      // this.setState({
      //   [side]: open,
      // });
    };

    componentDidMount() {
      this.renderAssets();
    }

    renderAssets = () => {
      let assetsArray = []
      axios({
        url: '/api/assetmanagement/v3/assets?size=50',
        method: 'GET',
        withCredentials: true,
        xsrfCookieName: 'XSRF-TOKEN'
      }).then(res => {
        let assets = res.data._embedded.assets;
        assets.map(x => {
          if (x.typeId === 'inucleus.SION_DATA_ASPECT_V2_2') {
            assetsArray.push(x)
          }
        })
        this.setState({
          assets: assetsArray
        })
      })
    }

    loadAspects = (holderAssetId, assetName) => {
      axios({
        url: `/api/assetmanagement/v3/assets/${holderAssetId}/aspects`,
        method: 'GET',
        withCredentials: true,
        xsrfCookieName: 'XSRF-TOKEN'
      }).then(res => {
        this.setState({
          aspects: res.data._embedded.aspects
        }, () => {
          this.state.aspects.map(aspect => {
            if (aspect.name !== 'status') {
              this.props.aspects(aspect.name, aspect.holderAssetId, assetName)
            }
          })
        })
      }).catch(err => {
        switch (err.response.status) {
          case 400:
            this.handleSnackbar('error', strings.errorNotification400);
            break;
          case 403:
            this.handleSnackbar('error', strings.errorNotification403);
            break;
          case 404:
            this.handleSnackbar('error', strings.errorNotification404);
            break;
          default:
            break;
        }
        this.setState({
          loader: false
        })
      })
    }

  render() {
    const { classes } = this.props;
    const fullList = (
      <div className={classes.fullList}>
        <List>
          {this.state.assets!==''?
          this.state.assets.map((asset, index) => (
            <ListItem button key={asset.name} onClick={()=>this.loadAspects(asset.assetId, asset.name)}>
              <ListItemIcon><SelectionIcon></SelectionIcon></ListItemIcon>
              <ListItemText primary={asset.name} />
            </ListItem>
          )):
          <ListItem button key="..." disabled={true}>
              <ListItemIcon><SelectionIcon></SelectionIcon></ListItemIcon>
              <ListItemText primary="..." />
            </ListItem>
        }
        </List>
      </div>
    );

  return (
    <div>
      <Drawer
        anchor="bottom"
        open={this.props.open}
        onClose={()=>this.props.handleDrawerChange(false)}
        //onOpen={()=>this.props.handleDrawerChange(true)}
      >
        <div
          tabIndex={0}
          role="button"
          onClick={()=>this.props.handleDrawerChange(false)}
          onKeyDown={()=>this.props.handleDrawerChange(false)}
        >
          {fullList}
        </div>
      </Drawer>
    </div>
    );
  }
}

SwipeableTemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withSnackbar(SwipeableTemporaryDrawer));