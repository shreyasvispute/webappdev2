import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import Pokemons from "./pokemons";

function PokemonList() {
  const [pageNumber, setPageNumber] = useState(0);
  const [apiData, setApiData] = useState([]);

  const params = useParams();
  const pageNum = Number(params.pageNum);

  const { loading, error, data } = useQuery(queries.GET_POKEMONLIST, {
    variables: { pageNum },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  if (data) {
    const { pokemonData } = data;
    console.log(pokemonData);

    return (
      <Container>
        <h1>Pokemon</h1>
        <Row>
          <Col>
            {pokemonData.prev && (
              <Link to={`/pokemon/page/${Number(params.pageNum) - 1}`}>
                Previous
              </Link>
            )}
          </Col>
          <Col>
            {pokemonData.next && (
              <Link to={`/pokemon/page/${Number(params.pageNum) + 1}`}>
                Next
              </Link>
            )}
          </Col>
        </Row>
        <Row>
          <Pokemons data={pokemonData.results}></Pokemons>
        </Row>
      </Container>
    );
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default PokemonList;
