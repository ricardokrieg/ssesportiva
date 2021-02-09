import React from 'react';
import { connect } from 'react-redux';

import { getGroups } from '../actions/groups';
import { Accordion, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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

    return (
      <Accordion>
        {groups.map((group, index) => (
          <Card key={index + 1}>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey={index + 1}>
                {group.name}
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey={index + 1}>
              <Card.Body>
                {group.championships.map((championship, championshipIndex) => (
                  <Link
                    key={index + '-' + championshipIndex}
                    to={'/campeonato/' + championship.id}
                  >
                    {championship.title}
                  </Link>
                ))}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    );
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
