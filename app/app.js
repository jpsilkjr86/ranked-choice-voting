// principle react dependencies
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

// imports StateContainer parent component
import StateContainer from './components/StateContainer';

// renders Router as wrapper to StateContainer parent and replaces div "#app" with it
render(<Router><StateContainer/></Router>, document.getElementById("app"));