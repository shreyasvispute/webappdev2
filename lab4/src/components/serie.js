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
const baseUrl = "https://gateway.marvel.com:443/v1/public/series";

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
              <span className="marvel">Marvel</span> Series
            </h1>
          </Row>

          {apiData && (
            <Card id={apiData.id} key={apiData.id}>
              <Card.Title className="title card-title-inner">
                {apiData.title}
              </Card.Title>
              <Card.Img
                alt={apiData.title}
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

              <Card.Body>
                <Card.Title className="card-title-inner">Dates</Card.Title>

                {apiData.startYear ? (
                  <Card.Text>
                    Start Year - {apiData.startYear} | End Year -{" "}
                    {apiData.endYear}
                  </Card.Text>
                ) : (
                  <Card.Text>N/A</Card.Text>
                )}
              </Card.Body>

              <Card.Title className="card-title-inner">Creators</Card.Title>

              {apiData &&
              apiData.creators.items &&
              apiData.creators.items.length >= 1 ? (
                <ListGroup className="list-group-flush">
                  {apiData.creators.items.map((creator, i) => {
                    return (
                      <ListGroupItem key={i}>
                        {creator.name} | {creator.role}
                      </ListGroupItem>
                    );
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
