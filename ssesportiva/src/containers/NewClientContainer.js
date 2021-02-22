import React from 'react';
import { connect } from 'react-redux';
import { addClient } from '../actions/client';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { isNull } from 'lodash';

class NewClientContainer extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { client } = this.props;

    if (isNull(prevProps.client) && !isNull(client)) {
      this.props.history.push(`/clientes`);
    }
  }

  render() {
    const { loading, error } = this.props;

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
      <div className="m-3">
        <div className="text-center mb-3">
          <h4>Cadastrar Cliente</h4>

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              if (!this.name.value.trim()) {
                return;
              }
              this.props.addClient(this.name.value);
            }}
          >
            <Form.Group controlId="formBasicEmail">
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Nome do Cliente"
                  ref={(node) => {
                    this.name = node;
                  }}
                />
              </InputGroup>

              <div className="text-center">
                <Button size="lg" type="submit">
                  <FontAwesomeIcon icon={faUsers} />
                  <span className="ms-2">Cadastrar</span>
                </Button>
              </div>
            </Form.Group>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    client: state.client.client,
    loading: state.client.loadingClient,
    error: state.client.errorClient,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addClient: (name) => dispatch(addClient(name)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(NewClientContainer);
