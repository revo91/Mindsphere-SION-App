import React, {
  Component
} from 'react';
import './App.css';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import {
  withStyles
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import MUIDataTable from "mui-datatables";
import {
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import red from '@material-ui/core/colors/red';
import {
  Scatter
} from 'react-chartjs-2';
import Fade from '@material-ui/core/Fade';
import BottomNavigation from './components/BottomNavigation';
import LinearProgress from '@material-ui/core/LinearProgress';
import Drawer from './components/Drawer';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import LocalizedStrings from 'react-localization';
import {
  withSnackbar
} from 'notistack';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tabs from './Tabs';


let strings = new LocalizedStrings({
  en: {
    headerSelectCircuitBreaker: "Select the circuit breaker ↓",
    headerCircuitBreakerSelected: "Data from:",
    fromTime: "From",
    toTime: "To",
    angleAxis: "Angle [deg]",
    timeAxis: "Time [ms]",
    eventHistory: "Event history",
    circuitBreakerClosing: "Closing",
    circuitBreakerOpening: "Opening",
    dataTableLabelBodyNoMatch: "No data",
    dataTableLabelBodySort: "Sort",
    dataTableLabelPaginationNext: "Next page",
    dataTableLabelPaginationPrevious: "Previous page",
    dataTableLabelRowsPerPage: "Rows per page:",
    dataTableLabelDisplayRows: "from",
    dataTableLabelToolbarSearch: "Search",
    dataTableLabelToolbarDownloadCSV: "Download CSV",
    dataTableLabelToolbarPrint: "Print",
    dataTableLabelToolbarViewColumns: "Display columns",
    dataTableLabelToolbarFilterTable: "Filter table",
    dataTableLabelFilterAll: "All",
    dataTableLabelFilterTitle: "Filters",
    dataTableLabelFilterReset: "Reset",
    dataTableLabelViewColumnsTitle: "Display columns",
    dataTableLabelViewColumnsTitleArea: "Hide/unhide columns",
    dataTableLabelSelectedRowsText: "Selected rows",
    dataTableLabelSelectedRowsDelete: "Delete",
    dataTableLabelSelectedRowsDeleteAria: "Delete selected rows",
    dataTableColumnTime: "Timestamp",
    dataTableColumnEvent: "Event",
    dataTableColumnFileNameMS: "Filename (MS)",
    dialogLanguageSelectionTitle: "Select langauge",
    dialogLanguageSelectionDescription: "The application chooses a default language based on your browser's language settings. You can select a language manually if you wish.",
    dialogLanguageSelectionEnglish: "English",
    dialogLanguageSelectionPolish: "Polish",
    errorNotification400: "Bad request. Check time range corectness.",
    errorNotification401: "Session expired (over 30 mins of inactivity). Application will reload in a moment.",
    errorNotification404: "Connection error. Check your internet connection and reload the app.",
  },
  pl: {
    headerSelectCircuitBreaker: "Wybierz wyłącznik ↓",
    headerCircuitBreakerSelected: "Dane z wyłącznika:",
    fromTime: "Od",
    toTime: "Do",
    angleAxis: "Kąt [deg]",
    timeAxis: "Czas [ms]",
    eventHistory: "Historia zdarzeń",
    circuitBreakerClosing: "Załączenie",
    circuitBreakerOpening: "Wyłączenie",
    dataTableLabelBodyNoMatch: "Brak danych",
    dataTableLabelBodySort: "Sortuj",
    dataTableLabelPaginationNext: "Następna strona",
    dataTableLabelPaginationPrevious: "Poprzednia strona",
    dataTableLabelRowsPerPage: "Wierszy na stronę:",
    dataTableLabelDisplayRows: "z",
    dataTableLabelToolbarSearch: "Szukaj",
    dataTableLabelToolbarDownloadCSV: "Pobierz CSV",
    dataTableLabelToolbarPrint: "Drukuj",
    dataTableLabelToolbarViewColumns: "Pokaż kolumny",
    dataTableLabelToolbarFilterTable: "Filtruj tabelę",
    dataTableLabelFilterAll: "Wszystko",
    dataTableLabelFilterTitle: "Filtry",
    dataTableLabelFilterReset: "Reset",
    dataTableLabelViewColumnsTitle: "Pokaż kolumny",
    dataTableLabelViewColumnsTitleArea: "Pokaż/ukryj kolumny",
    dataTableLabelSelectedRowsText: "Wybrane wiersze",
    dataTableLabelSelectedRowsDelete: "Usuń",
    dataTableLabelSelectedRowsDeleteAria: "Usuń wybrane wiersze",
    dataTableColumnTime: "Czas",
    dataTableColumnEvent: "Zdarzenie",
    dataTableColumnFileNameMS: "Nazwa pliku (MS)",
    dialogLanguageSelectionTitle: "Wybierz język",
    dialogLanguageSelectionDescription: "Aplikacja wybiera domyślny język na podstawie ustawień językowych przeglądarki użytkownika. Jeśli chcesz, możesz wybrać ręcznie inny.",
    dialogLanguageSelectionEnglish: "Angielski",
    dialogLanguageSelectionPolish: "Polski",
    errorNotification400: "Nieprawidłowe zapytanie. Sprawdź poprawność przedziału czasu.",
    errorNotification401: "Sesja wygasła (ponad 30 min nieaktywności). Aplikacja za chwilę zostanie przeładowana.",
    errorNotification404: "Błąd połączenia. Sprawdź czy masz połączenie z internetem i odśwież stronę.",
  }
});

const styles = theme => ({
  
  root: {
    flexGrow: 1,
    padding: "12px",
    // marginBottom: "56px",
    // position: "absolute",
    // top: "0px",
    // bottom: "0px",
    // left: "0px",
    // right: "0px",
    // overflowY: "scroll"
  },
  heading: {
    marginTop: "20px",
    marginBottom: "40px",
    textAlign: "center"
  },
  picker: {
    width: "100%"
  },
  paper: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    ...theme.mixins.gutters(),
    marginBottom: "40px"
  },
  linearProgress: {
    padding: 0,
    bottom: "56px",
    position: "fixed",
    width: "100%",
    right: "0px"
  },
  input: {
    display: 'none'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  graphGrid: {
    marginTop:"50px",
    marginBottom:'50px'
  }
})


const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: red,
  },
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MUIDataTable: {
      responsiveScroll: {
        maxHeight: 'none',
      },
    },
  },
});

