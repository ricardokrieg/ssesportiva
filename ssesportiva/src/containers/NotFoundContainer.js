import React from 'react';
import { withRouter } from 'react-router';
import { compose } from 'redux';

class NotFoundContainer extends React.Component {
  componentDidMount() {
    this.props.history.replace('/');
  }

  render() {
    return null;
  }
}

export default compose(withRouter)(NotFoundContainer);
