import React from 'react';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import Loading from '../components/Loading';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { getTicket, setTicketResult } from '../actions/ticket';
import Error from '../components/Error';
import moment from 'moment';
import { Button } from 'react-bootstrap';

const fontFamily =
  'Montserrat, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

class TicketContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    const {
      getTicket,
      match: {
        params: { id },
      },
    } = this.props;

    getTicket(id, () => {
      this.setState({ ready: true });
    });
  }

  getTicketResult(result) {
    if (result === 'win') return 'Ganhou';
    if (result === 'loss') return 'Perdeu';

    return null;
  }

  renderSetResult() {
    const { ticket, loadingSetTicket, errorSetTicket } = this.props;

    if (!ticket.canSetResult) {
      return null;
    }

    if (loadingSetTicket) return <Loading />;
    if (errorSetTicket) return <Error error={errorSetTicket} />;

    return (
      <div className="p-3 d-flex justify-content-between">
        <Button
          onClick={() => {
            this.props.setTicketResult(ticket.ticketCode, 'win');
          }}
          variant="success"
        >
          Ganhou
        </Button>
        <Button
          onClick={() => {
            this.props.setTicketResult(ticket.ticketCode, 'loss');
          }}
          variant="danger"
        >
          Perdeu
        </Button>
      </div>
    );
  }

  renderHeader() {
    const { ticket } = this.props;

    const betType =
      ticket.options.length > 1 ? 'Aposta Múltipla' : 'Aposta Simples';
    const date = moment(ticket.createdAt._seconds * 1000).format(
      'DD/MM/YYYY hh:mm'
    );

    return (
      <div>
        <h4>Bilhete {ticket.ticketCode}</h4>
        <div>{betType}</div>
        <div>{date}</div>
        <div>Colaborador: {ticket.approvedByName}</div>
        <div>Cliente: {ticket.name}</div>
      </div>
    );
  }

  renderFooter() {
    const { ticket } = this.props;

    return (
      <div className="p-3">
        <div>
          <div>Quantidade de Jogos: {ticket.options.length}</div>
          <div>Cotação: {ticket.totalQuote.toFixed(2)}</div>
          <div>
            <span>Valor Apostado:</span>
            <NumberFormat
              decimalSeparator=","
              value={ticket.value / 100}
              prefix={'R$ '}
              displayType={'text'}
              fixedDecimalScale
              decimalScale={2}
            />
          </div>
          <div>
            <span>Possível Retorno:</span>
            <NumberFormat
              decimalSeparator=","
              value={ticket.expectedReturn / 100}
              prefix={'R$ '}
              displayType={'text'}
              fixedDecimalScale
              decimalScale={2}
            />
          </div>
          {ticket.result && (
            <div>
              <span>Resultado:</span>
              <span>{this.getTicketResult(ticket.result)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    const { loading, error, ticket } = this.props;

    if (!this.state.ready || loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
      <>
        <div
          className="m-3 border border-dark"
          style={{ backgroundColor: '#F8ECC2', fontFamily }}
        >
          {this.renderHeader()}

          {ticket.options.map((option, optionIndex) => (
            <div key={optionIndex + 1} className="mb-3 p-3 border-bottom">
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

          <hr />

          {this.renderFooter()}

          <hr />

          {this.renderSetResult()}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ticket: state.ticket.data,
    loading: state.ticket.loading,
    error: state.ticket.error,
    loadingSetTicket: state.ticket.loadingSetTicket,
    errorSetTicket: state.ticket.errorSetTicket,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTicket: (id, callback) => dispatch(getTicket(id), callback()),
    setTicketResult: (id, result) => dispatch(setTicketResult(id, result)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(TicketContainer);
