import queries from "../queries";
import { useQuery } from "@apollo/client";
import { Container, Spinner, Row } from "react-bootstrap";
import ImageList from "./imageList";
import { Link } from "react-router-dom";

function MyPosts() {
  const { loading, error, data } = useQuery(queries.GET_USERPOSTED_IMAGES, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  if (data) {
    const { userPostedImages } = data;
    if (userPostedImages.length !== 0) {
      return (
        <Container>
          <Row>
            <Link to="/new-post">New Post</Link>
          </Row>
          <Row>
            <ImageList page="myPosts" data={userPostedImages}></ImageList>
          </Row>
        </Container>
      );
    } else {
      return (
        <Container>
          <Row>
            <Link to="/new-post">New Post</Link>
          </Row>
          <Row>
            <h1>No data found</h1>
          </Row>
        </Container>
      );
    }
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default MyPosts;
