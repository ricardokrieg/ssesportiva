import React from 'react';
import PropTypes from 'prop-types';
import { isNull } from 'lodash';
import NumberFormat from 'react-number-format';
import Loading from './Loading';

const User = ({ auth, user }) => {
  if (auth.isEmpty) return null;
  if (isNull(user)) return <Loading />;

  const userStatus = (status) => {
    if (status.toLowerCase() === 'ok') {
      return <span className="badge text-white bg-primary">OK</span>;
    } else {
      return <span className="text-warning">{status}</span>;
    }
  };

  return (
    <div className="border rounded p-3">
      <h3 className="text-center">{auth.email}</h3>

      <hr />

      <table className="table">
        <tbody>
          <tr>
            <td>Nome</td>
            <td>{user.name}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{userStatus(user.status)}</td>
          </tr>
          <tr>
            <td>Entradas</td>
            <td>
              <NumberFormat
                decimalSeparator=","
                value={user.in / 100}
                prefix={'R$ '}
                displayType={'text'}
                fixedDecimalScale
                decimalScale={2}
              />
            </td>
          </tr>
          <tr>
            <td>Saídas</td>
            <td>
              <NumberFormat
                decimalSeparator=","
                value={user.out / 100}
                prefix={'R$ '}
                displayType={'text'}
                fixedDecimalScale
                decimalScale={2}
              />
            </td>
          </tr>
          <tr>
            <td>Comissão</td>
            <td>
              <NumberFormat
                decimalSeparator=","
                value={user.commission / 100}
                prefix={'R$ '}
                displayType={'text'}
                fixedDecimalScale
                decimalScale={2}
              />
            </td>
          </tr>
          <tr>
            <td>Total</td>
            <td>
              <NumberFormat
                decimalSeparator=","
                value={user.total / 100}
                prefix={'R$ '}
                displayType={'text'}
                fixedDecimalScale
                decimalScale={2}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

User.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object,
};

export default User;
