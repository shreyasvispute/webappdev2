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

function MyBin() {
  const { loading, error, data } = useQuery(queries.GET_BINNED_IMAGES, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  if (data) {
    const { binnedImages } = data;
    if (binnedImages.length !== 0) {
      return <ImageList page="myBin" data={binnedImages}></ImageList>;
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

export default MyBin;
