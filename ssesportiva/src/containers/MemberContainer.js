import { connect } from 'react-redux';
import React from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { isEmpty } from 'react-redux-firebase';
import Login from './Login';
import User from '../components/User';
import { signout } from '../actions/auth';
import { Button } from 'react-bootstrap';

class MemberContainer extends React.Component {
  signout() {
    this.props.signout();
  }

  render() {
    const { auth, user, error } = this.props;

    if (isEmpty(auth)) {
      return <Login />;
    }

    // TODO need to refresh member details (when?)

    return (
      <div>
        <User auth={auth} user={user} error={error} />

        <Button onClick={() => this.signout()}>Sair</Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    user: state.auth.user,
    error: state.auth.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signout: () => dispatch(signout()),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MemberContainer);
