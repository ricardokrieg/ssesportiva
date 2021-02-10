import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';

import { getTicket } from '../actions/ticket';

class TicketContainer extends React.Component {
  componentDidMount() {
    const {
      getTicket,
      match: {
        params: { id },
      },
    } = this.props;

    if (id) {
      getTicket(id);
    } else {
      getTicket('asdf');
    }
  }

  render() {
    return <div></div>;
  }
}

const mapStateToProps = (state) => {
  return {
    ticket: state.ticket,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTicket: (id) => dispatch(getTicket(id)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(TicketContainer);
