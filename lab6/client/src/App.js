import React, { useReducer } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import Pokemon from "./components/pokemon";
import PokemonList from "./components/pokemonList";
import Trainers from "./components/trainers";
import "./App.css";

import reducer from "./reducers/trainerReducer";
import AppContext from "./context/trainerContext";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

function App() {
  const [trainers, trainerDispatch] = useReducer(
    reducer.reducer,
    reducer.initialState
  );
  return (
    <AppContext.Provider value={{ trainers, trainerDispatch }}>
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
                  <Navbar.Brand>Pokemon</Navbar.Brand>
                  <Nav className="me-auto">
                    <Nav.Link as={Link} to="pokemon/page/0">
                      Pokemon
                    </Nav.Link>
                    <Nav.Link as={Link} to="trainers">
                      Trainers
                    </Nav.Link>
                  </Nav>
                </Container>
              </Navbar>
            </Container>
          </header>

          <Routes>
            {/* <Route path="/" element={<PokemonList />}></Route> */}
            <Route
              path="/pokemon/page/:pageNum"
              element={<PokemonList />}
            ></Route>
            <Route path="/pokemon/:id" element={<Pokemon />}></Route>
            <Route path="/trainers" element={<Trainers />}></Route>

            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </div>
      </ApolloProvider>
    </AppContext.Provider>
  );
}

export default App;
