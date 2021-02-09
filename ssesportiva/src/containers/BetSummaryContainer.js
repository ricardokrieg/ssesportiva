import React from 'react';
import { connect } from 'react-redux';

import { Button } from 'react-bootstrap';
import { removeOption, setBetValue, placeBet } from '../actions/bet';
import NumberFormat from 'react-number-format';
import ToastContainer from '../components/ToastContainer';

class BetSummaryContainer extends React.Component {
  handleRemoveOptionClick(option) {
    this.props.removeOption(option);
  }

  placeBet() {
    this.props.placeBet();
  }

  render() {
    const { value, expectedReturn, options } = this.props;

    return (
      <div>
        {options.map((option, optionIndex) => (
          <div key={optionIndex + 1}>
            <div>{option.title}</div>
            <div>
              {option.group} - {option.championship}
            </div>
            <div>{option.game}</div>
            <div>{option.quoteType}</div>
            <div>Cotação: {option.quote}</div>
            <Button onClick={() => this.handleRemoveOptionClick(option)}>
              Remover
            </Button>
          </div>
        ))}

        <NumberFormat
          value={value}
          prefix={'R$ '}
          displayType={'input'}
          fixedDecimalScale
          decimalScale={2}
          onValueChange={(values) => {
            const { formattedValue, value } = values;
            this.props.setBetValue(value);
          }}
        />
        <NumberFormat
          value={expectedReturn}
          prefix={'R$ '}
          displayType={'text'}
          fixedDecimalScale
          decimalScale={2}
        />

        <Button onClick={() => this.placeBet()}>Enviar</Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    value: state.bet.value,
    expectedReturn: state.bet.expectedReturn,
    options: state.bet.options,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeOption: (option) => dispatch(removeOption(option)),
    setBetValue: (value) => dispatch(setBetValue(value)),
    placeBet: () => dispatch(placeBet()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BetSummaryContainer);
