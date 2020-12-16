import { createContext } from "react";
import { FavoriteArtistInterface } from "../FavoriteList/index";

export interface StoreInterface {
  favoriteList?: {
    get: FavoriteArtistInterface[];
    set: any; //TODO add type
  }
}

/** Super basic global store - good enough for an app this small  */
const StoreContext = createContext<StoreInterface>({});

export default StoreContext;