import React from "react";
import queries from "../queries";
import { useQuery } from "@apollo/client";

function Home() {
  let pageNum = 1;
  const { loading, error, data } = useQuery(queries.GET_IMAGES, {
    variables: { pageNum },
    fetchPolicy: "cache-and-network",
  });
  console.log(data);
  if (data) {
    const { unsplashImages } = data;
    return (
      <>
        <p>{unsplashImages}</p>
      </>
    );
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default Home;
