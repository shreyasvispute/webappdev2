import React from "react";

import queries from "../queries";
import { useMutation } from "@apollo/client";
import { Card, Container, CardGroup, Button } from "react-bootstrap";

const ImageList = (data) => {
  const [updateImage, { error }] = useMutation(
    queries.UPDATE_IMAGE
    //   , {
    //   update(cache, { data: { updateImage } }) {
    //     const { unsplashImages } = cache.readQuery({
    //       query: queries.GET_IMAGES,
    //       variables: data.pageNum,
    //     });
    //     cache.writeQuery({
    //       query: queries.GET_IMAGES,
    //       variables: data.pageNum,
    //       data: { unsplashImages },
    //     });
    //   },
    // }
  );

  const [deleteImage, { error_delete }] = useMutation(queries.DELETE_IMAGE, {
    refetchQueries: [queries.GET_USERPOSTED_IMAGES, "UserPostedImages"],
  });

  const buildImageCard = (e) => {
    return (
      <div key={e.id} className="col lg">
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
                      numBinned: e.numBinned,
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
                      numBinned: e.numBinned,
                    },
                  })
                }
              >
                Add to Bin
              </Button>
            )}
          </Card.Body>
          {data.page === "myPosts" && (
            <Card.Body>
              <Button
                className="deletePost"
                variant="danger"
                onClick={() =>
                  deleteImage({
                    variables: {
                      id: e.id,
                    },
                  })
                }
              >
                Delete
              </Button>
            </Card.Body>
          )}
        </Card>
      </div>
    );
  };
  if (error) return `Submission error! ${error.message}`;
  if (error_delete) return `Submission error! ${error.message}`;

  if (data.data && data.page === "popularity") {
    // console.log(data.data);
    const sum = data.data.reduce((accumulator, object) => {
      return accumulator + object.numBinned;
    }, 0);
    return (
      <Container>
        {sum && sum > 200 ? <h1>Mainstream</h1> : <h1>Non-Mainstream</h1>}
        <CardGroup>
          {data.data &&
            data.data.map((e) => {
              return buildImageCard(e);
            })}
        </CardGroup>
      </Container>
    );
  } else if (data.data) {
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
