import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Route } from 'react-router-dom';

import Navigation from './components/Navigation';
import MemberContainer from './containers/MemberContainer';
import GroupListContainer from './containers/GroupListContainer';
import ChampionshipContainer from './containers/ChampionshipContainer';
import GameContainer from './containers/GameContainer';
import BetSummaryContainer from './containers/BetSummaryContainer';
import TicketContainer from './containers/TicketContainer';
import ToastContainer from './components/ToastContainer';

class App extends Component {
  render() {
    return (
      <>
        <Navigation />
        <ToastContainer />

        <Route exact path="/" component={GroupListContainer} />
        <Route exact path="/acesso" component={MemberContainer} />
        <Route exact path="/campeonato/:id" component={ChampionshipContainer} />
        <Route exact path="/jogo/:id" component={GameContainer} />
        <Route exact path="/finalizar" component={BetSummaryContainer} />
        <Route exact path="/conferir-bilhete" component={TicketContainer} />
        <Route exact path="/conferir-bilhete/:id" component={TicketContainer} />
      </>
    );
  }
}

export default App;
