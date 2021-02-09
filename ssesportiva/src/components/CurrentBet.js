import React from 'react';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { setBetValue } from '../actions/bet';

class CurrentBet extends React.Component {
  render() {
    const { value, expectedReturn, options } = this.props;

    return (
      <div>
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
        <Button>
          <Link to="/finalizar">Finalizar {options.length}</Link>
        </Button>
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
    setBetValue: (value) => dispatch(setBetValue(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrentBet);
