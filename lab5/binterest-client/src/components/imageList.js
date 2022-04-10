import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import queries from "../queries";
import { useMutation, useQuery } from "@apollo/client";
import {
  Card,
  Container,
  Spinner,
  CardGroup,
  Button,
  Col,
} from "react-bootstrap";

const ImageList = (data) => {
  const [updateImage] = useMutation(queries.UPDATE_IMAGE, {
    update(cache, { data: { updateImage } }) {
      const { unsplashImages } = cache.readQuery({
        query: queries.GET_IMAGES,
        variables: data.pageNum,
      });
      cache.writeQuery({
        query: queries.GET_IMAGES,
        variables: data.pageNum,
        data: { unsplashImages },
      });
    },
  });

  const buildImageCard = (e) => {
    return (
      <div key={e.id} className="col sm-4">
        <Card key={e.id} style={{ width: "18rem" }}>
          <Card.Img alt={e.posterName} variant="top" src={e.url} />
          <Card.Body>
            <Card.Title>{e.posterName}</Card.Title>
            <Card.Text>{e.description}</Card.Text>
          </Card.Body>
          <Card.Body>
            {e.binned ? (
              <Button
                className="addBin"
                variant="primary"
                onClick={() =>
                  updateImage({
                    variables: {
                      id: e.id,
                      url: e.url,
                      posterName: e.posterName,
                      description: e.description,
                      userPosted: e.userPosted,
                      binned: false,
                    },
                  })
                }
              >
                Remove from Bin
              </Button>
            ) : (
              <Button
                className="addBin"
                variant="primary"
                onClick={() =>
                  updateImage({
                    variables: {
                      id: e.id,
                      url: e.url,
                      posterName: e.posterName,
                      description: e.description,
                      userPosted: e.userPosted,
                      binned: true,
                    },
                  })
                }
              >
                Add to Bin
              </Button>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  };

  if (data.data) {
    console.log(data.data);

    return (
      <Container>
        <CardGroup>
          {data.data &&
            data.data.map((e) => {
              return buildImageCard(e);
            })}
        </CardGroup>
      </Container>
    );
  }
};

export default ImageList;
