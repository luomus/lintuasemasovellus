import { getSpecies } from "../services";

export const initializeSpecies = () => {
  return async dispatch => {
    const species = await getSpecies();
    dispatch(setSpecies(species));
  };
};

export const setSpecies = (species) => {
  return {
    type: "SET_SPECIES",
    data: {
      species
    }
  };
};

const speciesReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_SPECIES":
      return {
        speciesMap: new Map(Object.entries(action.data.species)),
        uniqueSpecies: [...new Set(Object.values(action.data.species).map(species => species.value))]
      };
    default:
      return state;
  }
};

export default speciesReducer;
