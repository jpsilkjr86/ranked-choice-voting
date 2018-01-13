// react dependencies
import React from 'react';

// css assets
import styles from './CustomJumbotron.css';

const CustomJumbotron = props => (
  <div className={`jumbotron ${styles["with-bkg-img"]} ${styles[props.background]}`}>
    {props.children}
  </div>
);

export default CustomJumbotron;