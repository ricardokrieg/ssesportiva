import React from 'react';
import { connect } from 'react-redux';
import { getPendingBet, clearPendingBet } from '../actions/pending_bet';
import { getConfirmedBets } from '../actions/confirmed_bet';
import Loading from '../components/Loading';
import { Form, Button, Row, Col, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { isEmpty, isNull } from 'lodash';
import { Link } from 'react-router-dom';

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
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (isNull(prevProps.pendingBet) && !isNull(this.props.pendingBet)) {
      this.props.history.push(`/aposta/${this.props.pendingBet.code}`);
    }

    // if (!isValidUser(prevProps.auth, prevProps.user) && isValidUser(this.props.auth, this.props.user)) {
    //   this.props.getConfirmedBets();
    // }
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
            {confirmedBets.map((bet, index) => (
              <div
                className="shadow-sm p-3 mb-2 bg-white rounded"
                key={index + 1}
              >
                <div>
                  <Link to={`/bilhete/${bet.ticketCode}`}>{bet.createdAt}</Link>
                </div>
                <div>{bet.createdAt}</div>
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
