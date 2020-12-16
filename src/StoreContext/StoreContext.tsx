import { createContext } from "react";
import { StoreInterface } from "../types/interfaces";

/** Super basic global store - good enough for an app this small  */
const StoreContext = createContext<StoreInterface>({});

export default StoreContext;