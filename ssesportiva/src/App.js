import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import Navigation from './components/Navigation';
import MemberContainer from './containers/MemberContainer';
import RulesContainer from './containers/RulesContainer';
import GroupListContainer from './containers/GroupListContainer';
import ChampionshipContainer from './containers/ChampionshipContainer';
import GamesByDateContainer from './containers/GamesByDateContainer';
import GameContainer from './containers/GameContainer';
import BetSummaryContainer from './containers/BetSummaryContainer';
import BetCodeContainer from './containers/BetCodeContainer';
import SearchTicketContainer from './containers/SearchTicketContainer';
import SearchBetContainer from './containers/SearchBetContainer';
import ConfirmBetContainer from './containers/ConfirmBetContainer';
import TicketContainer from './containers/TicketContainer';
import NotFoundContainer from './containers/NotFoundContainer';
import ToastContainer from './components/ToastContainer';
import { connect } from 'react-redux';

const AppContainer = styled.div`
  padding-top: 54px;
`;

class App extends Component {
  render() {
    const { auth, user } = this.props;

    return (
      <AppContainer>
        <Navigation auth={auth} user={user} />
        <ToastContainer />

        <Switch>
          <Route exact path="/" component={GroupListContainer} />
          <Route exact path="/regulamento" component={RulesContainer} />
          <Route
            exact
            path="/campeonato/:id"
            component={ChampionshipContainer}
          />
          <Route
            exact
            path="/jogos-por-data/:date"
            component={GamesByDateContainer}
          />
          <Route exact path="/jogo/:id" component={GameContainer} />
          <Route exact path="/finalizar" component={BetSummaryContainer} />
          <Route exact path="/sucesso" component={BetCodeContainer} />
          <Route
            exact
            path="/conferir-bilhete"
            component={SearchTicketContainer}
          />
          <Route exact path="/bilhete/:id" component={TicketContainer} />
          <Route exact path="/acesso" component={MemberContainer} />
          <Route exact path="/buscar-aposta" component={SearchBetContainer} />
          <Route exact path="/aposta/:id" component={ConfirmBetContainer} />
          <Route exact path="*" component={NotFoundContainer} />
        </Switch>
      </AppContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(App);
