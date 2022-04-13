import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import MyBin from "./components/myBin";
import MyPosts from "./components/myPosts";
import NewPost from "./components/newPost";
import Home from "./components/home";
import NotFound from "./components/notFound";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import Popularity from "./components/popularity";

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          unsplashImages: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: false,

            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing = [], incoming) {
              // return [...existing, ...incoming];
              //const merged = existing ? existing.slice(-10) : [];

              //console.log("existing", merged);
              //console.log("incoming", incoming);

              //return [...merged, ...incoming];
              return [...incoming];
            },
          },
        },
      },
      binnedImages: {
        merge: true,
      },
    },
  }),

  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="header">
          <Container className="navHead">
            <Navbar
              expand="lg"
              className="justify-content-center"
              variant="light"
              bg="light"
              sticky="top"
            >
              <Container>
                <Navbar.Brand>Binterest</Navbar.Brand>
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/">
                    my-images
                  </Nav.Link>

                  <Nav.Link as={Link} to="my-bin">
                    my-bin
                  </Nav.Link>
                  <Nav.Link as={Link} to="my-posts">
                    my-posts
                  </Nav.Link>
                  <Nav.Link as={Link} to="popularity">
                    popular
                  </Nav.Link>
                </Nav>
              </Container>
            </Navbar>
          </Container>
        </header>

        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/my-bin" element={<MyBin />}></Route>
          <Route path="/my-posts" element={<MyPosts />}></Route>
          <Route path="/new-post" element={<NewPost />}></Route>
          <Route path="/popularity" element={<Popularity />}></Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ApolloProvider>
  );
}

export default App;
