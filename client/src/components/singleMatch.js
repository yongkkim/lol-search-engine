import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { setMatchHistory } from "./redux/actions";

const Root = styled.div`
  display: flex;
  width: 100%;
`;
const Match = styled.div`
  color: white;
  height: 100px;
  margin-top: 10px;
  border: 1px solid white;
  width: 100%;
`;

const Champ = styled.img`
  width: 100px;
  height: 100px;
`;

const SingleMatch = ({ playedChamp, image, nth, matchHistory }) => {
  const spells = {
    spell1: matchHistory[nth].participants[nth].spell1Id,
    spell2: matchHistory[nth].participants[nth].spell2Id,
  };
  const items = {
    item1: matchHistory[nth].participants[nth].stats.item0,
    item2: matchHistory[nth].participants[nth].stats.item1,
    item3: matchHistory[nth].participants[nth].stats.item2,
    item4: matchHistory[nth].participants[nth].stats.item3,
    item5: matchHistory[nth].participants[nth].stats.item4,
    item6: matchHistory[nth].participants[nth].stats.item5,
  };
  const kda = {
    kill: matchHistory[nth].participants[nth].stats.kills,
    death: matchHistory[nth].participants[nth].stats.deaths,
    assist: matchHistory[nth].participants[nth].stats.assists,
  };

  const win = matchHistory[nth].participants[nth].stats.win;

  useEffect(() => {});

  return (
    <Root>
      <Match>
        <Champ src={image} />
      </Match>
    </Root>
  );
};

const mapStateToProps = (state) => {
  return {
    matchHistory: state.matchHistory,
    myChamp: state.myChamp,
    version: state.version,
    playedChamp: state.playedChamp,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMatchHistory: (value) => dispatch(setMatchHistory(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleMatch);
