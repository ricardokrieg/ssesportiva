import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Route } from 'react-router-dom';
import Navigation from './components/Navigation';

import Login from './containers/Login';
import UserContainer from './containers/UserContainer';

class App extends Component {
  render() {
    return (
      <Container>
        <Row className="row">
          <Col xs={12}>
            <Navigation />

            <Route exact path="/" component={UserContainer} />
            <Route exact path="/acesso" component={Login} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
