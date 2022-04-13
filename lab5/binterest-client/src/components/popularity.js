import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import queries from "../queries";
import { useQuery } from "@apollo/client";
import ImageList from "./imageList";

function Popularity() {
  const { loading, error, data } = useQuery(queries.GET_TOP_TEN_BINNED_POSTS, {
    fetchPolicy: "cache-and-network",
  });

  if (data) {
    const { getTopTenBinnedPosts } = data;
    if (getTopTenBinnedPosts.length !== 0) {
      return (
        <ImageList page="popularity" data={getTopTenBinnedPosts}></ImageList>
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

export default Popularity;
