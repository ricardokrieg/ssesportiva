import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'redux';

import Game from '../components/Game';
import { getGame } from '../actions/game';

class GameContainer extends React.Component {
  componentDidMount() {
    const { id } = this.props.match.params;

    this.props.getGame(id);
  }

  render() {
    const { loading, loaded, error, game } = this.props;

    if (error) return <div>{error.message}</div>;
    if (loading || !loaded) return <div>carregando</div>;

    return <Game game={game} />;
  }
}

const mapStateToProps = (state) => {
  return {
    game: state.game.data,
    error: state.game.error,
    loading: state.game.loading,
    loaded: state.game.loaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGame: (id) => dispatch(getGame(id)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(GameContainer);
