const { ApolloServer, gql, ApolloError } = require("apollo-server");
const { default: axios } = require("axios");
const uuid = require("uuid");
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
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
  }

  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
  }

  type Mutation {
    uploadImage(
      url: String!
      description: String
      posterName: String
    ): ImagePost
    updateImage(
      id: ID!
      url: String
      posterName: String
      description: String
      userPosted: Boolean
      binned: Boolean
    ): ImagePost
    deleteImage(id: ID!): ImagePost
  }
`;

async function getImageData(pageNum) {
  try {
    const baseUrl = `https://api.unsplash.com/photos?page=${pageNum}&client_id=gJOB6XfFG1bYXGquxCJEyx7YXechygMuz765SuPKh9w`;

    const { data } = await axios.get(baseUrl);

    let imageData = [];

    for (let element of data) {
      let cachedImageData = await client.hGet("ImageData", element.id);

      let binned = false;

      if (cachedImageData) {
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
    }
    console.log(imageData);
    return imageData;
  } catch (error) {
    console.log(error);
  }
}

async function getBinnedImages() {
  try {
    const cachedBinnedImage = await client.hGetAll("imageCache");
    let images = [];

    if (cachedBinnedImage) {
      for (const [key, value] of Object.entries(cachedBinnedImage)) {
        let parsedImage = JSON.parse(value);
        if (parsedImage.binned === true) {
          let newImage = {
            id: parsedImage.id,
            url: parsedImage.url,
            posterName: parsedImage.posterName,
            description: parsedImage.description,
            userPosted: parsedImage.userPosted,
            binned: parsedImage.binned,
          };
          images.push(newImage);
        }
      }
      return images;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getUserPostedImages() {
  try {
    const cachedBinnedImage = await client.hGetAll("imageCache");
    let images = [];

    if (cachedBinnedImage) {
      for (let element of cachedBinnedImage) {
        let parsedImage = JSON.parse(element);
        if (parsedImage.userPosted === true) {
          let newImage = {
            id: element.id,
            url: element.url,
            posterName: element.posterName,
            description: element.description,
            userPosted: element.userPosted,
            binned: element.binned,
          };
          images.push(newImage);
        }
      }

      return images;
    }
  } catch (error) {
    console.log(error);
  }
}

const resolvers = {
  Query: {
    unsplashImages: async (_, args) => getImageData(args.pageNum),
    binnedImages: async () => getBinnedImages(),
    userPostedImages: async () => getUserPostedImages(),
  },
  Mutation: {
    uploadImage: async (_, args) => {
      if (
        typeof args.url !== "string" ||
        typeof args.description !== "string" ||
        typeof args.posterName !== "string"
      ) {
        throw "Error: Parameters of type string expected";
      }

      try {
        let newImage = {
          id: uuid.v4(),
          url: args.url,
          posterName: args.posterName,
          description: args.description,
          userPosted: true,
          binned: false,
        };
        const saveImage = await client.hSet(
          "imageCache",
          newImage.id,
          JSON.stringify(newImage)
        );
        if (saveImage === 1) {
          const getImage = await client.hGet("imageCache", newImage.id);
          return JSON.parse(getImage);
        } else {
          console.log("no image found");
        }
      } catch (error) {
        console.log(error);
      }
    },

    updateImage: async (_, args) => {
      if (
        typeof args.id != "string" ||
        typeof args.url !== "string" ||
        typeof args.description !== "string" ||
        typeof posterName !== "string" ||
        typeof userPosted !== "boolean" ||
        typeof binned !== "boolean"
      ) {
        throw "Error: Parameters of type string expected";
      }

      try {
        let newImage = {
          id: args.id,
          url: args.url,
          posterName: args.posterName,
          description: args.description,
          userPosted: args.userPosted,
          binned: args.binned,
        };
        const getImage = await client.hGet("imageCache", newImage.id);
        const imageData = JSON.stringify(getImage);
        if (imageData && imageData.binned === true) {
          const updateImage = await client.hSet(
            "imageCache",
            newImage.id,
            JSON.stringify(newImage)
          );
        }
        if (
          imageData &&
          imageData.userPosted === false &&
          imageData.binned === false
        ) {
          const deleteImage = await client.hDel("imageCache", newImage.id);
        }
        return JSON.stringify(await client.hGet("imageCache", newImage.id));
      } catch (error) {
        console.log(error);
      }
    },

    deleteImage: async (_, args) => {
      if (typeof args.id !== "string") {
        throw "Error: Parameters of type string expected";
      }
      try {
        const getImage = await client.hGet("imageCache", args.id);
        if (getImage) {
          const delImage = await client.hDel("imageCache", args.id);
          if (delImage === 1) {
            return "Image Deleted";
          }
        } else {
          return "Image not found";
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
