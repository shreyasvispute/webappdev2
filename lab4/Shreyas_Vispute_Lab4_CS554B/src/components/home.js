import React from "react";
import { Link } from "react-router-dom";

import characterImg from "../img/1.jpg";
import comicImg from "../img/2.jpg";
import seriesImg from "../img/3.jpg";

import { Card, Container, Spinner, CardGroup, Row, Col } from "react-bootstrap";
// //import marvel from "../img/wp2436369.jpg";
import HomeCss from "../styles/home.css";

function Home() {
  return (
    <Container className="home">
      <Row></Row>
      <Row>
        <Col>
          <Row>
            <img
              className="homeimg"
              alt="characterImage"
              src={characterImg}
            ></img>
          </Row>
          <Row>
            <div>
              <Link to="/characters/page/0"> Explore Characters</Link>
            </div>
          </Row>
        </Col>
        <Col>
          <Row>
            <img className="homeimg" alt="comicImage" src={comicImg}></img>
          </Row>
          <Row>
            <div>
              <Link to="/comics/page/0"> Explore Comics</Link>
            </div>
          </Row>
        </Col>
        <Col>
          <Row>
            <img className="homeimg" alt="seriesImage" src={seriesImg}></img>
          </Row>
          <Row>
            <div>
              <Link to="/series/page/0"> Explore Series</Link>
            </div>
          </Row>
        </Col>
      </Row>
      <Row>
        <Card.Footer className="footertext">© 2022 MARVEL</Card.Footer>
      </Row>
    </Container>
  );
}
export default Home;
