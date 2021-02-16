import React from 'react';
import { connect } from 'react-redux';
import { getPendingTickets } from '../actions/pending_ticket';
import Loading from '../components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { isNull, isEmpty, filter, reject } from 'lodash';
import { Link } from 'react-router-dom';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { createSelector } from 'reselect';

const MIN_MINUTES_BEFORE_RESULT = 120; // 2 hours

const ticketsSelector = (state) => state.pendingTicket.data;

const pendingTicketsSelector = createSelector(ticketsSelector, (tickets) =>
  filter(tickets, isPendingTicket)
);
const blockedTicketsSelector = createSelector(ticketsSelector, (tickets) =>
  reject(tickets, isPendingTicket)
);

const isPendingTicket = (ticket) => {
  for (let option of ticket.options) {
    const dateDiff = moment() - moment(option.gameDate, 'DD/MM/YYYY HH:mm');
    const dateDiffMinutes = dateDiff / 1000 / 60;

    if (dateDiffMinutes < MIN_MINUTES_BEFORE_RESULT) {
      return false;
    }
  }

  return true;
};

const isValidUser = (auth, user) => {
  return auth && !auth.isEmpty && !isNull(user);
};

const isAdminUser = (auth, user) => {
  return isValidUser(auth, user) && user.admin;
};

class PendingTicketsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    const { getPendingTickets, auth, user } = this.props;

    if (isAdminUser(auth, user)) {
      getPendingTickets(() => {
        this.setState({ ready: true });
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { getPendingTickets, auth, user } = this.props;

    if (
      !isAdminUser(prevProps.auth, prevProps.user) &&
      isAdminUser(auth, user)
    ) {
      getPendingTickets(() => {
        this.setState({ ready: true });
      });
    }
  }

  getTicketDate(ticket) {
    return moment(ticket.createdAt._seconds * 1000).format('DD/MM/YYYY HH:mm');
  }

  getPendingDate(ticket) {
    let date = null;

    for (let option of ticket.options) {
      const gameDate = moment(option.gameDate, 'DD/MM/YYYY HH:mm');

      if (isNull(date) || gameDate > date) {
        date = gameDate;
      }
    }

    if (isNull(date)) return 'Data inválida';

    return date
      .add(MIN_MINUTES_BEFORE_RESULT, 'minutes')
      .format('DD/MM/YYYY HH:mm');
  }

  renderPendingTickets() {
    const { pendingTickets } = this.props;

    if (isEmpty(pendingTickets)) {
      return <div className="text-center mt-3">Nenhum bilhete pronto</div>;
    }

    return this.renderTickets(pendingTickets);
  }

  renderBlockedTickets() {
    const { blockedTickets } = this.props;

    if (isEmpty(blockedTickets)) {
      return <div className="text-center mt-3">Nenhum bilhete bloqueado</div>;
    }

    return this.renderTickets(blockedTickets);
  }

  renderTickets(tickets) {
    return (
      <>
        {tickets.map((ticket, index) => (
          <div className="shadow-sm p-3 mb-2 bg-white rounded" key={index + 1}>
            <Link to={`/bilhete/${ticket.ticketCode}`}>
              <h5 className="text-center">{ticket.ticketCode}</h5>

              <div className="d-flex justify-content-between">
                <div>
                  <div>Colaborador: {ticket.confirmedByName}</div>
                  <div>Cliente: {ticket.name}</div>
                  <div>{this.getTicketDate(ticket)}</div>
                </div>

                <div>
                  <div>
                    <NumberFormat
                      value={ticket.value / 100}
                      decimalSeparator=","
                      prefix={'R$ '}
                      displayType={'text'}
                      fixedDecimalScale
                      decimalScale={2}
                    />
                    <FontAwesomeIcon
                      icon={faLongArrowAltRight}
                      className="mx-3"
                    />
                    <NumberFormat
                      value={ticket.expectedReturn / 100}
                      decimalSeparator=","
                      prefix={'R$ '}
                      displayType={'text'}
                      fixedDecimalScale
                      decimalScale={2}
                    />
                  </div>
                  <div>Desbloqueia:</div>
                  <div>{this.getPendingDate(ticket)}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </>
    );
  }

  render() {
    const { loading } = this.props;

    if (!this.state.ready || loading) return <Loading />;

    return (
      <div className="m-3">
        <div className="text-center mb-3">
          <h4>Bilhetes Prontos</h4>
          <small>
            (Esses bilhetes já estão prontos para receber o resultado)
          </small>
        </div>

        {this.renderPendingTickets()}

        <hr />

        <div className="text-center mb-3">
          <h4>Bilhetes Bloqueados</h4>
          <small>(Esses bilhetes ainda não podem ser encerrados)</small>
        </div>

        {this.renderBlockedTickets()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    user: state.auth.user,
    loading: state.pendingTicket.loading,
    pendingTickets: pendingTicketsSelector(state),
    blockedTickets: blockedTicketsSelector(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPendingTickets: (callback) => dispatch(getPendingTickets(), callback()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingTicketsContainer);
