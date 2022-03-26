import { Routes, Route, Link, Outlet } from "react-router-dom";
import "./App.css";
import Characters from "./components/characters";
import Hero from "./components/hero";
import Comics from "./components/comics";
import Series from "./components/series";
import Serie from "./components/serie";
import Comic from "./components/comic";
import NotFound from "./components/notfound";
import Home from "./components/home";

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
        <Route path="/" element={<Home />}></Route>

        <Route path="/characters" element={<Characters />}>
          <Route path="page/:page"></Route>
        </Route>
        <Route path="/characters/:id" element={<Hero />}></Route>
        <Route path="/comics" element={<Comics />}>
          <Route path="page/:page"></Route>
        </Route>
        <Route path="comics/:id" element={<Comic />}></Route>
        <Route path="/series" element={<Series />}>
          <Route path="page/:page"></Route>
        </Route>
        <Route path="series/:id" element={<Serie />}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