// const data1 = [[new Date("2019-02-08T13:31:39.341Z").toLocaleString('pl-PL',{ 
//   month: '2-digit', 
//   day: '2-digit', 
//   year: 'numeric',
//   hour: '2-digit',
//   minute: '2-digit',
//   second: '2-digit'
// }),"gggg","dd"],["2019-02-11T21:31:39.341Z","gggs","ggsh"],["2019-02-10T14:30:39.341Z","dfhn","cvn"],
// ["2019-02-11T12:09:39.341Z","gggg","dd"]]


let hourBegin = '00:00';
let dayBegin = '01';
let monthBegin = '01';
let dateNow = moment().format('YYYY-MM-DDTHH:mm')
let dateFrom = moment().format(`YYYY-${monthBegin}-${dayBegin}T${hourBegin}`);

const limit = '2000';

class App extends Component {
  state = {
    fromDate: dateFrom,
    toDate: dateNow,
    show: '',
    logs: '',
    loader: false,
    graphXYstate: '',
    openDrawer: false,
    aspectName: '',
    assetName: '',
    fade: false,
    openLanguageDialog: false,
    applicationLanguage: strings.getLanguage()
  };

  axiosInterceptor = axios.interceptors.response.use((response)=> {
    return response;
  }, (err)=> {
      if(err.message==="Network Error")
      {
        this.handleSnackbar('info', strings.errorNotification401);
        setTimeout(()=>{
          window.location.reload();
        },5000);
      }
      if(err.response!==undefined)
      {
        if (err.response.status===400)
        {
          this.handleSnackbar('error', strings.errorNotification400);
        }
        if (err.response.status===404)
        {
          this.handleSnackbar('error', strings.errorNotification404);
        }
      }
      this.setState({
        loader: false
      })
    return Promise.reject(err);
  });

  componentDidMount() {
    
  }

  handleSnackbar = (type, message) => {
    this.props.enqueueSnackbar(message, {
      variant: type,
    });
  }

  handleDateFrom = event => {
    this.setState({
      fromDate: event.target.value
    });
  };

