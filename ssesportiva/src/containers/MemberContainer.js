import { connect } from 'react-redux';
import React from 'react';
import { isEmpty } from 'react-redux-firebase';
import Login from '../components/Login';
import User from '../components/User';
import { getMemberDetails, signout } from '../actions/auth';
import { Button } from 'react-bootstrap';
import Error from '../components/Error';
import { isNull } from 'lodash';
import Loading from '../components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';

class MemberContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    const { auth, user, getMemberDetails } = this.props;

    if (!isEmpty(auth) && !isNull(user)) {
      getMemberDetails(() => {
        this.setState({ ready: true });
      });
    } else {
      this.setState({ ready: true });
    }
  }

  signout() {
    this.props.signout();
  }

  renderContent() {
    const { auth, user } = this.props;

    if (auth.isEmpty) {
      return <Login />;
    } else {
      return (
        <div className="m-3">
          <User auth={auth} user={user} />

          <Button
            variant="danger"
            className="float-end mt-3"
            size="lg"
            onClick={() => this.signout()}
          >
            <FontAwesomeIcon icon={faKey} />
            <span className="ms-2">Sair</span>
          </Button>
        </div>
      );
    }
  }

  render() {
    const { error } = this.props;

    if (!this.state.ready) return <Loading />;
    if (error) return <Error error={error} />;

    return <div className="m-3 p-3">{this.renderContent()}</div>;
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
    getMemberDetails: (callback) => dispatch(getMemberDetails(), callback()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberContainer);
