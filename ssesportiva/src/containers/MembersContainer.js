import React from 'react';
import { connect } from 'react-redux';
import { getMembers } from '../actions/member';
import Loading from '../components/Loading';
import { isNull } from 'lodash';
import Error from '../components/Error';
import User from '../components/User';
import NumberFormat from 'react-number-format';

const isValidUser = (auth, user) => {
  return auth && !auth.isEmpty && !isNull(user);
};

const isAdminUser = (auth, user) => {
  return isValidUser(auth, user) && user.admin;
};

class MembersContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    const { getMembers, auth, user } = this.props;

    if (isAdminUser(auth, user)) {
      getMembers(() => {
        this.setState({ ready: true });
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { getMembers, auth, user } = this.props;

    if (
      !isAdminUser(prevProps.auth, prevProps.user) &&
      isAdminUser(auth, user)
    ) {
      getMembers(() => {
        this.setState({ ready: true });
      });
    }
  }

  getAuthForMember(member) {
    return {
      isEmpty: false,
      email: member.email,
    };
  }

  getUserForMember(member) {
    return member;
  }

  getWinTicketPercentage = (ticketCount, winTicketCount) => {
    const percentage = ticketCount === 0 ? 0 : winTicketCount / ticketCount;

    return (
      <NumberFormat
        decimalSeparator=","
        value={percentage * 100}
        prefix={'('}
        suffix={'%)'}
        displayType={'text'}
        fixedDecimalScale
        decimalScale={2}
      />
    );
  };

  getExpectedPercentage = (totalPercentage, ticketCount) => {
    if (ticketCount === 0) return 0;

    return (totalPercentage / ticketCount) * 100;
  };

  renderTotal() {
    const { members } = this.props;
    let totalIn = 0;
    let totalOut = 0;
    let totalCommission = 0;
    let totalTotal = 0;
    let totalTicketCount = 0;
    let totalWinTicketCount = 0;
    let totalPercentage = 0;

    for (let member of members) {
      totalIn += member.in;
      totalOut += member.out;
      totalCommission += member.commission;
      totalTotal += member.total;
      totalTicketCount += member.ticketCount;
      totalWinTicketCount += member.winTicketCount;
      totalPercentage += member.totalPercentage;
    }

    return (
      <div className="border rounded p-3 mb-3">
        <h3 className="text-center">Caixa</h3>

        <hr />

        <table className="table">
          <tbody>
            <tr>
              <td>Apostas</td>
              <td>{totalTicketCount}</td>
            </tr>
            <tr>
              <td>Apostas Ganhadoras</td>
              <td>
                {totalWinTicketCount}{' '}
                {this.getWinTicketPercentage(
                  totalTicketCount,
                  totalWinTicketCount
                )}
              </td>
            </tr>
            <tr>
              <td>Porcentagem Esperada</td>
              <td>
                <NumberFormat
                  decimalSeparator=","
                  value={this.getExpectedPercentage(
                    totalPercentage,
                    totalTicketCount
                  )}
                  suffix={'%'}
                  displayType={'text'}
                  fixedDecimalScale
                  decimalScale={2}
                />
              </td>
            </tr>
            <tr>
              <td>Entradas</td>
              <td>
                <NumberFormat
                  decimalSeparator=","
                  value={totalIn / 100}
                  prefix={'R$ '}
                  displayType={'text'}
                  fixedDecimalScale
                  decimalScale={2}
                />
              </td>
            </tr>
            <tr>
              <td>Saídas</td>
              <td>
                <NumberFormat
                  decimalSeparator=","
                  value={totalOut / 100}
                  prefix={'R$ '}
                  displayType={'text'}
                  fixedDecimalScale
                  decimalScale={2}
                />
              </td>
            </tr>
            <tr>
              <td>Comissão</td>
              <td>
                <NumberFormat
                  decimalSeparator=","
                  value={totalCommission / 100}
                  prefix={'R$ '}
                  displayType={'text'}
                  fixedDecimalScale
                  decimalScale={2}
                />
              </td>
            </tr>
            <tr>
              <td>Total</td>
              <td>
                <NumberFormat
                  decimalSeparator=","
                  value={totalTotal / 100}
                  prefix={'R$ '}
                  displayType={'text'}
                  fixedDecimalScale
                  decimalScale={2}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const { loading, error, members } = this.props;

    if (!this.state.ready || loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
      <div className="m-3">
        <div className="text-center mb-3">
          <div>{this.renderTotal()}</div>

          <div>
            {members.map((member, index) => (
              <div className="mb-3">
                <User
                  auth={this.getAuthForMember(member)}
                  user={this.getUserForMember(member)}
                  showWinPercentage
                  key={index}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    user: state.auth.user,
    members: state.member.data,
    loading: state.member.loading,
    error: state.member.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMembers: (callback) => dispatch(getMembers(), callback()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MembersContainer);
