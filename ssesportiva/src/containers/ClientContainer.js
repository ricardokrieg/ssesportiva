import React from 'react';
import { connect } from 'react-redux';
import { getClient } from '../actions/client';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import NumberFormat from 'react-number-format';

class ClientContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    const {
      getClient,
      match: {
        params: { id },
      },
    } = this.props;

    getClient(id, () => {
      this.setState({ ready: true });
    });
  }

  render() {
    const { client, loading, error } = this.props;

    if (!this.state.ready || loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
      <div className="m-3">
        <div className="text-center mb-3">
          <div className="border rounded p-3 mb-3">
            <h3 className="text-center">{client.name}</h3>

            <hr />

            <table className="table">
              <tbody>
                <tr>
                  <td>Apostas</td>
                  <td>{client.ticketCount}</td>
                </tr>
                <tr>
                  <td>Apostas Ganhadoras</td>
                  <td>{client.winTicketCount}</td>
                </tr>
                <tr>
                  <td>Valor Apostado</td>
                  <td>
                    <NumberFormat
                      decimalSeparator=","
                      value={client.in / 100}
                      prefix={'R$ '}
                      displayType={'text'}
                      fixedDecimalScale
                      decimalScale={2}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Total de Prêmios</td>
                  <td>
                    <NumberFormat
                      decimalSeparator=","
                      value={client.out / 100}
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
    getClient: (id, callback) => dispatch(getClient(id), callback()),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ClientContainer);
