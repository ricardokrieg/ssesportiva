import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'redux';

import { getChampionship } from '../actions/championship';
import { addOption, removeOption } from '../actions/bet';
import { Button, Row, Col, ButtonGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { find, filter, isEmpty } from 'lodash';
import CurrentBet from '../components/CurrentBet';
import Loading from '../components/Loading';
import Error from '../components/Error';

class ChampionshipContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      query: '',
    };
  }

  componentDidMount() {
    const {
      getChampionship,
      match: {
        params: { id },
      },
    } = this.props;

    getChampionship(id, () => {
      this.setState({ ready: true });
    });
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

  filterGame(game) {
    let { query } = this.state;
    query = query.toLowerCase();

    return (
      isEmpty(query.trim()) ||
      game.title.toLowerCase().includes(query) ||
      game.date.toLowerCase().includes(query)
    );
  }

  render() {
    const { loading, error, championship } = this.props;

    if (!this.state.ready || loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
      <>
        <CurrentBet />

        <div className="bg-white" style={{ paddingTop: '54px' }}>
          <h3 className="text-center p-3">{championship.title}</h3>
        </div>

        {championship.games.length > 3 && (
          <div className="mx-3">
            <Form.Control
              type="search"
              placeholder="Buscar jogos por nome ou horário"
              onChange={(e) => {
                this.setState({ query: e.target.value });
              }}
            />
          </div>
        )}

        <div className="bg-light p-3 pt-2">
          {filter(championship.games, this.filterGame.bind(this)).map(
            (game, index) => (
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

                  <Col className="d-flex align-items-center">
                    <ButtonGroup className="w-100" style={{ height: '40px' }}>
                      {game.quote.options.map((option, optionIndex) => (
                        <Button
                          key={optionIndex + 1}
                          size="sm"
                          className="border-white rounded"
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
                    </ButtonGroup>
                  </Col>
                </Row>
              </div>
            )
          )}
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
    options: state.bet.options,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getChampionship: (id, callback) =>
      dispatch(getChampionship(id), callback()),
    addOption: (championship, game, quote, option) =>
      dispatch(addOption(championship, game, quote, option)),
    removeOption: (option) => dispatch(removeOption(option)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ChampionshipContainer);
