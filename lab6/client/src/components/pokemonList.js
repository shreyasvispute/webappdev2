import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useQuery } from "@apollo/client";

import queries from "../queries";
import Pokemons from "./pokemons";
import NotFound from "./notFound";
import AppContext from "../context/trainerContext";

function PokemonList() {
  const context = useContext(AppContext);
  const params = useParams();

  const pageNum = Number(params.pageNum);
  const { loading, error, data } = useQuery(queries.GET_POKEMONLIST, {
    variables: { pageNum },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  if (data) {
    const index = context.trainers.findIndex((e) => e.selected === true);
    const trainer = context.trainers[index];

    const { pokemonData } = data;
    if (pokemonData.results.length === 0) {
      return <NotFound></NotFound>;
    }
    return (
      <Container>
        <h1>Pokemon</h1>
        <div className="paginateDesign">
          <Row xs="auto">
            <Col sm>
              {pokemonData.prev && (
                <Link to={`/pokemon/page/${Number(params.pageNum) - 1}`}>
                  Previous
                </Link>
              )}
            </Col>
            <Col>{params.pageNum} of 56</Col>
            <Col sm>
              {pokemonData.next && (
                <Link to={`/pokemon/page/${Number(params.pageNum) + 1}`}>
                  Next
                </Link>
              )}
            </Col>
            <Col sm className="makeCenter filterMargin">
              Total Records Count: {pokemonData.count}
            </Col>
          </Row>
        </div>
        <Row>
          <Col>
            <h2>Trainer : {trainer.name}</h2>
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
    return <NotFound></NotFound>;
  }
}

export default PokemonList;
