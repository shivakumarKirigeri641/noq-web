// src/reducer.js

export const initialState = {
  source: null,
  destination: null,
  date: new Date().toISOString().split("T")[0],
  validationError: "",
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SOURCE":
      return {
        ...state,
        source: action.payload,
        validationError: "",
      };
    case "SET_DESTINATION":
      return {
        ...state,
        destination: action.payload,
        validationError: "",
      };
    case "SET_VALIDATION_ERROR":
      return {
        ...state,
        validationError: action.payload,
      };
    case "RESET_FORM":
      return initialState;
    default:
      throw new Error();
  }
};
