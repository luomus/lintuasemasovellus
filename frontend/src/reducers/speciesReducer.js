import { getSpecies } from "../services";

const initialState = {
  data: null,
  error: null,
};

export const initializeSpecies = () => {
  return async dispatch => {
    try {
      const species = await getSpecies();
      dispatch({
        type: "SET_SPECIES",
        data: {
          species
        }
      });
    } catch (e) {
      console.error(e);
      dispatch({
        type: "SET_SPECIES_ERROR",
        error: e.message
      });
    }
  };
};

const speciesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SPECIES": {
      const entries = Object.entries(action.data.species);
      const upperEntries = entries.map(entry => [entry[0].toUpperCase(), entry[1].value]);

      return {
        data: {
          speciesCodeMap: new Map(upperEntries),
          uniqueSpecies: [...new Set(Object.values(action.data.species).map(species => species.value))]
        },
        error: null
      };
    }
    case "SET_SPECIES_ERROR":
      return { data: null, error: action.error };
    default:
      return state;
  }
};

export default speciesReducer;
