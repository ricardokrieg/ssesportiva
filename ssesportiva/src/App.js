import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

import Navigation from './components/Navigation';
import MemberContainer from './containers/MemberContainer';
import GroupListContainer from './containers/GroupListContainer';
import ChampionshipContainer from './containers/ChampionshipContainer';
import GameContainer from './containers/GameContainer';
import BetSummaryContainer from './containers/BetSummaryContainer';
import TicketContainer from './containers/TicketContainer';
import ToastContainer from './components/ToastContainer';

const AppContainer = styled.div`
  padding-top: 70px;
`;

class App extends Component {
  render() {
    return (
      <AppContainer>
        <Navigation />
        <ToastContainer />

        <Route exact path="/" component={GroupListContainer} />
        <Route exact path="/acesso" component={MemberContainer} />
        <Route exact path="/campeonato/:id" component={ChampionshipContainer} />
        <Route exact path="/jogo/:id" component={GameContainer} />
        <Route exact path="/finalizar" component={BetSummaryContainer} />
        <Route exact path="/conferir-bilhete" component={TicketContainer} />
        <Route exact path="/conferir-bilhete/:id" component={TicketContainer} />
      </AppContainer>
    );
  }
}

export default App;
