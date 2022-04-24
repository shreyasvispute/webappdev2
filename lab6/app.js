const { ApolloServer, gql, ApolloError } = require("apollo-server");
const { default: axios } = require("axios");
const uuid = require("uuid");
const redis = require("redis");

const client = redis.createClient();

(async () => {
  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
  // await client.flushAll();
})();

const typeDefs = gql`
  type Query {
    pokemonData(pageNum: Int!): pokemonList
    getPokemon(id: ID!): pokemon
  }

  type pokemonList {
    count: Int!
    prev: String
    next: String
    results: [pokemon]
  }

  type pokemon {
    id: ID!
    name: String!
    image: String
    types: [pokeType]
  }

  type pokeType {
    name: String
  }
`;

async function getPokemonLists(pageNum) {
  try {
    if (pageNum < 0) {
      throw new UserInputError("Page Number cannot be less than 0");
    }
    pageNum = pageNum * 10;
    const baseUrl = `http://pokeapi.co/api/v2/pokemon/?limit=20&offset=${pageNum}`;
    const { data } = await axios.get(baseUrl);

    let results = [];

    let pokemonList = {
      count: data.count,
      prev: data.previous,
      next: data.next,
      results,
    };

    for (let element of data.results) {
      const id = element.url.split("/")[6];
      pokemonList.count = data.count;

      const pokemonFromCache = await checkPokemonInCache(id);

      if (pokemonFromCache === null) {
        const pokemon = await getPokemon(id);
        results.push(pokemon);
      } else {
        results.push(pokemonFromCache);
      }
    }
    return pokemonList;
  } catch (error) {
    throw new ApolloError(error);
  }
}
async function checkPokemonInCache(id) {
  try {
    const cache = await client.hGet("pokeCache", id);
    let pokemonData = JSON.parse(cache);
    return pokemonData;
  } catch (error) {}
}

async function getPokemon(id) {
  try {
    const pokemonFromCache = await checkPokemonInCache(id);

    if (pokemonFromCache === null) {
      const baseUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
      const pokemon = await axios.get(baseUrl);

      if (pokemon) {
        let types = [];

        pokemon?.data.types.forEach((element) => {
          const type = {
            name: element.type.name,
          };
          types.push(type);
        });

        const object = {
          id: pokemon.data.id,
          name: pokemon.data.name,
          image: pokemon.data.sprites.other["official-artwork"].front_default,
          types: types,
        };

        const insertPokemon = await client.hSet(
          "pokeCache",
          id,
          JSON.stringify(object)
        );
        return object;
      }
    } else {
      return pokemonFromCache;
    }
  } catch (error) {
    throw new ApolloError(error);
  }
}

const resolvers = {
  Query: {
    pokemonData: async (_, args) => getPokemonLists(args.pageNum),
    getPokemon: async (_, args) => getPokemon(args.id),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
