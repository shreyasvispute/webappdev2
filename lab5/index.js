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
    getTopTenBinnedPosts: [ImagePost]
  }

  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
    numBinned: Int!
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
      numBinned: Int
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
      let cachedImageData = await client.hGet("imageCache", element.id);
      cachedImageData = JSON.parse(cachedImageData);
      let binned = false;

      if (cachedImageData && cachedImageData.binned) {
        binned = true;
      }

      let images = {
        id: element.id,
        url: element.urls.small,
        posterName: element.user.name,
        description: element.alt_description,
        userPosted: false,
        binned: binned,
        numBinned: element.likes,
      };
      imageData.push(images);
    }
    return imageData;
  } catch (error) {
    console.log(error);
  }
}

async function getTopTenBinnedPosts() {
  try {
    const cachedImageData = await client.hGetAll("imageCache");

    if (cachedImageData) {
      await client.del("popularImages");
      for (const [key, value] of Object.entries(cachedImageData)) {
        let image = JSON.parse(value);
        if (image.binned === true) {
          const stringifyImage = JSON.stringify(image);

          await client.zAdd("popularImages", {
            score: image.numBinned,
            value: stringifyImage,
          });
        }
      }
    }
    // hardcoded as -inf to inf does not work in my case!
    const popularImages = await client.zRange("popularImages", 0, 100000000);
    let images = popularImages.reverse().slice(0, 10);
    let topTenImages = [];
    images.map((x) => {
      topTenImages.push(JSON.parse(x));
    });
    return topTenImages;
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
            numBinned: 0,
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
      for (const [key, value] of Object.entries(cachedBinnedImage)) {
        let parsedImage = JSON.parse(value);
        if (parsedImage.userPosted === true) {
          let newImage = {
            id: parsedImage.id,
            url: parsedImage.url,
            posterName: parsedImage.posterName,
            description: parsedImage.description,
            userPosted: parsedImage.userPosted,
            binned: parsedImage.binned,
            numBinned: parsedImage.numBinned,
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
    getTopTenBinnedPosts: async () => getTopTenBinnedPosts(),
  },
  Mutation: {
    uploadImage: async (_, args) => {
      if (
        typeof args.url !== "string" ||
        typeof args.description !== "string" ||
        typeof args.posterName !== "string"
      ) {
        throw new UserInputError("Parameters of defined type not found");
      }

      try {
        let newImage = {
          id: uuid.v4(),
          url: args.url,
          posterName: args.posterName,
          description: args.description,
          userPosted: true,
          binned: false,
          numBinned: 1,
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
          throw new ApolloError("No Image found ");
        }
      } catch (error) {
        throw new ApolloError(error);
      }
    },

    updateImage: async (_, args) => {
      if (
        typeof args.id !== "string" ||
        typeof args.url !== "string" ||
        typeof args.userPosted !== "boolean" ||
        typeof args.binned !== "boolean"
      ) {
        throw new UserInputError("Parameters of defined type not found");
      }

      try {
        let newImage = {
          id: args.id,
          url: args.url,
          posterName: args.posterName,
          description: args.description,
          userPosted: args.userPosted,
          binned: args.binned,
          numBinned: args.numBinned,
        };

        const getImage = await client.hGet("imageCache", newImage.id);
        let imageData = JSON.parse(getImage);

        if (getImage === null) {
          const insertImage = await client.hSet(
            "imageCache",
            newImage.id,
            JSON.stringify(newImage)
          );
          if (insertImage !== 1) {
            throw new ApolloError("Error while loading data into cache");
          }
        }

        if (
          imageData &&
          newImage.binned === false &&
          newImage.userPosted === false
        ) {
          const delImage = await client.hDel("imageCache", newImage.id);
          return newImage;
        }

        if (imageData && newImage.binned === false) {
          const updateImage = await client.hSet(
            "imageCache",
            newImage.id,
            JSON.stringify(newImage)
          );
        }

        if (
          imageData &&
          newImage.binned === true &&
          newImage.userPosted === true
        ) {
          const updateImage = await client.hSet(
            "imageCache",
            newImage.id,
            JSON.stringify(newImage)
          );
        }

        return JSON.parse(await client.hGet("imageCache", newImage.id));
      } catch (error) {
        throw new ApolloError(error);
      }
    },

    deleteImage: async (_, args) => {
      if (typeof args.id !== "string") {
        throw "Error: Parameters of type string expected";
      }
      try {
        let getImage = await client.hGet("imageCache", args.id);
        getImage = JSON.parse(getImage);

        if (getImage.userPosted === true) {
          const delImage = await client.hDel("imageCache", args.id);

          if (delImage === 1) {
            return getImage;
          }
        }
      } catch (error) {
        throw new ApolloError(error);
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
