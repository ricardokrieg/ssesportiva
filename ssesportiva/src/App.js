import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Route } from 'react-router-dom';

import Navigation from './components/Navigation';
import Login from './containers/Login';
import UserContainer from './containers/UserContainer';
import GroupListContainer from './containers/GroupListContainer';
import ChampionshipContainer from './containers/ChampionshipContainer';
import GameContainer from './containers/GameContainer';
import BetSummaryContainer from './containers/BetSummaryContainer';
import ToastContainer from './components/ToastContainer';

class App extends Component {
  render() {
    return (
      <div>
        <Navigation />

        <Container>
          <ToastContainer />

          <Row className="row">
            <Col xs={12}>
              <Route exact path="/" component={GroupListContainer} />
              <Route exact path="/nada" component={UserContainer} />
              <Route exact path="/acesso" component={Login} />
              <Route
                exact
                path="/campeonato/:id"
                component={ChampionshipContainer}
              />
              <Route exact path="/jogo/:id" component={GameContainer} />
              <Route exact path="/finalizar" component={BetSummaryContainer} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
