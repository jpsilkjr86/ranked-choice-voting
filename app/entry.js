// principle react dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

// imports App parent component
import App from './App';

// renders Router as wrapper to App parent and replaces div "#app" with it
ReactDOM.render(<Router><App/></Router>, document.getElementById("app"));