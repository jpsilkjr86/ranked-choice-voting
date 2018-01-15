// react dependencies
import React from 'react';
import { Link } from 'react-router-dom';

// components from libraries
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'; // for NavLinks to display and work properly

// image assets
import brand from '../images/logo-header.png';

// css assets
import styles from './Header.css';

const Header = () => (
  <div>
    <Navbar staticTop collapseOnSelect>
      <Navbar.Header>
        <Link to="/">
          <Navbar.Brand>
            <img className={styles.brand} src={brand} alt="Ranked Choice Voting"/>
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle/>
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
          <LinkContainer to="/link1"><NavItem eventKey={1}>link1</NavItem></LinkContainer>
          <LinkContainer to="/link2"><NavItem eventKey={2}>link2</NavItem></LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <nav className={`navbar navbar-inverse navbar-static-top ${styles.subnav}`}>
      <div className="container">
        <div className="navbar-header pull-right">
          <Navbar.Brand>
            <em>Create and manage a ranked choice election in minutes!</em>
          </Navbar.Brand>
        </div>
      </div>
    </nav>
  </div>
);

export default Header;