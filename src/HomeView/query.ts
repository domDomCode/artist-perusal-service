import { gql } from "@apollo/client";

export const GET_ARTISTS = gql`
query GetArtists($name: String!) {
  search {
    artists(query: $name) {
      nodes {
        mbid
        name
      }
    }
  }
}
`;
