import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import queries from "../queries";
import { useQuery } from "@apollo/client";
import {
  Card,
  Container,
  Spinner,
  CardGroup,
  Button,
  Col,
  Row,
} from "react-bootstrap";
import ImageList from "./imageList";

function Home() {
  const [apiData, setApiData] = useState([]);
  const [pageNum, setPageNumber] = useState(1);
  const { loading, error, data, fetchMore } = useQuery(queries.GET_IMAGES, {
    variables: { pageNum },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const handleMore = () => {
    const nextOffset = pageNum + 1;
    setPageNumber(nextOffset);

    fetchMore({
      variables: {
        pageNum: nextOffset,
      },
    });
  };

  if (data) {
    const { unsplashImages } = data;
    return (
      <Container>
        <Row>
          <ImageList
            page="home"
            data={unsplashImages}
            pageNum={pageNum}
          ></ImageList>
        </Row>
        <Row>
          <Button
            className="getmore"
            variant="primary"
            onClick={() => handleMore()}
          >
            Get More
          </Button>
        </Row>
      </Container>
    );
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default Home;
