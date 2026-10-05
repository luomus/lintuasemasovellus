import { createContext } from "react";

export const AppContext = createContext({
  user: "", observatory: "", station: {}, stations: [], speciesData: {}
});
