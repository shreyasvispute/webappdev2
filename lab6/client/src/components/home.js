import React from "react";
import { Link } from "react-router-dom";

import { Container, Row, Col } from "react-bootstrap";

function Home() {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Welcome to Pokemon</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>You will be able to catch different pokemon and form teams</p>
          <p>
            To get started with exploring Pokemon click here{" "}
            <Link to="pokemon/page/0">Explore Pokemon</Link>
          </p>
          <p>
            To get started with creating trainers and catching Pokemon, click
            here <Link to="trainers">Explore Trainers</Link>
          </p>
          <p>
            To search your favorite Pokemon and add to your team, click here{" "}
            <Link to="search">Search</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
