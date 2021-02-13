import React from 'react';
import { connect } from 'react-redux';
import { getPendingBet, clearPendingBet } from '../actions/pending_bet';
import Loading from '../components/Loading';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { isNull } from 'lodash';

class SearchBetContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    const { clearPendingBet } = this.props;

    this.setState({ ready: false });

    clearPendingBet(() => {
      this.setState({ ready: true });
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (isNull(prevProps.pendingBet) && !isNull(this.props.pendingBet)) {
      this.props.history.push(`/aposta/${this.props.pendingBet.code}`);
    }
  }

  render() {
    const { loading, getPendingBet } = this.props;

    if (!this.state.ready || loading) return <Loading />;

    return (
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pendingBet: state.pendingBet.data,
    loading: state.pendingBet.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPendingBet: (code) => dispatch(getPendingBet(code)),
    clearPendingBet: (callback) => dispatch(clearPendingBet(), callback()),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SearchBetContainer);
