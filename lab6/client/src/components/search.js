import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";

import queries from "../queries";
import Pokemons from "./pokemons";
import NotFound from "./notFound";

import { Container, Row, Form, Col, InputGroup, Button } from "react-bootstrap";

function Search() {
  const [formData, setFormData] = useState("");
  const [pokeSearch, { loading, error, data }] = useLazyQuery(
    queries.SEARCH_POKEMON
  );
  const handleClick = (e) => {
    e.preventDefault();
    const key = document.getElementById("searchPokemon").value;
    if (key === "") {
      alert("Please enter Pokemon name or id");
    } else if (key && key.trim().length === 0) {
      alert("Name cannot be blank spaces");
    } else {
      pokeSearch({
        variables: { key: formData.trim().toLowerCase() },
      });
    }
    setFormData("");
  };

  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <NotFound></NotFound>;
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1>Search Pokemon</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <InputGroup className="mb-3">
            <Form.Control
              id="searchPokemon"
              type="text"
              name="searchPokemon"
              onChange={(e) => {
                setFormData(e.target.value);
              }}
              aria-label="searchPokemon"
              aria-describedby="searchPokemon"
              placeholder="Enter pokemon name or id"
            />
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => handleClick(e)}
            >
              Search
            </Button>
          </InputGroup>
        </Col>
      </Row>
      <Row className="searchPokemon">
        {data && <Pokemons data={[data.searchPokemon]}></Pokemons>}
      </Row>
    </Container>
  );
}

export default Search;
