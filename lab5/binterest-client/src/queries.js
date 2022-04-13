import { gql } from "@apollo/client";

const GET_IMAGES = gql`
  query UnsplashImages($pageNum: Int!) {
    unsplashImages(pageNum: $pageNum) {
      id
      description
      posterName
      userPosted
      url
      binned
      numBinned
    }
  }
`;

const GET_BINNED_IMAGES = gql`
  query BinnedImages {
    binnedImages {
      id
      url
      posterName
      description
      binned
      userPosted
      numBinned
    }
  }
`;

const GET_USERPOSTED_IMAGES = gql`
  query UserPostedImages {
    userPostedImages {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const UPDATE_IMAGE = gql`
  mutation UpdateImage(
    $id: ID!
    $url: String
    $posterName: String
    $description: String
    $userPosted: Boolean
    $binned: Boolean
    $numBinned: Int
  ) {
    updateImage(
      id: $id
      url: $url
      posterName: $posterName
      description: $description
      userPosted: $userPosted
      binned: $binned
      numBinned: $numBinned
    ) {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const UPLOAD_IMAGE = gql`
  mutation UploadImage(
    $url: String!
    $description: String
    $posterName: String
  ) {
    uploadImage(url: $url, description: $description, posterName: $posterName) {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const DELETE_IMAGE = gql`
  mutation DeleteImage($id: ID!) {
    deleteImage(id: $id) {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const GET_TOP_TEN_BINNED_POSTS = gql`
  query GetTopTenBinnedPosts {
    getTopTenBinnedPosts {
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

let exported = {
  GET_IMAGES,
  GET_BINNED_IMAGES,
  GET_USERPOSTED_IMAGES,
  UPDATE_IMAGE,
  UPLOAD_IMAGE,
  DELETE_IMAGE,
  GET_TOP_TEN_BINNED_POSTS,
};

export default exported;
