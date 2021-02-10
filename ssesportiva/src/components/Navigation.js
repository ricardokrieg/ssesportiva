import React from 'react';
import styled from 'styled-components';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavigationBar = styled.div`
  margin-bottom: 15px;
  background-color: none;
`;

const Navigation = () => (
  <Navbar expand="lg">
    <Navbar.Brand>
      <Link to="/">
        <img
          src="/logo.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="SS Esportiva"
        />
      </Link>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <NavItem>
          <Link to="/">Futebol</Link>
        </NavItem>
        <NavItem>
          <Link to="/regulamento">Regulamento</Link>
        </NavItem>
        <NavItem>
          <Link to="/conferir-bilhete">Conferir Bilhete</Link>
        </NavItem>
        <NavItem>
          <Link to="/acesso">Acesso</Link>
        </NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default Navigation;
