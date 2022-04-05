const { ApolloServer, gql, ApolloError } = require("apollo-server");
const { default: axios } = require("axios");
const redis = require("redis");
const client = redis.createClient();

(async () => {
  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
  await client.flushAll();
})();

const typeDefs = gql`
  type Query {
    unsplashImages(pageNum: Int!): [ImagePost]
    #binnedImages:[ImagePost]
    #userPostedImages:[ImagePost]
  }

  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
  }
`;

async function getImageData(pageNum) {
  try {
    const baseUrl = `https://api.unsplash.com/photos?page=${pageNum}&client_id=gJOB6XfFG1bYXGquxCJEyx7YXechygMuz765SuPKh9w`;

    const { data } = await axios.get(baseUrl);

    const imageData = [];

    let binned = false;

    data.forEach((element) => {
      if (await client.hGet("ImageData", element.id)) {
        binned = true;
      }
      let images = {
        id: element.id,
        url: element.urls.full,
        posterName: element.user.name,
        description: element.alt_description,
        userPosted: false,
        binned: binned,
      };
      imageData.push(images);
    });

    return imageData;
  } catch (error) {
    console.log(new ApolloError(error));
  }
}

const resolvers = {
  Query: {
    unsplashImages: (_, args) => getImageData(args.pageNum),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
