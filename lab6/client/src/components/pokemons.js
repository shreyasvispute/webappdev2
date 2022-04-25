import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../context/trainerContext";

import { Container, Card, CardGroup } from "react-bootstrap";
import CatchRelease from "./catchReleaseButton";

function Pokemons(data) {
  const context = useContext(AppContext);

  const buildCard = (element, trainer) => {
    return (
      <div key={element.id} className="col lg">
        <Card className="pokemonUI" key={element.id} style={{ width: "18rem" }}>
          <Card.Img alt={element.name} variant="top" src={element.image} />
          <Card.Body>
            <Link to={`/pokemon/${element.id}`}>
              <Card.Title>{element.name}</Card.Title>
            </Link>
          </Card.Body>
          <CatchRelease data={element} trainer={trainer}></CatchRelease>
        </Card>
      </div>
    );
  };

  if (data) {
    const index = context.trainers.findIndex((e) => e.selected === true);
    const trainer = context.trainers[index];

    return (
      <Container>
        <CardGroup>
          {data.data.map((element) => {
            return buildCard(element, trainer);
          })}
        </CardGroup>
      </Container>
    );
  }
}

export default Pokemons;
