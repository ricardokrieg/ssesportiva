import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavigationBar = styled.div`
  margin-bottom: 15px;
  background-color: lightgray;
`;

const Navigation = () => (
  <NavigationBar>
    <Link className="btn btn-primary" to="/">
      Home
    </Link>
    <Link className="btn btn-secondary" to="/acesso">
      Login
    </Link>
  </NavigationBar>
);

export default Navigation;
