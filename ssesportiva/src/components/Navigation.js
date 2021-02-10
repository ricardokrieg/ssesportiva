import React from 'react';
import { Navbar, Nav, NavItem, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFutbol,
  faTicketAlt,
  faFileAlt,
  faKey,
} from '@fortawesome/free-solid-svg-icons';

const Navigation = () => (
  <Navbar expand="md" variant="dark" fixed="top">
    <Container fluid>
      <Navbar.Brand>
        <Link to="/">
          <img src="/logo.png" height="27" alt="SS eSportiva" />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          <NavItem>
            <Link to="/" className="nav-link">
              <FontAwesomeIcon icon={faFutbol} />
              Futebol
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/conferir-bilhete" className="nav-link">
              <FontAwesomeIcon icon={faTicketAlt} />
              <span className="ml-1">Conferir Bilhete</span>
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/regulamento" className="nav-link">
              <FontAwesomeIcon icon={faFileAlt} />
              Regulamento
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/acesso" className="nav-link">
              <FontAwesomeIcon icon={faKey} />
              Acesso
            </Link>
          </NavItem>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default Navigation;
