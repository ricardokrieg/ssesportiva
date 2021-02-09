import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'redux';

import { getChampionship } from '../actions/championship';
import { addOption, removeOption } from '../actions/bet';
import { Accordion, Button, Card } from 'react-bootstrap';
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

  handleOptionClick(game, option) {
    if (this.isSelectedOption(option)) {
      this.props.removeOption(option);
    } else {
      this.props.addOption(game, option);
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
      <div>
        <CurrentBet />

        {championship.games.map((game, index) => (
          <Card key={index + 1}>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey={index + 1}>
                <Link to={'/jogo/' + game.id}>
                  {game.title} {game.date}
                </Link>
              </Accordion.Toggle>
            </Card.Header>
            <Card.Body>
              <div>{game.quote.type}</div>
              <div>
                {game.quote.options.map((option, optionIndex) => (
                  <div key={optionIndex + 1}>
                    <div>{option.id}</div>
                    <div>{option.title}</div>
                    <Button
                      variant={this.btnVariant(option)}
                      onClick={() => this.handleOptionClick(game, option)}
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
    addOption: (game, option) => dispatch(addOption(game, option)),
    removeOption: (option) => dispatch(removeOption(option)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ChampionshipContainer);
