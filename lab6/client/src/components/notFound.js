import React from "react";
// import background from "../img/meme.png";
import { Container, Row, Col } from "react-bootstrap";

function NotFound() {
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h1 className="center404">404, not found!</h1>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default NotFound;
