import axios from "axios";
import md5 from "blueimp-md5";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "./notfound";

import {
  Card,
  Container,
  ListGroup,
  ListGroupItem,
  Spinner,
  Row,
} from "react-bootstrap";
import "../styles/hero.css";

const publickey = "be3f31438c0d0dca365602ae44e1256e";
const privatekey = "943eee94a11e331175bd7a9dbab6650308c4fab6";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public/characters";

const Hero = () => {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(false);

  let params = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        let id = params.id;
        if (id === "") {
          setPageError(true);
          return;
        }

        const url = `${baseUrl}/${id}?ts=${ts}&apikey=${publickey}&hash=${hash}`;
        const { data } = await axios.get(url);
        setApiData(data.data.results[0]);
        setLoading(false);
        console.log(data.data.results[0]);
      } catch (error) {
        setPageError(true);

        console.log(error);
      }
    };

    getData();
  }, [params.id]);

  if (pageError) {
    return (
      <>
        <NotFound></NotFound>
      </>
    );
  } else {
    if (loading) {
      return (
        <div>
          <Container>
            <Spinner animation="border" variant="danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Container>
        </div>
      );
    } else {
      return (
        <Container>
          <Row className="titleAlign">
            <h1>
              <span className="marvel">Marvel</span> Characters
            </h1>
          </Row>

          {apiData && (
            <Card>
              <Card.Title className="title card-title-inner">
                {apiData.name}
              </Card.Title>
              <Card.Img
                alt={apiData.name}
                className="cardImg"
                variant="top"
                src={apiData.thumbnail.path + "." + apiData.thumbnail.extension}
              />

              <Card.Body className="description">
                {apiData.description ? (
                  <Card.Text>{apiData.description}</Card.Text>
                ) : (
                  <Card.Text>No description found</Card.Text>
                )}
              </Card.Body>
              <Card.Title className="card-title-inner">Comics</Card.Title>

              {apiData &&
              apiData.comics.items &&
              apiData.comics.items.length > 1 ? (
                <ListGroup className="list-group-flush">
                  {apiData.comics.items.map((comic, i) => {
                    return <ListGroupItem key={i}>{comic.name}</ListGroupItem>;
                  })}
                </ListGroup>
              ) : (
                <ListGroup className="list-group-flush">
                  <ListGroupItem>N/A</ListGroupItem>
                </ListGroup>
              )}
              <Card.Title className="card-title-inner">Series</Card.Title>

              {apiData &&
              apiData.series.items &&
              apiData.series.items.length > 1 ? (
                <ListGroup className="list-group-flush">
                  {apiData.series.items.map((series, i) => {
                    return <ListGroupItem key={i}>{series.name}</ListGroupItem>;
                  })}
                </ListGroup>
              ) : (
                <ListGroup className="list-group-flush">
                  <ListGroupItem>N/A</ListGroupItem>
                </ListGroup>
              )}

              <Card.Footer className="text">© 2022 MARVEL</Card.Footer>
            </Card>
          )}
        </Container>
      );
    }
  }
};

export default Hero;
