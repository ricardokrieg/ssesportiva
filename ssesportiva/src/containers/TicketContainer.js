import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';

import { getTicket } from '../actions/ticket';
import Loading from '../components/Loading';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

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

  render() {
    const { loading } = this.props;

    if (loading) return <Loading />;

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
    ticket: state.ticket.ticket,
    loading: state.ticket.loading,
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
