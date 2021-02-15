import React from 'react';
import { connect } from 'react-redux';
import { Button, Col, Row } from 'react-bootstrap';
import {
  removeOption,
  setBetValue,
  setName,
  placeBet,
  clearBet,
} from '../actions/bet';
import NumberFormat from 'react-number-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Form from 'react-bootstrap/Form';
import { isEmpty } from 'lodash';
import Loading from '../components/Loading';
import { compose } from 'redux';
import { withRouter } from 'react-router';

class BetSummaryContainer extends React.Component {
  componentDidMount() {
    this.props.clearBet();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (isEmpty(prevProps.code) && !isEmpty(this.props.code)) {
      this.props.history.replace('/sucesso');
    }
  }

  handleRemoveOptionClick(option) {
    this.props.removeOption(option);
  }

  placeBet() {
    this.props.placeBet();
  }

  renderFooter() {
    const { loading } = this.props;

    if (loading) {
      return (
        <div className="bg-dark py-3">
          <Loading height="100%" />
        </div>
      );
    }

    const { value, expectedReturn } = this.props;

    return (
      <div className="bg-dark p-3">
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="value">
                <Form.Label className="text-white">Valor da Aposta</Form.Label>
                <NumberFormat
                  decimalSeparator=","
                  customInput={Form.Control}
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
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="expectedReturn">
                <Form.Label className="text-white">Possível Retorno</Form.Label>
                <div
                  className="border border-white rounded ps-2"
                  style={{ height: '33px', lineHeight: '33px' }}
                >
                  <NumberFormat
                    decimalSeparator=","
                    value={expectedReturn}
                    prefix={'R$ '}
                    displayType={'text'}
                    fixedDecimalScale
                    decimalScale={2}
                    className="text-white"
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="name" className="mt-2">
                <Form.Label className="text-white">Seu Nome</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => {
                    this.props.setName(e.target.value);
                  }}
                />
              </Form.Group>
            </Col>

            <Col className="d-flex justify-content-center">
              <Button
                size="lg"
                className="align-self-end text-white"
                variant="success"
                onClick={() => this.placeBet()}
              >
                Enviar
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  render() {
    const { options } = this.props;

    return (
      <>
        <div className="pt-3">
          {options.map((option, optionIndex) => (
            <div
              key={optionIndex + 1}
              className="card mx-3 my-1 p-3 pt-4 position-relative"
            >
              <Button
                variant="danger"
                size="sm"
                className="text-white position-absolute"
                style={{ top: '8px', right: '8px' }}
                onClick={() => this.handleRemoveOptionClick(option)}
              >
                <FontAwesomeIcon icon={faTimes} />
                <span className="ms-1">Remover</span>
              </Button>

              <div>
                {option.group} - {option.championship}
              </div>
              <div>{option.game}</div>
              <div>{option.quoteType}</div>
              <div className="d-flex justify-content-between mt-3">
                <strong className="text-primary">{option.title}</strong>
                <strong>Cotação: {option.quote}</strong>
              </div>
            </div>
          ))}
        </div>

        <hr />

        {this.renderFooter()}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    value: state.bet.value,
    expectedReturn: state.bet.expectedReturn,
    options: state.bet.options,
    loading: state.bet.loading,
    code: state.bet.code,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeOption: (option) => dispatch(removeOption(option)),
    setBetValue: (value) => dispatch(setBetValue(value)),
    setName: (value) => dispatch(setName(value)),
    placeBet: () => dispatch(placeBet()),
    clearBet: () => dispatch(clearBet()),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(BetSummaryContainer);
