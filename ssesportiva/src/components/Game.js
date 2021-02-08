import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

const Game = ({ game }) => {
  return (
    <div>
      {game.quotes.map((quote, index) => (
        <Card key={index + 1}>
          <Card.Header>{quote.type}</Card.Header>
          <Card.Body>
            <div>
              {quote.options.map((option, optionIndex) => (
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

Game.propTypes = {
  championship: PropTypes.object.isRequired,
};

export default Game;
