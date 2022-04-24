import React, { useState, useContext } from "react";
import AppContext from "../context/trainerContext";

import {
  Container,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
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
    context.trainerDispatch({
      type: "CREATE_TRAINER",
      payload: { name: formData.name },
    });
    document.getElementById("name").value = "";
  };

  const handleChange = (e) => {
    setFormData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  const handleSelect = (e, element) => {
    e.preventDefault();
    console.log(element);
    context.trainerDispatch({
      type: "SELECT_CHANGED",
      payload: { id: element.id, selected: element.selected },
    });
  };

  const handleDelete = (e, element) => {
    e.preventDefault();
    console.log(element);
    context.trainerDispatch({
      type: "DELETE_TRAINER",
      payload: { id: element.id },
    });
  };

  const buildTrainerCards = (element) => {
    return (
      <Card key={element.id} style={{ width: "16rem" }}>
        <Card.Body>
          <Card.Title>{element.name}</Card.Title>
        </Card.Body>
        <Card.Body>
          {element.selected ? (
            <Button variant="primary" onClick={(e) => handleSelect(e, element)}>
              Selected
            </Button>
          ) : (
            <Button onClick={(e) => handleSelect(e, element)} variant="primary">
              Select
            </Button>
          )}
          {!element.selected && (
            <Button onClick={(e) => handleDelete(e, element)} variant="danger">
              Delete
            </Button>
          )}
        </Card.Body>
      </Card>
    );
  };
  return (
    <div>
      <Container>
        <Row>
          <h1>Add Trainer</h1>
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
                placeholder="Enter team name"
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
        <Row>
          {context &&
            context.trainers.map((e) => {
              return buildTrainerCards(e);
            })}
        </Row>
      </Container>
    </div>
  );
}

export default Trainers;
