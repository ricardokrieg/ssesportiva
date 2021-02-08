import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const GroupList = ({ groups }) => {
  return (
    <Accordion>
      {groups.map((group, index) => (
        <Card key={index}>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey={index}>
              {group.name}
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey={index}>
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
};

GroupList.propTypes = {
  groups: PropTypes.array.isRequired,
};

export default GroupList;
