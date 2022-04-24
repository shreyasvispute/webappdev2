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
      }
    }
  }
`;

const GET_POKEMON = gql`
  query GetPokemon($getPokemonId: ID!) {
    getPokemon(id: $getPokemonId) {
      id
      name
      image
      types {
        name
      }
    }
  }
`;

let exported = { GET_POKEMONLIST, GET_POKEMON };

export default exported;
