import axios from "axios";
import md5 from "blueimp-md5";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Container,
  ListGroup,
  ListGroupItem,
  Spinner,
  CardGroup,
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

  let params = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        let id = params.id;
        const url = `${baseUrl}/${id}?ts=${ts}&apikey=${publickey}&hash=${hash}`;
        const { data } = await axios.get(url);
        setApiData(data.data.results[0]);
        setLoading(false);
        console.log(data.data.results[0]);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [params.id]);

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
        {apiData && (
          <Card key={apiData.id}>
            <Card.Title className="title">{apiData.title}</Card.Title>
            <Card.Img
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
            <Card.Title>Creators</Card.Title>

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

            <Card.Footer className="text-muted">© 2022 MARVEL</Card.Footer>
          </Card>
        )}
      </Container>
    );
  }
};

export default Hero;
