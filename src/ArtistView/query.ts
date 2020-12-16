import { gql } from "@apollo/client";

export const GET_ARTIST_DETAIL = gql`
query GetArtistDetail($mbid: MBID!) {
  lookup {
    artist(mbid: $mbid) {
      name
      country
      type
      mbid
      rating {
        value
      }
      releaseGroups(type: ALBUM) {
        edges {
          node {
            title
            firstReleaseDate
          }
        }
      }
    }
  }
}
`;
