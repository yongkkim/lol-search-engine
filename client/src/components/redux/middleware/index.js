export function middleWare({ dispatch }) {
  return function (next) {
    return function (action) {
      if (action.type === "KEYWORD") {
        let cleanedKeyword = action.paylaod.replace(/['"]+/g, "").trim();

        if (action.payload >= 40) {
          dispatch({
            type: "ERROR_MESSAGE",
            payload: "Keyword should be less than 40 characters",
          });
        }

        if (cleanedKeyword !== "") {
          dispatch({
            type: "ERROR_MESSAGE",
            payload: "Keyword should not be empty",
          });
        }
      }
      return next(action);
    };
  };
}
