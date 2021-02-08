import React from 'react';
import { connect } from 'react-redux';
import { signin } from '../actions/auth';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

let Login = ({ dispatch }) => {
  let input;

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        if (!input.value.trim()) {
          return;
        }
        dispatch(signin(input.value, '12345678'));
        input.value = '';
      }}
    >
      <Form.Group controlId="formBasicEmail">
        <InputGroup>
          <Form.Control
            type="email"
            placeholder="Email"
            ref={(node) => {
              input = node;
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
