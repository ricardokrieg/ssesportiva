import { connect } from 'react-redux';
import User from '../components/User';

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    user: state.auth.user,
    error: state.auth.error,
  };
};

const UserContainer = connect(mapStateToProps)(User);

export default UserContainer;
