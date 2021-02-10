import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'redux';

import { getChampionship } from '../actions/championship';
import { addOption, removeOption } from '../actions/bet';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { find } from 'lodash';
import CurrentBet from '../components/CurrentBet';

class ChampionshipContainer extends React.Component {
  componentDidMount() {
    const {
      getChampionship,
      match: {
        params: { id },
      },
    } = this.props;

    getChampionship(id);
  }

  handleOptionClick(championship, game, quote, option) {
    if (this.isSelectedOption(option)) {
      this.props.removeOption(option);
    } else {
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
    const { loading, loaded, error, championship } = this.props;

    if (error) return <div>{error.message}</div>;
    if (loading || !loaded) return <div>carregando</div>;

    return (
      <>
        <CurrentBet />

        <div className="bg-white">
          <h3>{championship.title}</h3>
        </div>

        <div className="bg-light p-3">
          {championship.games.map((game, index) => (
            <div
              className="shadow-sm p-3 mb-2 bg-white rounded"
              key={index + 1}
            >
              <Row>
                <Col>
                  <Link to={'/jogo/' + game.id}>
                    {game.title} {game.date}
                  </Link>
                </Col>

                <Col>
                  <div>
                    {game.quote.options.map((option, optionIndex) => (
                      <Button
                        key={optionIndex + 1}
                        className="rounded btn-sm m-1"
                        variant={this.btnVariant(option)}
                        onClick={() =>
                          this.handleOptionClick(
                            championship,
                            game,
                            game.quote,
                            option
                          )
                        }
                      >
                        {option.quote}
                      </Button>
                    ))}
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    championship: state.championship.data,
    error: state.championship.error,
    loading: state.championship.loading,
    loaded: state.championship.loaded,
    options: state.bet.options,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getChampionship: (id) => dispatch(getChampionship(id)),
    addOption: (championship, game, quote, option) =>
      dispatch(addOption(championship, game, quote, option)),
    removeOption: (option) => dispatch(removeOption(option)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ChampionshipContainer);