  handleDateTo = event => {
    this.setState({
      toDate: event.target.value
    });
  };

  handleOpenLanguageDialog = (open, selectedLanguage) => {
    if (selectedLanguage !== undefined) {
      if (this.state.show === 'Logs') {
        strings.setLanguage(selectedLanguage);
        this.setState({
          openLanguageDialog: open,
          applicationLanguage: selectedLanguage
        })
        this.callTimeSeriesApi();
      } else {
        strings.setLanguage(selectedLanguage);
        this.setState({
          openLanguageDialog: open,
          applicationLanguage: selectedLanguage
        })
      }
    } else {
      this.setState({
        openLanguageDialog: open
      })
    }
  }

  callTimeSeriesApi = () => {
    this.setState({
      loader: true,
      error: false,
      fade: false,
      show: ''
    })
    let logData = [];
    axios({
      url: `/api/iottimeseries/v3/timeseries/${this.state.assetID}/${this.state.aspectName}?from=${new Date(this.state.fromDate).toISOString()}&to=${new Date(this.state.toDate).toISOString()}&limit=${limit}`,
      method: 'GET',
      withCredentials: true,
      xsrfCookieName: 'XSRF-TOKEN'
    }).then(res => {
      let response = res.data;
      response.map(x => {
        return logData.push([new Date(x._time).toLocaleString('pl-PL',{ 
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }), x.WasClosing === true ? strings.circuitBreakerClosing : strings.circuitBreakerOpening, x.FileName])
      })
      this.setState({
        logs: logData,
        loader: false,
        fade: true,
        show: 'Logs'
      })
    })
  }

  callFileServiceApi = (filename) => {
    this.setState({
      loader: true,
      error: false,
      fade: false,
      show: ''
    })
    let graphXY = [];
    axios({
      url: `/api/iotfile/v3/files/${this.state.assetID}/${filename}`,
      method: 'GET',
      withCredentials: true,
      xsrfCookieName: 'XSRF-TOKEN'
    }).then(res => {
      let response = res.data;
      response._timeValues.map((time, i) => {
        return graphXY.push({
          x: (time * 1000).toFixed(3),
          y: response._angleValues[i].toFixed(3)
        })
      })
      this.setState({
        graphXYstate: graphXY,
        loader: false,
        fade: true,
        show: 'Graph'
      })
    }) 
  }

  openBottomNavMenu = (menu) => {
    switch (menu) {
      case 'circuit_breakers':
        this.setState({
          openDrawer: true
        })
        break;
      case 'logs':
        if (this.state.assetName !== '') {
          this.callTimeSeriesApi();
        } 
        else {
          this.setState({
            openDrawer: true
          })
        }
        break;
      case 'language_selection':
        this.handleOpenLanguageDialog(true);
        break;
      default:
        break;
    }
  }

  handleDrawer = (open) => {
    this.setState({
      openDrawer: open
    })
  }

  handleAspects = (aspect, assetID, assetName) => {
    this.setState({
      aspectName: aspect,
      assetID: assetID,
      assetName: assetName
    }, () => {
      this.openBottomNavMenu('logs')
    })
  }

