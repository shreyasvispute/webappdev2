import { Routes, Route, Link, Outlet } from "react-router-dom";
import "./App.css";
import Characters from "./components/characters";
import Comics from "./components/comics";
import Series from "./components/series";
import NotFound from "./components/notfound";
import { Container, Navbar, Nav } from "react-bootstrap";

function App() {
  return (
    <div className="App">
      {/* <header className="App-header"> </header> */}
      <Container>
        <Navbar expand="lg" variant="light" bg="light">
          <Container>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="characters/page/0">
                Characters
              </Nav.Link>
              <Nav.Link as={Link} to="series/page/0">
                Series
              </Nav.Link>
              <Nav.Link as={Link} to="comics/page/0">
                Comics
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </Container>  

      <Routes>
        <Route path="/characters" element={<Characters />}>
          <Route path="page/:page"></Route>
          <Route path=":id"></Route>
        </Route>
        <Route path="/comics" element={<Comics />}>
          <Route path="page/:page"></Route>
          <Route path=":id"></Route>
        </Route>
        <Route path="/series" element={<Series />}>
          <Route path="page/:page"></Route>
          <Route path=":id"></Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
