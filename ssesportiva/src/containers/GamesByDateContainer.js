import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'redux';
import { getGamesByDate } from '../actions/game';
import { addOption, removeOption } from '../actions/bet';
import { Button, Row, Col, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { find } from 'lodash';
import CurrentBet from '../components/CurrentBet';
import Loading from '../components/Loading';
import Error from '../components/Error';
import moment from 'moment';

const getWeekDay = (date) => {
  const weekDay = moment(date).day();

  return ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][
    weekDay
  ];
};

class GamesByDateContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      date: '',
    };
  }

  componentDidMount() {
    const {
      getGamesByDate,
      match: {
        params: { date },
      },
    } = this.props;

    this.setState({ date });

    getGamesByDate(date, () => {
      this.setState({ ready: true });
    });
  }

  handleOptionClick(championship, game, quote, option) {
    if (this.isSelectedOption(option)) {
      this.props.removeOption(option);
    } else {
      console.log(championship);
      console.log(game);
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
    const { loading, error, groups } = this.props;

    if (!this.state.ready || loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
      <>
        <CurrentBet />

        <div className="bg-white" style={{ paddingTop: '54px' }}>
          <h3 className="text-center p-3">{getWeekDay(this.state.date)}</h3>
        </div>

        <div className="bg-light p-3 pt-2">
          {groups.map((group, index) => (
            <div key={index + 1}>
              <h3>{group.name}</h3>

              {group.championships.map((championship, championshipIndex) => (
                <div key={championshipIndex + 1}>
                  <h4>{championship.title}</h4>

                  {championship.games.map((game, gameIndex) => (
                    <div
                      className="shadow-sm p-3 mb-2 bg-white rounded"
                      key={gameIndex + 1}
                    >
                      <Row>
                        <Col>
                          <Link to={'/jogo/' + game.id}>
                            {game.title} {game.date}
                          </Link>
                        </Col>

                        <Col className="d-flex align-items-center">
                          <ButtonGroup
                            className="w-100"
                            style={{ height: '40px' }}
                          >
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
                  ))}
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
    groups: state.gamesByDate.data,
    error: state.gamesByDate.error,
    loading: state.gamesByDate.loading,
    options: state.bet.options,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addOption: (championship, game, quote, option) =>
      dispatch(addOption(championship, game, quote, option)),
    removeOption: (option) => dispatch(removeOption(option)),
    getGamesByDate: (date, callback) =>
      dispatch(getGamesByDate(date), callback()),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(GamesByDateContainer);
