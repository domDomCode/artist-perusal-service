// normally these would be grouped into separate files, but for an app this size it's pointless
export interface ArtistsSearchResponseInterface {
  search: {
    artists: {
      nodes: ArtistInterface[]
    }
  }
}

// ---

export interface ArtistInterface {
  name: string
  mbid: string
}

export interface FavoriteArtistInterface {
  name: string,
  mbid: string;
}

// ---

export interface ArtistLookupResponseInterface {
  lookup: {
    artist: ArtistDetailInterface
  }
}

interface ArtistDetailInterface {
  name: string;
  country: string;
  type: string;
  rating: {
    value: string;
  }
  releaseGroups: ReleaseGroupsInterface
  mbid: string
}

interface ReleaseGroupsInterface {
  edges: ReleaseInterface[]
}

export interface ReleaseInterface {
  node: {
    title: string;
    firstReleaseDate: string;
  }
}

// ---

export interface StoreInterface {
  favoriteList?: {
    get: FavoriteArtistInterface[] | [];
    set: (value: FavoriteArtistInterface[]) => void;
  }
}