import React from "react";

import queries from "../queries";
import { useQuery } from "@apollo/client";
import { Container } from "react-bootstrap";
import ImageList from "./imageList";

function MyBin() {
  const { loading, error, data } = useQuery(queries.GET_BINNED_IMAGES, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  if (data) {
    const { binnedImages } = data;
    if (binnedImages.length !== 0) {
      return (
        <Container>
          <h1>Binned Images</h1>
          <ImageList page="myBin" data={binnedImages}></ImageList>;
        </Container>
      );
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
