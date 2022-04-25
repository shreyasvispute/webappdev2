import React, { useContext } from "react";
import AppContext from "../context/trainerContext";

import { Container, Card, CardGroup, Button } from "react-bootstrap";

function CatchRelease(data) {
  const context = useContext(AppContext);

  const handleRelease = (e, element, trainerID) => {
    e.preventDefault();
    context.trainerDispatch({
      type: "RELEASE_POKEMON",
      payload: { pokemon: element, trainerID: trainerID },
    });
  };
  const handleCatch = (e, element, trainerID) => {
    e.preventDefault();
    context.trainerDispatch({
      type: "CATCH_POKEMON",
      payload: { pokemon: element, trainerID: trainerID },
    });
  };

  if (data) {
    const catched = data.trainer.pokemon.some((e) => e.id === data.data.id);

    return (
      <Card.Body>
        {catched ? (
          <Button
            variant="success"
            onClick={(e) => handleRelease(e, data.data, data.trainer.id)}
          >
            Release
          </Button>
        ) : (
          <Button
            variant="warning"
            onClick={(e) => handleCatch(e, data.data, data.trainer.id)}
          >
            Catch
          </Button>
        )}
      </Card.Body>
    );
  }
}

export default CatchRelease;
