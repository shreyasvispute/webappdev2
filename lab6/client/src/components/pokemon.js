import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import AppContext from "../context/trainerContext";
import CatchRelease from "./catchReleaseButton";

import { Container, Row, Col } from "react-bootstrap";
import NotFound from "./notFound";

function Pokemon() {
  const context = useContext(AppContext);

  const params = useParams();
  const pokemonId = params.id;

  const { loading, error, data } = useQuery(queries.GET_POKEMON, {
    variables: { pokemonId },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  if (data) {
    const { getPokemon } = data;
    console.log(getPokemon);
    const index = context.trainers.findIndex((e) => e.selected === true);
    const trainer = context.trainers[index];

    return (
      <div>
        <Container>
          <Row>
            <Col>
              <h1 className="">{getPokemon.name.toUpperCase()}</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <img alt={getPokemon.name} variant="top" src={getPokemon.image} />
            </Col>
          </Row>
          <Row>
            <Col>
              <CatchRelease data={getPokemon} trainer={trainer}></CatchRelease>
            </Col>
          </Row>
          <Row>
            <Col>{getPokemon.name}'s Type</Col>
          </Row>
          <Row>
            <Col>
              {" "}
              {getPokemon.types?.map((e) => {
                return <Col key={e.name}>{e.name}</Col>;
              })}
            </Col>
          </Row>
          <Row>
            <Col>{getPokemon.name}'s Abilities</Col>
          </Row>
          <Row>
            <Col>
              {getPokemon.abilities?.map((e) => {
                return <Col key={e.name}>{e.name}</Col>;
              })}
            </Col>
          </Row>
        </Container>
      </div>
    );
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <NotFound></NotFound>;
  }
}
export default Pokemon;
