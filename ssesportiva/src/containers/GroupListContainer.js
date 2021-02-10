import React, { useContext } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronCircleUp,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

import { getGroups } from '../actions/groups';
import {
  Accordion,
  AccordionContext,
  useAccordionToggle,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import Error from '../components/Error';

const Group = styled.div``;

const Championships = styled.div``;

const Championship = styled.div``;

const Toggle = ({ children, eventKey, callback }) => {
  const currentEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <div
      className="d-flex justify-content-between p-3"
      onClick={decoratedOnClick}
    >
      {children}
      <FontAwesomeIcon
        icon={isCurrentEventKey ? faChevronCircleUp : faChevronDown}
      />
    </div>
  );
};

class GroupListContainer extends React.Component {
  componentDidMount() {
    const { loadedAt, getGroups } = this.props;

    const tenMinutes = 10 * 60 * 1000;
    if (!loadedAt || moment().diff(loadedAt) > tenMinutes) {
      getGroups();
    }
  }

  getChampionshipNames(group) {
    return group.championships.map((c) => c.title).join(', ');
  }

  render() {
    const { loading, error, groups } = this.props;

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
      <Accordion>
        {groups.map((group, index) => (
          <Group className="mx-1 mb-2 border rounded" key={index + 1}>
            <Toggle eventKey={index + 1}>{group.name}</Toggle>

            <Accordion.Collapse eventKey={index + 1}>
              <Championships className="bg-light rounded p-3 mt-2">
                {group.championships.map((championship, championshipIndex) => (
                  <Link
                    key={index + '-' + championshipIndex}
                    to={'/campeonato/' + championship.id}
                  >
                    <div className="shadow-sm p-3 mb-2 bg-white rounded">
                      {championship.title}
                    </div>
                  </Link>
                ))}
              </Championships>
            </Accordion.Collapse>
          </Group>
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
    loadedAt: state.groups.loadedAt,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGroups: () => dispatch(getGroups()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupListContainer);
