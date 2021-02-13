import React from 'react';
import { connect } from 'react-redux';
import { signin } from '../actions/auth';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';

let Login = ({ dispatch }) => {
  let email, password;

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.value.trim() || !password.value.trim()) {
          return;
        }
        dispatch(signin(email.value, password.value));
        email.value = '';
        password.value = '';
      }}
    >
      <Form.Group controlId="formBasicEmail">
        <InputGroup className="mb-3">
          <Form.Control
            type="email"
            placeholder="Email"
            ref={(node) => {
              email = node;
            }}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <Form.Control
            type="password"
            placeholder="Password"
            ref={(node) => {
              password = node;
            }}
          />
        </InputGroup>

        <div className="text-center">
          <Button size="lg" type="submit">
            <FontAwesomeIcon icon={faKey} />
            <span className="ms-2">Entrar</span>
          </Button>
        </div>
      </Form.Group>
    </Form>
  );
};
Login = connect()(Login);

export default Login;
