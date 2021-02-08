import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'redux';

import Championship from '../components/Championship';
import { getChampionship } from '../actions/championship';

class ChampionshipContainer extends React.Component {
  componentDidMount() {
    const { id } = this.props.match.params;

    this.props.getChampionship(id);
  }

  render() {
    const { loading, loaded, error, championship } = this.props;

    if (error) return <div>{error.message}</div>;
    if (loading || !loaded) return <div>carregando</div>;

    return <Championship championship={championship} />;
  }
}

const mapStateToProps = (state) => {
  return {
    championship: state.championship.data,
    error: state.championship.error,
    loading: state.championship.loading,
    loaded: state.championship.loaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getChampionship: (id) => dispatch(getChampionship(id)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ChampionshipContainer);
