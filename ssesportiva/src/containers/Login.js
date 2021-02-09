import React from 'react';
import { connect } from 'react-redux';
import { signin } from '../actions/auth';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

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
        <InputGroup>
          <Form.Control
            type="email"
            placeholder="Email"
            ref={(node) => {
              email = node;
            }}
          />
          <Form.Control
            type="password"
            placeholder="Password"
            ref={(node) => {
              password = node;
            }}
          />
          <InputGroup.Append>
            <Button type="submit">Entrar</Button>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
    </Form>
  );
};
Login = connect()(Login);

export default Login;
