import { gql } from "@apollo/client";

const GET_POKEMONLIST = gql`
  query PokemonData($pageNum: Int!) {
    pokemonData(pageNum: $pageNum) {
      count
      prev
      next
      results {
        id
        name
        image
        types {
          name
        }
        abilities {
          name
        }
      }
    }
  }
`;

const GET_POKEMON = gql`
  query GetPokemon($pokemonId: ID!) {
    getPokemon(id: $pokemonId) {
      id
      name
      image
      types {
        name
      }
      abilities {
        name
      }
    }
  }
`;

const SEARCH_POKEMON = gql`
  query SearchPokemon($key: String!) {
    searchPokemon(key: $key) {
      id
      image
      name
      types {
        name
      }
      abilities {
        name
      }
    }
  }
`;

let exported = { GET_POKEMONLIST, GET_POKEMON, SEARCH_POKEMON };

export default exported;
