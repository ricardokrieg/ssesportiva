import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { getTicket, clearTicket } from '../actions/ticket';
import Loading from '../components/Loading';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { isNull } from 'lodash';

class SearchTicketContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    const { clearTicket } = this.props;

    this.setState({ ready: false });

    clearTicket(() => {
      this.setState({ ready: true });
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (isNull(prevProps.ticket) && !isNull(this.props.ticket)) {
      this.props.history.push(`/bilhete/${this.props.ticket.ticketCode}`);
    }
  }

  render() {
    const { loading } = this.props;

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
              this.props.getTicket(this.input.value);
              this.input.value = '';
            }}
          >
            <Form.Group controlId="code" className="mt-2">
              <Form.Label>Código do Bilhete</Form.Label>
              <Form.Control
                onChange={() => {
                  this.input.value = this.input.value.toUpperCase();
                }}
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
    ticket: state.ticket.data,
    loading: state.ticket.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTicket: (id) => dispatch(getTicket(id)),
    clearTicket: (callback) => dispatch(clearTicket(), callback()),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SearchTicketContainer);
