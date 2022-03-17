import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import md5 from "blueimp-md5";
import axios from "axios";

import {
  Card,
  Container,
  ListGroup,
  ListGroupItem,
  Spinner,
  CardGroup,
} from "react-bootstrap";

function Comics() {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  let params = useParams();

  useEffect(() => {
    const getData = async () => {
      const publickey = "be3f31438c0d0dca365602ae44e1256e";
      const privatekey = "943eee94a11e331175bd7a9dbab6650308c4fab6";
      const ts = new Date().getTime();
      const stringToHash = ts + privatekey + publickey;
      const hash = md5(stringToHash);
      const baseUrl = "https://gateway.marvel.com:443/v1/public/comics";
      const url =
        baseUrl + "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;
      const { data } = await axios.get(url);
      setApiData(data);
      setLoading(false);
    };
    getData();
  }, []);
  console.log(apiData);
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
        <CardGroup>
          {apiData.data &&
            apiData.data.results.map((comicsData) => (
              <div className="col sm-4">
                <Card id={comicsData.id} style={{ width: "18rem" }}>
                  <Card.Img
                    variant="top"
                    src={comicsData.thumbnail.path + ".jpg"}
                  />
                  <Card.Body>
                    <Card.Title>{comicsData.title}</Card.Title>
                    <Card.Text>{comicsData.description}</Card.Text>
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    <ListGroupItem>Cras justo odio</ListGroupItem>
                    <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
                    <ListGroupItem>Vestibulum at eros</ListGroupItem>
                  </ListGroup>
                  <Card.Body>
                    {/* <Link href="#">Card Link</Link>
        <Link href="#">Another Link</Link> */}
                  </Card.Body>
                </Card>
              </div>
            ))}
        </CardGroup>
      </Container>
    );
  }
}

export default Comics;
