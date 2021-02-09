import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'redux';

import { getGame } from '../actions/game';
import { Button, Card } from 'react-bootstrap';
import { find } from 'lodash';
import { addOption, removeOption } from '../actions/bet';
import CurrentBet from '../components/CurrentBet';

class GameContainer extends React.Component {
  componentDidMount() {
    const {
      getGame,
      match: {
        params: { id },
      },
    } = this.props;

    getGame(id);
  }

  handleOptionClick(game, quote, option) {
    if (this.isSelectedOption(option)) {
      this.props.removeOption(option);
    } else {
      const { championshipId, championshipTitle, group } = game;
      const championship = {
        id: championshipId,
        title: championshipTitle,
        group,
      };
      this.props.addOption(championship, game, quote, option);
    }
  }

  isSelectedOption(option) {
    return find(this.props.options, { id: option.id });
  }

  btnVariant(option) {
    return this.isSelectedOption(option) ? 'warning' : 'primary';
  }

  render() {
    const { loading, loaded, error, game } = this.props;

    if (error) return <div>{error.message}</div>;
    if (loading || !loaded) return <div>carregando</div>;

    return (
      <div>
        <CurrentBet />

        {game.quotes.map((quote, index) => (
          <Card key={index + 1}>
            <Card.Header>{quote.type}</Card.Header>
            <Card.Body>
              <div>
                {quote.options.map((option, optionIndex) => (
                  <div key={optionIndex + 1}>
                    <div>{option.id}</div>
                    <div>{option.title}</div>
                    <Button
                      variant={this.btnVariant(option)}
                      onClick={() =>
                        this.handleOptionClick(game, quote, option)
                      }
                    >
                      {option.quote}
                    </Button>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    game: state.game.data,
    error: state.game.error,
    loading: state.game.loading,
    loaded: state.game.loaded,
    options: state.bet.options,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGame: (id) => dispatch(getGame(id)),
    addOption: (championship, game, quote, option) =>
      dispatch(addOption(championship, game, quote, option)),
    removeOption: (option) => dispatch(removeOption(option)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(GameContainer);
