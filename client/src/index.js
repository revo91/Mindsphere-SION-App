import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Test from './components/Test';
import * as serviceWorker from './serviceWorker';
import 'typeface-roboto';
import { SnackbarProvider } from 'notistack';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

const routing = (
    <SnackbarProvider maxSnack={3} style={{marginBottom:'56px'}}>
    <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/test" component={Test} />
    </div>
  </Router>
  </SnackbarProvider>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
