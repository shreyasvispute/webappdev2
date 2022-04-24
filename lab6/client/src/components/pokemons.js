import React from "react";
import { Link } from "react-router-dom";

import { Container, Card, CardGroup, Button } from "react-bootstrap";

function Pokemons(data) {
  const buildCard = (e) => {
    return (
      <div key={e.id} className="col lg">
        <Card key={e.id} style={{ width: "18rem" }}>
          <Card.Img alt={e.name} variant="top" src={e.image} />
          <Card.Body>
            <Card.Title>{e.name}</Card.Title>
          </Card.Body>
          <Card.Body></Card.Body>
        </Card>
      </div>
    );
  };

  if (data) {
    return (
      <Container>
        <CardGroup>
          {data.data.map((element) => {
            return buildCard(element);
          })}
        </CardGroup>
      </Container>
    );
  }
}

export default Pokemons;
