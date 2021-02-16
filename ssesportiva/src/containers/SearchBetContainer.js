import React from 'react';
import { connect } from 'react-redux';
import { getPendingBet, clearPendingBet } from '../actions/pending_bet';
import { getConfirmedBets } from '../actions/confirmed_bet';
import Loading from '../components/Loading';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faLongArrowAltRight,
} from '@fortawesome/free-solid-svg-icons';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { isEmpty, isNull } from 'lodash';
import { Link } from 'react-router-dom';
import moment from 'moment';
import NumberFormat from 'react-number-format';

const isValidUser = (auth, user) => {
  return auth && !auth.isEmpty && !isNull(user);
};

class SearchBetContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    const { clearPendingBet, getConfirmedBets, auth, user } = this.props;

    this.setState({ ready: false });

    clearPendingBet(() => {
      this.setState({ ready: true });
    });

    if (isValidUser(auth, user)) {
      getConfirmedBets();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { pendingBet, getConfirmedBets, auth, user } = this.props;

    if (isNull(prevProps.pendingBet) && !isNull(pendingBet)) {
      this.props.history.push(`/aposta/${pendingBet.code}`);
    }

    if (
      !isValidUser(prevProps.auth, prevProps.user) &&
      isValidUser(auth, user)
    ) {
      getConfirmedBets();
    }
  }

  getTicketDate(ticket) {
    return moment(ticket.createdAt._seconds * 1000).format('DD/MM/YYYY HH:mm');
  }

  getTicketStatus(ticket) {
    if (ticket.status === 'win') return 'Ganhou';
    if (ticket.status === 'loss') return 'Perdeu';

    return 'Em Aberto';
  }

  renderConfirmedBets() {
    const { confirmedBets, loadingConfirmedBets } = this.props;

    return (
      <div className="m-3">
        <hr />

        <h4 className="text-center">Apostas aprovadas</h4>

        {loadingConfirmedBets ? (
          <Loading />
        ) : isEmpty(confirmedBets) ? (
          <div className="text-center mt-3">
            Você ainda não aprovou nenhuma aposta
          </div>
        ) : (
          <div>
            {confirmedBets.map((ticket, index) => (
              <div
                className="shadow-sm p-3 mb-2 bg-white rounded"
                key={index + 1}
              >
                <Link to={`/bilhete/${ticket.ticketCode}`}>
                  <h5 className="text-center">{ticket.ticketCode}</h5>

                  <div className="d-flex justify-content-between">
                    <div>
                      <div>Cliente: {ticket.name}</div>
                      <div>{this.getTicketDate(ticket)}</div>
                    </div>

                    <div>
                      <div>Status: {this.getTicketStatus(ticket)}</div>
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
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  render() {
    const { loading, getPendingBet } = this.props;

    if (!this.state.ready || loading) return <Loading />;

    return (
      <>
        <div className="d-flex justify-content-center">
          <div className="m-3 mt-5 text-center w-50">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                if (!this.input.value.trim()) {
                  return;
                }
                getPendingBet(this.input.value);
                this.input.value = '';
              }}
            >
              <Form.Group controlId="code" className="mt-2">
                <Form.Label>Código da Aposta</Form.Label>
                <Form.Control
                  ref={(node) => {
                    this.input = node;
                  }}
                  type="text"
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="text-white mt-3"
              >
                <FontAwesomeIcon icon={faSearch} color="white" />
                <span className="ms-3">Procurar</span>
              </Button>
            </Form>
          </div>
        </div>

        <>{this.renderConfirmedBets()}</>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    user: state.auth.user,
    pendingBet: state.pendingBet.data,
    loading: state.pendingBet.loading,
    confirmedBets: state.confirmedBet.data,
    loadingConfirmedBets: state.confirmedBet.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPendingBet: (code) => dispatch(getPendingBet(code)),
    clearPendingBet: (callback) => dispatch(clearPendingBet(), callback()),
    getConfirmedBets: () => dispatch(getConfirmedBets()),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SearchBetContainer);
