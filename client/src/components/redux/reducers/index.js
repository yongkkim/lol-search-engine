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
  SET_PLAYER_ITEMS,
  SET_PLAYER_SPELLS,
  SET_MY_ITMES,
  SET_MY_SPELLS,
  SET_MY_SPELL_SET,
  SET_MY_PERK_SET,
  SET_MY_ITEM_SET,
  NUMBER,
  INITIAL_STATE,
  PROFILE_READY,
  PLAYER_SPELLS,
  MY_SPELLS,
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
  playerSpells: [],
  playerItems: [],
  mySpells: [],
  myItems: [],
  mySpellSet: {},
  myPerkSet: {},
  myItemSet: {},
  number: 7,
  profileReady: false,
  playerSpells: [],
  MYSpells: [],
};

const rootReducer = (state = initialState, action) => {
  if (action.type === NUMBER) {
    return {
      ...state,
      number: state.number + action.payload,
    };
  }
  if (action.type === SET_MY_SPELL_SET) {
    return {
      ...state,
      mySpellSet: Object.assign({}, action.payload),
    };
  }
  if (action.type === SET_MY_PERK_SET) {
    return {
      ...state,
      myPerkSet: Object.assign({}, action.payload),
    };
  }
  if (action.type === SET_MY_ITEM_SET) {
    return {
      ...state,
      myItemSet: Object.assign({}, action.payload),
    };
  }

  if (action.type === SET_PLAYER_ITEMS) {
    return {
      ...state,
      playerItems: Object.assign([], action.payload),
    };
  }
  if (action.type === SET_PLAYER_SPELLS) {
    return {
      ...state,
      playerSpells: Object.assign([], action.payload),
    };
  }
  if (action.type === SET_MY_ITMES) {
    return {
      ...state,
      myItems: Object.assign([], action.payload),
    };
  }
  if (action.type === SET_MY_SPELLS) {
    return {
      ...state,
      mySpells: Object.assign([], action.payload),
    };
  }

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

  if (action.type === INITIAL_STATE) {
    return {
      ...initialState,
      username: action.payload.username,
      opacity: action.payload.opacity,
      scale: action.payload.scale,
    };
  }

  if (action.type === PROFILE_READY) {
    return {
      ...state,
      profileReady: action.payload,
    };
  }

  return state;
};

export default rootReducer;
