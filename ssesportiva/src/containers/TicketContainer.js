import React from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import Form from 'react-bootstrap/Form';
import Loading from '../components/Loading';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { getTicket } from '../actions/ticket';
import { isNull } from 'lodash';
import Error from '../components/Error';
import moment from 'moment';

const fontFamily =
  'Montserrat, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

class TicketContainer extends React.Component {
  componentDidMount() {
    const {
      getTicket,
      match: {
        params: { id },
      },
    } = this.props;

    if (id) {
      getTicket(id);
    }
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
        </div>
      </div>
    );
  }

  render() {
    const { loading, error, ticket } = this.props;

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;

    if (isNull(ticket)) {
      return <Error error={'Ocorreu um erro'} />;
    }

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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTicket: (id) => dispatch(getTicket(id)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(TicketContainer);
