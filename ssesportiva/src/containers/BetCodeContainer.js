import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import Error from '../components/Error';
import { isEmpty } from 'lodash';

class BetCodeContainer extends React.Component {
  render() {
    const { code } = this.props;

    if (!code || isEmpty(code))
      return <Error error={'Código não encontrado'} />;

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

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(BetCodeContainer);
