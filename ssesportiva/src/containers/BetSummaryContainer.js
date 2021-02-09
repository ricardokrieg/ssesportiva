import React from 'react';
import { connect } from 'react-redux';

import { Button } from 'react-bootstrap';
import { removeOption, setBetValue } from '../actions/bet';
import NumberFormat from 'react-number-format';

class BetSummaryContainer extends React.Component {
  handleRemoveOptionClick(option) {
    this.props.removeOption(option);
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BetSummaryContainer);
