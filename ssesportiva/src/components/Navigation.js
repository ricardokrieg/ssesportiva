import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFutbol,
  faTicketAlt,
  faFileAlt,
  faKey,
} from '@fortawesome/free-solid-svg-icons';
import { isNull } from 'lodash';
import PropTypes from 'prop-types';

const isValidUser = (auth, user) => {
  return auth && !auth.isEmpty && !isNull(user);
};

const Navigation = ({ auth, user }) => (
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
              <span className="mx-2">Futebol</span>
            </Link>
          </NavItem>

          <NavItem>
            <Link to="/conferir-bilhete" className="nav-link">
              <FontAwesomeIcon icon={faTicketAlt} />
              <span className="mx-2">Conferir Bilhete</span>
            </Link>
          </NavItem>

          <NavItem>
            <Link to="/regulamento" className="nav-link">
              <FontAwesomeIcon icon={faFileAlt} />
              <span className="mx-2">Regulamento</span>
            </Link>
          </NavItem>

          <NavDropdown.Divider />

          {isValidUser(auth, user) && (
            <NavItem>
              <Link to="/buscar-aposta" className="nav-link">
                <FontAwesomeIcon icon={faKey} />
                <span className="mx-2">Aprovar Aposta</span>
              </Link>
            </NavItem>
          )}

          <NavItem>
            <Link to="/acesso" className="nav-link">
              <FontAwesomeIcon icon={faKey} />
              <span className="mx-2">Acesso</span>
            </Link>
          </NavItem>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

Navigation.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object,
};

export default Navigation;
