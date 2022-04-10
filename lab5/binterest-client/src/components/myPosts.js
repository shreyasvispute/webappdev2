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
} from "react-bootstrap";
import ImageList from "./imageList";

function MyPosts() {
  const [apiData, setApiData] = useState([]);

  let card;
  const { loading, error, data } = useQuery(queries.GET_USERPOSTED_IMAGES, {
    fetchPolicy: "cache-and-network",
  });

  if (data) {
    const { userPostedImages } = data;
    if (!userPostedImages.length !== 0) {
      return <ImageList page="myPosts" data={userPostedImages}></ImageList>;
    } else {
      return (
        <Container>
          <h1>No data found</h1>
        </Container>
      );
    }
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default MyPosts;
