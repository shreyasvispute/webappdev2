import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import AppContext from "../context/trainerContext";

import {
  Container,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
  CardGroup,
  Col,
} from "react-bootstrap";

function Trainers() {
  const context = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    selected: false,
  });

  console.log(context);
  const addTrainer = (e) => {
    e.preventDefault();
    const trainerName = document.getElementById("name").value;
    if (trainerName === "") {
      alert("Please enter team name");
    } else if (trainerName && trainerName.trim().length === 0) {
      alert("Trainer Name cannot be blank spaces");
    } else {
      context.trainerDispatch({
        type: "CREATE_TRAINER",
        payload: { name: formData.name.trim() },
      });
      document.getElementById("name").value = "";
    }
  };

  const handleChange = (e) => {
    setFormData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  const handleSelect = (e, element) => {
    e.preventDefault();
    context.trainerDispatch({
      type: "SELECT_CHANGED",
      payload: { id: element.id, selected: element.selected },
    });
  };

  const handleDelete = (e, element) => {
    e.preventDefault();
    context.trainerDispatch({
      type: "DELETE_TRAINER",
      payload: { id: element.id },
    });
  };

  const buildTrainerCards = (element) => {
    return (
      <Row key={element.id}>
        <CardGroup>
          <Card key={element.id} style={{ width: "16rem" }}>
            <Card.Body>
              <Row>
                <Col> </Col>
                <Col>
                  {" "}
                  <Card.Title>Trainer : {element.name}</Card.Title>
                </Col>
                <Col>
                  {element.selected ? (
                    <Button
                      variant="primary"
                      onClick={(e) => handleSelect(e, element)}
                    >
                      Selected
                    </Button>
                  ) : (
                    <Button
                      onClick={(e) => handleSelect(e, element)}
                      variant="primary"
                    >
                      Select
                    </Button>
                  )}{" "}
                  {!element.selected && (
                    <Button
                      onClick={(e) => handleDelete(e, element)}
                      variant="danger"
                    >
                      Delete
                    </Button>
                  )}
                </Col>
              </Row>
            </Card.Body>
            <Card.Body>
              <CardGroup>
                {element.pokemon?.map((e) => {
                  return (
                    <Card
                      className="catchedPokemon"
                      key={e.id}
                      style={{ width: "5rem" }}
                    >
                      <Card.Img
                        className="pokemonImage"
                        variant="top"
                        alt={e.name}
                        src={e.image}
                      />
                      <Card.Body>
                        <Link to={`/pokemon/${e.id}`}>
                          <Card.Title className="">{e.name}</Card.Title>
                        </Link>
                      </Card.Body>
                    </Card>
                  );
                })}
              </CardGroup>
            </Card.Body>
          </Card>
        </CardGroup>
      </Row>
    );
  };

  return (
    <Container>
      <Row>
        <h1>Manage Trainers</h1>
      </Row>
      <Row>
        <Form>
          <InputGroup className="mb-3">
            <Form.Control
              id="name"
              type="text"
              name="name"
              onChange={(e) => {
                handleChange(e);
              }}
              aria-label="name"
              aria-describedby="name"
              placeholder="Enter trainer name"
            />
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => {
                addTrainer(e);
              }}
            >
              Add Trainer
            </Button>
          </InputGroup>
        </Form>
      </Row>
      <Row>
        <h1>Trainers</h1>
      </Row>

      {context &&
        context.trainers.map((e) => {
          return buildTrainerCards(e);
        })}
    </Container>
  );
}

export default Trainers;
