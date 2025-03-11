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

const speciesReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_SPECIES": {
      const entries = Object.entries(action.data.species);
      const upperEntries = entries.map(entry => [entry[0].toUpperCase(), entry[1]]);

      return {
        speciesNameUpperMap: new Map(upperEntries),
        uniqueSpecies: [...new Set(Object.values(action.data.species).map(species => species.value))]
      };
    }
    default:
      return state;
  }
};

export default speciesReducer;
