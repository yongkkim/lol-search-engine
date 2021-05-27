import {
  SUBMIT,
  WIDTH,
  SCALE,
  TOP,
  OPACITY,
  USERNAME,
  LOADING,
  ERROR,
  ERROR_MESSAGE,
  SET_USER_PROFILE,
  VERSION,
  RANKED,
  MATCH_HISTORY,
  MY_CHAMP,
  PLAYED_CHAMP,
  PLAYING_TIME,
  ALL_MATCH,
  SPELLS,
  PERKS,
} from "../constants/action-types";

export function setPerks(value) {
  return { type: PERKS, payload: value };
}
export function setSpells(value) {
  return { type: SPELLS, payload: value };
}
export function setAllMatch(value) {
  return { type: ALL_MATCH, payload: value };
}
export function setPlayingTime(value) {
  return { type: PLAYING_TIME, payload: value };
}
export function setPlayedChamp(value) {
  return { type: PLAYED_CHAMP, payload: value };
}
export function setMyChamp(value) {
  return { type: MY_CHAMP, payload: value };
}
export function setRanked(ranked) {
  return { type: RANKED, payload: ranked };
}
export function setDragonDataVersion(version) {
  return { type: VERSION, payload: version };
}
export function setUserProfile(value) {
  return { type: SET_USER_PROFILE, payload: value };
}
export function setMatchHistory(value) {
  return { type: MATCH_HISTORY, payload: value };
}
export function setSubmit(value) {
  return { type: SUBMIT, payload: value };
}
export function setWidth(value) {
  return { type: WIDTH, payload: value };
}
export function setScale(value) {
  return { type: SCALE, payload: value };
}
export function setTop(value) {
  return { type: TOP, payload: value };
}
export function setOpacity(value) {
  return { type: OPACITY, payload: value };
}
export function setErrorMsg(errorMsg) {
  return { type: ERROR_MESSAGE, payload: errorMsg };
}
export function setError(error) {
  return { type: ERROR, payload: error };
}
export function setUsername(value) {
  return { type: USERNAME, payload: value };
}
export function setLoading(loading) {
  return { type: LOADING, payload: loading };
}
