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
      <div
        className="bg-dark py-2 px-1 d-flex justify-content-between fixed-top"
        style={{ marginTop: '54px', zIndex: '1029' }}
      >
        <NumberFormat
          decimalSeparator=","
          value={value}
          prefix={'R$ '}
          displayType={'input'}
          fixedDecimalScale
          decimalScale={2}
          onValueChange={(values) => {
            const { value } = values;
            this.props.setBetValue(value);
          }}
        />
        <NumberFormat
          decimalSeparator=","
          value={expectedReturn}
          prefix={'R$ '}
          displayType={'text'}
          fixedDecimalScale
          decimalScale={2}
          className="text-white"
        />
        <Button className="btn-success">
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
