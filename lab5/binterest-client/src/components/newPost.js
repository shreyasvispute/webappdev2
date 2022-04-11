import React, { useState } from "react";

import queries from "../queries";
import { useMutation } from "@apollo/client";
import { Container, Spinner, Button, Form } from "react-bootstrap";

//validation reused from https://dev.to/alecgrey/controlled-forms-with-front-and-backend-validations-using-react-bootstrap-5a2
function NewPost() {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  let url = "";
  let description = "";
  let posterName = "";

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });

    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const [UploadImage, { loading, error }] = useMutation(queries.UPLOAD_IMAGE, {
    update(cache, { data: { UploadImage } }) {
      const { userPostedImages } = cache.readQuery({
        query: queries.GET_USERPOSTED_IMAGES,
      });
      cache.writeQuery({
        query: queries.GET_USERPOSTED_IMAGES,
        data: { userPostedImages },
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      UploadImage({
        variables: {
          url: url.value,
          description: description.value,
          posterName: posterName.value,
        },
      });
      url.value = "";
      description.value = "";
      posterName.value = "";
      alert("Image Post Added");
    }
  };

  const findFormErrors = () => {
    const { url, description, posterName } = form;
    const newErrors = {};

    if (!url) newErrors.url = "cannot be blank!";

    if (!isValidURL(url)) newErrors.url = "Please enter a proper URL";

    if (description) {
      if (description.trim().length === 0)
        newErrors.description = "Description cannot be blank spaces!";
    }

    if (posterName) {
      if (posterName.trim().length === 0)
        newErrors.posterName = "Please enter a poster name!";
    }

    return newErrors;
  };
  //function reused from https://tutorial.eyehunts.com/js/website-url-validation-in-javascript-example-code/
  function isValidURL(str) {
    if (str !== undefined) {
      var res = str.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
      return res !== null;
    } else {
      return false;
    }
  }

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  return (
    <Container>
      <Form
        className="userPost"
        id="user-Post"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <Form.Group className="mb-3" controlId="formBasicURL">
          <Form.Label>URL</Form.Label>
          <Form.Control
            ref={(node) => {
              url = node;
            }}
            autoFocus={true}
            type="text"
            onChange={(e) => setField("url", e.target.value)}
            placeholder="Paste any image URL from internet."
            isInvalid={!!errors.url}
          />
          <Form.Control.Feedback type="invalid">
            {errors.url}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            ref={(node) => {
              description = node;
            }}
            type="text"
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Enter Description"
            isInvalid={!!errors.description}
          />
          <Form.Control.Feedback type="invalid">
            {errors.description}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPosterName">
          <Form.Label>Poster Name</Form.Label>
          <Form.Control
            ref={(node) => {
              posterName = node;
            }}
            type="text"
            onChange={(e) => setField("posterName", e.target.value)}
            placeholder="Enter Poster Name"
            isInvalid={!!errors.posterName}
          />
          <Form.Control.Feedback type="invalid">
            {errors.posterName}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
}
export default NewPost;
