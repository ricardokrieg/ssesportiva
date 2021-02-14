import React, { useContext } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronCircleUp,
} from '@fortawesome/free-solid-svg-icons';
import { getGroups } from '../actions/groups';
import {
  Accordion,
  AccordionContext,
  useAccordionToggle,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { concat } from 'lodash';
import moment from 'moment';

const getWeekDay = (date) => {
  const weekDay = moment(date).day();

  return ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][
    weekDay
  ];
};

const Group = styled.div``;

const Championships = styled.div``;

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
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    const { getGroups } = this.props;

    this.setState({ ready: false });

    getGroups(() => {
      this.setState({ ready: true });
      this.setDayGames();
    });
  }

  setDayGames() {
    const championships = [
      { title: getWeekDay(moment()), date: moment().format('YYYY-MM-DD') },
      {
        title: getWeekDay(moment().add(1, 'day')),
        date: moment().add(1, 'day').format('YYYY-MM-DD'),
      },
      {
        title: getWeekDay(moment().add(2, 'day')),
        date: moment().add(2, 'day').format('YYYY-MM-DD'),
      },
    ];
    const dayGames = [
      {
        name: 'Jogos do Dia',
        championships,
      },
    ];

    this.setState({ dayGames });
  }

  getChampionshipNames(group) {
    return group.championships.map((c) => c.title).join(', ');
  }

  getChampionshipLink(championship) {
    if (championship.id) return '/campeonato/' + championship.id;
    if (championship.date) return '/jogos-por-data/' + championship.date;

    return null;
  }

  render() {
    const { loading, error, groups } = this.props;

    if (!this.state.ready || loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
      <Accordion className="mt-3">
        {concat(this.state.dayGames, groups).map((group, index) => (
          <Group className="mx-1 mb-2 border rounded" key={index + 1}>
            <Toggle eventKey={index + 1}>{group.name}</Toggle>

            <Accordion.Collapse eventKey={index + 1}>
              <Championships className="bg-light rounded p-3 mt-2">
                {group.championships.map((championship, championshipIndex) => (
                  <Link
                    key={index + '-' + championshipIndex}
                    to={this.getChampionshipLink(championship)}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGroups: (callback) => dispatch(getGroups(), callback()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupListContainer);
