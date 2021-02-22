import React from 'react';
import { connect } from 'react-redux';
import { getClients } from '../actions/client';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class ClientsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    const { getClients } = this.props;

    getClients(() => {
      this.setState({ ready: true });
    });
  }

  render() {
    const { clients, loading, error } = this.props;

    if (!this.state.ready || loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
      <div className="m-3">
        <div className="text-center mb-3">
          <h4>Seus Clientes</h4>
        </div>

        <div className="text-center">
          <Button>
            <Link to="/cadastrar-cliente">Cadastrar Cliente</Link>
          </Button>
        </div>

        {clients.map((client, index) => (
          <div className="shadow-sm p-3 mb-2 bg-white rounded" key={index + 1}>
            <Link to={`/cliente/${client.id}`}>
              <div className="d-flex justify-content-between">
                <div>{client.name}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    clients: state.client.clients,
    loading: state.client.loadingClients,
    error: state.client.errorClients,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getClients: (callback) => dispatch(getClients(), callback()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientsContainer);