  render() {
      let tableOptions = {
        responsive: 'scroll',
        filterType: 'checkbox',
        selectableRows: false,
        onRowClick: (data) => this.callFileServiceApi(data[2]),
        textLabels: {
          body: {
            noMatch: strings.dataTableLabelBodyNoMatch,
            toolTip: strings.dataTableLabelBodySort,
          },
          pagination: {
            next: strings.dataTableLabelPaginationNext,
            previous: strings.dataTableLabelPaginationPrevious,
            rowsPerPage: strings.dataTableLabelRowsPerPage,
            displayRows: strings.dataTableLabelDisplayRows,
          },
          toolbar: {
            search: strings.dataTableLabelToolbarSearch,
            downloadCsv: strings.dataTableLabelToolbarDownloadCSV,
            print: strings.dataTableLabelToolbarPrint,
            viewColumns: strings.dataTableLabelToolbarViewColumns,
            filterTable: strings.dataTableLabelToolbarFilterTable,
          },
          filter: {
            all: strings.dataTableLabelFilterAll,
            title: strings.dataTableLabelFilterTitle,
            reset: strings.dataTableLabelFilterReset,
          },
          viewColumns: {
            title: strings.dataTableLabelViewColumnsTitle,
            titleAria: strings.dataTableLabelViewColumnsTitleArea,
          },
          selectedRows: {
            text: strings.dataTableLabelSelectedRowsText,
            delete: strings.dataTableLabelSelectedRowsDelete,
            deleteAria: strings.dataTableLabelSelectedRowsDeleteAria,
          },
        }
      };

      let tableColumns = [{
          name: strings.dataTableColumnTime,
          options: {
            filter: false,
            sort: true,
            sortDirection: 'desc'
          }
        },
        {
          name: strings.dataTableColumnEvent,
          options: {
            filter: true,
            sort: false,
          }
        },
        {
          name: strings.dataTableColumnFileNameMS,
          options: {
            display: false,
            filter: false,
            sort: false
          }
        }
      ];

      const {
        classes
      } = this.props;

    return (
    <MuiThemeProvider theme={theme}>
      <Fade in={true}>
        <div className={classes.root}>
          <Grid container direction="row" justify="space-around" alignItems="flex-end" spacing={24}>
            {this.state.loader!==false?
            <Grid xs={12} className={classes.linearProgress}>
              <LinearProgress></LinearProgress>
            </Grid>:null}
            <Grid item xs={12} sm={12}>
              <Typography className={classes.heading} variant="h3">{this.state.assetName===''?
                `${strings.headerSelectCircuitBreaker}` : `${strings.headerCircuitBreakerSelected} ${this.state.assetName}`}</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField id="fromDate" label={strings.fromTime} type="datetime-local" defaultValue={this.state.fromDate}
                onChange={this.handleDateFrom} className={classes.picker} InputLabelProps={{
              shrink: true,
            }} />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField id="toDate" label={strings.toTime} type="datetime-local" defaultValue={this.state.toDate} onChange={this.handleDateTo}
                className={classes.picker} InputLabelProps={{
                  shrink: true,
                }} />
            </Grid>
            
            {this.state.show==='Graph'?
            <Fade in={this.state.fade}>
              <Grid item xs={12} className={classes.graphGrid}>
                <Scatter 
                options={{scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: strings.angleAxis
                        }
                    }],
                  xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: strings.timeAxis
                    }
                  }]
                }
              }}
                  data={{
              datasets: [{
              label: strings.angleAxis,
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 2,
              pointHitRadius: 5,
            showLine: true,
            data: this.state.graphXYstate,
              }]
            }}></Scatter>
              </Grid>
            </Fade>:null}

            {this.state.show==='Logs'?
            <Fade in={this.state.fade}>
              <Grid item xs={12} className={classes.graphGrid}>
                <MUIDataTable title={strings.eventHistory} data={this.state.logs} columns={tableColumns} options={tableOptions} />
              </Grid>
            </Fade>
            :null
            }

            <Drawer open={this.state.openDrawer} handleDrawerChange={this.handleDrawer} aspects={this.handleAspects}
              language={this.state.applicationLanguage}></Drawer>
            <Grid item xs={12}>
              <BottomNavigation navigate={this.openBottomNavMenu} language={this.state.applicationLanguage}></BottomNavigation>
            </Grid>
            <Tabs></Tabs>
          </Grid>
            
          {/*
          Language dialog
          */}

          <div>
            <Dialog open={this.state.openLanguageDialog} onClose={()=>this.handleOpenLanguageDialog(false)}
              aria-labelledby="language-dialog-title"
              aria-describedby="language-dialog-description"
              >
              <DialogTitle id="language-dialog-title">{strings.dialogLanguageSelectionTitle}</DialogTitle>
              <DialogContent>
                <DialogContentText id="language-dialog-description">
                  {strings.dialogLanguageSelectionDescription}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={()=>this.handleOpenLanguageDialog(false, "en")} color="primary">
                  {strings.dialogLanguageSelectionEnglish}
                </Button>
                <Button onClick={()=>this.handleOpenLanguageDialog(false, "pl")} color="primary">
                  {strings.dialogLanguageSelectionPolish}
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </Fade>
    </MuiThemeProvider>
    );
  }
}
export default withStyles(styles)(withSnackbar(App));