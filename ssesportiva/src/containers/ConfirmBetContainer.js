import React from 'react';
import { connect } from 'react-redux';
import { Button, Col, Row } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import Form from 'react-bootstrap/Form';
import Loading from '../components/Loading';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { confirmPendingBet } from '../actions/pending_bet';
import { isNull, isEmpty } from 'lodash';

class ConfirmBetContainer extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (isEmpty(prevProps.ticketCode) && !isEmpty(this.props.ticketCode)) {
      this.props.history.replace(`/bilhete/${this.props.ticketCode}`);
    }
  }

  confirmPendingBet() {
    const { pendingBet } = this.props;

    this.props.confirmPendingBet(pendingBet.code, 'Teste');
  }

  renderFooter() {
    const { pendingBet, loading } = this.props;

    if (loading) {
      return (
        <div className="bg-dark py-3">
          <Loading height="100%" />
        </div>
      );
    }

    if (isNull(pendingBet)) {
      return <div></div>;
    }

    return (
      <div className="bg-dark p-3">
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="value">
                <Form.Label className="text-white">Valor da Aposta</Form.Label>
                <div
                  className="border border-white rounded ps-2"
                  style={{ height: '33px', lineHeight: '33px' }}
                >
                  <NumberFormat
                    decimalSeparator=","
                    value={pendingBet.value / 100}
                    prefix={'R$ '}
                    displayType={'text'}
                    fixedDecimalScale
                    decimalScale={2}
                    className="text-white"
                  />
                </div>
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
                    value={pendingBet.expectedReturn / 100}
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
                <Form.Label className="text-white">Nome do Cliente</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>

            <Col className="d-flex justify-content-center">
              <Button
                size="lg"
                className="align-self-end text-white"
                variant="success"
                onClick={() => this.confirmPendingBet()}
              >
                Confirmar
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  render() {
    const { pendingBet } = this.props;

    if (isNull(pendingBet)) {
      return <div></div>;
    }

    return (
      <>
        <div className="pt-3">
          {pendingBet.options.map((option, optionIndex) => (
            <div key={optionIndex + 1} className="card mx-3 my-1 p-3">
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
    pendingBet: state.pendingBet.data,
    ticketCode: state.pendingBet.ticketCode,
    loading: state.pendingBet.confirmLoading,
    error: state.pendingBet.confirmError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    confirmPendingBet: (name) => dispatch(confirmPendingBet(name)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ConfirmBetContainer);
