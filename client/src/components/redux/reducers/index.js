import { version } from "react";
import {
  SUBMIT,
  WIDTH,
  SCALE,
  TOP,
  OPACITY,
  SET_USER_PROFILE,
  ERROR,
  ERROR_MESSAGE,
  USERNAME,
  LOADING,
  VERSION,
  RANKED,
  MATCH_HISTORY,
  SEVEN_MATCHES,
  MY_CHAMP,
  PLAYED_CHAMP,
  PLAYING_TIME,
  ALL_MATCH,
  SPELLS,
  PERKS,
} from "../constants/action-types";

const initialState = {
  opacity: 0,
  submit: false,
  top: 100,
  width: 0,
  scale: 1,
  errorMsg: "",
  error: false,
  profile: {},
  username: "",
  loading: false,
  version: "",
  ranked: [],
  matchHistory: [],
  myChamp: [],
  playedChamp: [],
  playingTime: [],
  allMatch: [],
  spells: [],
  perks: [],
};

const rootReducer = (state = initialState, action) => {
  if (action.type === SET_USER_PROFILE) {
    return {
      ...state,
      profile: Object.assign({}, action.payload),
    };
  }

  if (action.type === SPELLS) {
    return {
      ...state,
      spells: Object.assign([], action.payload),
    };
  }

  if (action.type === PERKS) {
    return {
      ...state,
      perks: Object.assign([], action.payload),
    };
  }

  if (action.type === ALL_MATCH) {
    return {
      ...state,
      allMatch: Object.assign([], action.payload),
    };
  }

  if (action.type === MATCH_HISTORY) {
    return {
      ...state,
      matchHistory: Object.assign([], action.payload),
    };
  }

  if (action.type === RANKED) {
    return {
      ...state,
      ranked: Object.assign([], action.payload),
    };
  }

  if (action.type === VERSION) {
    return {
      ...state,
      version: action.payload,
    };
  }

  if (action.type === SUBMIT) {
    return {
      ...state,
      submit: action.payload,
    };
  }

  if (action.type === SCALE) {
    return {
      ...state,
      scale: action.payload,
    };
  }

  if (action.type === OPACITY) {
    return {
      ...state,
      opacity: action.payload,
    };
  }

  if (action.type === WIDTH) {
    return {
      ...state,
      width: action.payload,
    };
  }

  if (action.type === TOP) {
    return {
      ...state,
      top: action.payload,
    };
  }

  if (action.type === ERROR_MESSAGE) {
    return {
      ...state,
      errorMsg: action.payload,
    };
  }

  if (action.type === ERROR) {
    return {
      ...state,
      error: action.payload,
    };
  }

  if (action.type === USERNAME) {
    return {
      ...state,
      username: action.payload,
    };
  }

  if (action.type === LOADING) {
    return {
      ...state,
      loading: action.payload,
    };
  }

  if (action.type === MY_CHAMP) {
    return {
      ...state,
      myChamp: Object.assign([], action.payload),
    };
  }

  if (action.type === PLAYED_CHAMP) {
    return {
      ...state,
      playedChamp: Object.assign([], action.payload),
    };
  }

  if (action.type === PLAYING_TIME) {
    return {
      ...state,
      playingTime: Object.assign([], action.payload),
    };
  }

  return state;
};

export default rootReducer;
