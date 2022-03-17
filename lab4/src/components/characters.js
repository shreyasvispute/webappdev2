import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import md5 from "blueimp-md5";
import paginate from "./paginate";

import {
  Card,
  Container,
  ListGroup,
  ListGroupItem,
  Spinner,
  CardGroup,
} from "react-bootstrap";
import NotFound from "./notfound";
import Paginate from "./paginate";

const publickey = "be3f31438c0d0dca365602ae44e1256e";
const privatekey = "943eee94a11e331175bd7a9dbab6650308c4fab6";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public/characters";

function Characters() {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(false);
  const [isPrev, setPrevState] = useState(false);
  const [isNext, setNextState] = useState(false);

  let params = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        let limit = 20;
        let page = Number(params.page);
        if (page <= 0) {
          setPrevState(false);
          page = 0;
        } else {
          setPrevState(true);
        }
        page += 1;
        let offset = limit * page - limit;
        const url = `${baseUrl}?offset=${offset}&limit=${limit}&ts=${ts}&apikey=${publickey}&hash=${hash}`;
        const { data } = await axios.get(url);
        let totalRecords = data.data.total;

        if (page - 1 == Math.ceil(totalRecords / limit) - 1) {
          setNextState(false);
        } else {
          setNextState(true);
        }
        setApiData(data);
        setLoading(false);

        if (data.data.results.length === 0) {
          setPageError(true);
        } else {
          setPageError(false);
        }
      } catch (error) {
        //setPageError = true;
      }
    };
    getData();
  }, [params.page]);

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
          <Paginate
            pageNum={params.page}
            prevState={isPrev}
            nextState={isNext}
          ></Paginate>
          <CardGroup>
            {apiData.data &&
              apiData.data.results.map((characterData) => (
                <div className="col sm-4">
                  <Card key={characterData.id} style={{ width: "18rem" }}>
                    <Card.Img
                      variant="top"
                      src={characterData.thumbnail.path + ".jpg"}
                    />
                    <Card.Body>
                      <Card.Title>{characterData.name}</Card.Title>
                      {/* <Card.Text>{characterData.description}</Card.Text> */}
                    </Card.Body>
                    {/* <ListGroup className="list-group-flush">
                    <ListGroupItem>Cras justo odio</ListGroupItem>
                    <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
                    <ListGroupItem>Vestibulum at eros</ListGroupItem>
                  </ListGroup> */}
                    {/* <Card.Body>
                    {/* <Link href="#">Card Link</Link>
        <Link href="#">Another Link</Link> }
                  </Card.Body> */}
                  </Card>
                </div>
              ))}
          </CardGroup>
        </Container>
      );
    }
  }
}

export default Characters;
