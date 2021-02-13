import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from 'lodash';
import Loading from '../components/Loading';
import { compose } from 'redux';
import { withRouter } from 'react-router';

class BetCodeContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    const { code } = this.props;

    if (!code || isEmpty(code)) {
      this.props.history.replace('/');
    } else {
      this.setState({ ready: true });
    }
  }

  render() {
    const { code } = this.props;

    if (!this.state.ready) return <Loading />;

    return (
      <div className="bg-success text-white vh-100 text-center p-5">
        <FontAwesomeIcon icon={faThumbsUp} size="4x" />
        <h1 className="m-3">Sua aposta foi enviada com sucesso!</h1>
        <div
          className="my-5 badge text-success bg-white"
          style={{ fontSize: '2.5rem' }}
        >
          {code}
        </div>
        <h2 className="m-3">
          Informe esse código para o cambista para que ele aprove sua aposta
        </h2>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    code: state.bet.code,
  };
};

export default compose(withRouter, connect(mapStateToProps))(BetCodeContainer);
