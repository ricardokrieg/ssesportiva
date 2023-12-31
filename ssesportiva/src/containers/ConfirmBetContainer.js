import React from 'react';
import { connect } from 'react-redux';
import { Button, Col, Row } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import Form from 'react-bootstrap/Form';
import Loading from '../components/Loading';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { confirmPendingBet, getPendingBet } from '../actions/pending_bet';
import { getClients } from '../actions/client';
import { isNull, isEmpty } from 'lodash';
import Error from '../components/Error';

class ConfirmBetContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      clientId: '',
    };
  }

  componentDidMount() {
    const {
      getClients,
      getPendingBet,
      match: {
        params: { id },
      },
    } = this.props;

    getClients();

    getPendingBet(id, () => {
      this.setState({ ready: true });
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (isNull(prevProps.pendingBet) && !isNull(this.props.pendingBet)) {
      if (!isEmpty(this.props.pendingBet.ticketCode)) {
        this.props.history.replace(
          `/bilhete/${this.props.pendingBet.ticketCode}`
        );
        return;
      }
    }

    if (isEmpty(prevProps.ticketCode) && !isEmpty(this.props.ticketCode)) {
      this.props.history.replace(`/bilhete/${this.props.ticketCode}`);
    }
  }

  confirmPendingBet() {
    const { confirmPendingBet, pendingBet } = this.props;

    confirmPendingBet(pendingBet.code, this.state.clientId);
  }

  renderConfirmButton() {
    const { pendingBet } = this.props;

    if (!pendingBet.canConfirm) {
      const message =
        pendingBet.statusWarningConfirm ||
        'Esta aposta não pode ser confirmada';
      return <div className="align-self-end text-danger">{message}</div>;
    }

    return (
      <Button
        size="lg"
        className="align-self-end text-white"
        variant="primary"
        onClick={() => this.confirmPendingBet()}
      >
        Aprovar
      </Button>
    );
  }

  renderFooter() {
    const {
      pendingBet,
      loading,
      clients,
      loadingClients,
      errorClients,
    } = this.props;

    if (!this.state.ready || loading || loadingClients) {
      return (
        <div className="bg-dark py-3">
          <Loading height="100%" />
        </div>
      );
    }

    if (errorClients) {
      return <Error error={errorClients} />;
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
              <Form.Group controlId="clientId" className="mt-2">
                <Form.Label className="text-white">Cliente</Form.Label>
                <Form.Control
                  as="select"
                  size="lg"
                  onChange={(event) =>
                    this.setState({ clientId: event.target.value })
                  }
                >
                  <option>Selecione o Cliente</option>
                  {clients.map((client, index) => (
                    <option key={index + 1} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>

            <Col className="d-flex justify-content-center">
              {this.renderConfirmButton()}
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  render() {
    const { pendingBet, loadingPendingBet } = this.props;

    if (!this.state.ready || loadingPendingBet) return <Loading />;
    if (!pendingBet) return <Error error={'Aposta inválida'} />;

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
    loadingPendingBet: state.pendingBet.loading,
    loading: state.pendingBet.confirmLoading,
    error: state.pendingBet.confirmError,
    clients: state.client.clients,
    loadingClients: state.client.loadingClients,
    errorClients: state.client.errorClients,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getClients: () => dispatch(getClients()),
    confirmPendingBet: (code, clientId) =>
      dispatch(confirmPendingBet(code, clientId)),
    getPendingBet: (id, callback) => dispatch(getPendingBet(id), callback()),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ConfirmBetContainer);
