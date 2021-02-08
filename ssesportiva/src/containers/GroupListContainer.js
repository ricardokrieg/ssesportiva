import React from 'react';
import { connect } from 'react-redux';

import GroupList from '../components/GroupList';
import { getGroups } from '../actions/groups';

class GroupListContainer extends React.Component {
  componentDidMount() {
    if (!this.props.loaded) {
      this.props.getGroups();
    }
  }

  render() {
    const { loading, error, groups } = this.props;

    if (loading) return <div>carregando</div>;
    if (error) return <div>{error.message}</div>;

    return <GroupList groups={groups} />;
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.groups.data,
    error: state.groups.error,
    loading: state.groups.loading,
    loaded: state.groups.loaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGroups: () => dispatch(getGroups()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupListContainer);
