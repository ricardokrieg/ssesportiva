import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Championship = ({ championship }) => {
  return (
    <div>
      {championship.games.map((game, index) => (
        <Card key={index + 1}>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey={index + 1}>
              <Link to={'/jogo/' + game.id}>
                {game.title} {game.date}
              </Link>
            </Accordion.Toggle>
          </Card.Header>
          <Card.Body>
            <div>{game.quote.type}</div>
            <div>
              {game.quote.options.map((option, optionIndex) => (
                <div>
                  <div>{option.id}</div>
                  <div>{option.title}</div>
                  <div>{option.quote}</div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

Championship.propTypes = {
  championship: PropTypes.object.isRequired,
};

export default Championship;
