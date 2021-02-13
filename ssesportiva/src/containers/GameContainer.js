import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'redux';

import { getGame } from '../actions/game';
import { Button, Card } from 'react-bootstrap';
import { find } from 'lodash';
import { addOption, removeOption } from '../actions/bet';
import CurrentBet from '../components/CurrentBet';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

class GameContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    const {
      getGame,
      match: {
        params: { id },
      },
    } = this.props;

    getGame(id, () => {
      this.setState({ ready: true });
    });
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

  getHour(game) {
    return game.date.split(' ')[1];
  }

  getQuoteType(quote) {
    if (quote.type.length > 30) {
      return <h5 className="text-center m-3">{quote.type}</h5>;
    } else {
      return <h4 className="text-center m-3">{quote.type}</h4>;
    }
  }

  render() {
    const { loading, error, game } = this.props;

    if (!this.state.ready || loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
      <>
        <CurrentBet />

        <div className="px-3 position-relative" style={{ paddingTop: '54px' }}>
          <h3 className="text-center mt-3">{game.title}</h3>
          <span
            className="position-absolute badge bg-secondary"
            style={{ top: '50px', right: '20px' }}
          >
            <FontAwesomeIcon icon={faCalendar} />
            <span className="mx-1">{game.date}</span>
          </span>
        </div>

        <hr />

        <div className="m-3">
          {game.quotes.map((quote, index) => (
            <div key={index + 1} className="card shadow">
              {this.getQuoteType(quote)}

              {quote.options.map((option, optionIndex) => (
                <div
                  key={optionIndex + 1}
                  className="border d-flex justify-content-between align-items-center p-3"
                >
                  <h5 className="m-0">{option.title}</h5>
                  <Button
                    className="border-white rounded w-25"
                    variant={this.btnVariant(option)}
                    onClick={() => this.handleOptionClick(game, quote, option)}
                  >
                    {option.quote}
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    game: state.game.data,
    error: state.game.error,
    loading: state.game.loading,
    options: state.bet.options,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGame: (id, callback) => dispatch(getGame(id), callback()),
    addOption: (championship, game, quote, option) =>
      dispatch(addOption(championship, game, quote, option)),
    removeOption: (option) => dispatch(removeOption(option)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(GameContainer);
