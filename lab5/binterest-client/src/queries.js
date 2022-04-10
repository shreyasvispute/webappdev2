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
  ) {
    updateImage(
      id: $id
      url: $url
      posterName: $posterName
      description: $description
      userPosted: $userPosted
      binned: $binned
    ) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;
let exported = {
  GET_IMAGES,
  GET_BINNED_IMAGES,
  GET_USERPOSTED_IMAGES,
  UPDATE_IMAGE,
};

export default exported;
