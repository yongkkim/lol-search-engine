import React, { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  setMatchHistory,
  setMyChamp,
  setPlayingTime,
  setAllMatch,
  setPlayerSpells,
  setMySpells,
} from "./redux/actions";
import { CircularProgress } from "@material-ui/core";
import SingleMatch from "./singleMatch";
import Matches from "./matches";

const Root = styled.div`
  width: 50%;
`;

const Loading = styled(CircularProgress)`
  position: absolute;
  bottom: 0;
  left: 50%;
  margin-bottom: 40px;
`;

const NoMore = styled.p`
  text-align: center;
  color: white;
  margin-top: 30px;
`;

const ResultPage = ({
  allMatch,
  profileReady,
  profile,
  matchHistory,
  playerSpells,
  mySpells,
  setMatchHistory,
  setAllMatch,
  setPlayerSpells,
  setMySpells,
}) => {
  const [number, setNumber] = useState(7);
  const [prevNumber, setPrevNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [playerItems, setPlayerItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [countMatches, setCountMatches] = useState(0);

  const matchAPI = async () => {
    //Get information of most recent 7 matches (game ids, champion ids, time)
    setApiLoading(true);
    let findAllMatches = await fetch(
      `/api/allmatch?id=${profile.accountId}&number=${number}`
    );
    findAllMatches = await findAllMatches.json();

    //get detailed information of each of 7 matches using game ids from the first fetch
    let ids = findAllMatches.gameInfo.map((id) => id[0]);
    let findEachMatch = await Promise.all(
      ids.map((id) => fetch(`/api/match?gameId=${id}`))
    );
    findEachMatch = await Promise.all(
      findEachMatch.map((eachMatch) => eachMatch.json())
    );
    let values = findEachMatch.map((champData) => champData.data);
    //store results from the first fetch
    setAllMatch(allMatch.concat(findAllMatches.gameInfo));
    setMatchHistory(matchHistory.concat(values));
    setApiLoading(false);
  };

  useEffect(() => {
    if (!profileReady) {
      setPrevNumber(0);
      setNumber(7);
    }
    if (prevNumber !== number && profileReady) {
      matchAPI();
      setPrevNumber(number);
    }
  }, [profileReady, number]);

  //get a pair of spells from each player (10 in one game) from 7 matches
  const getSpellsDurationGameModeForAll = () => {
    let gameDuration;
    let gameMode;
    let spellSets = matchHistory.map((match, i) => {
      gameDuration = match.gameDuration;
      gameMode = match.gameMode;
      return match.participants.map((ptpt) => {
        return {
          spells: [ptpt.spell1Id, ptpt.spell2Id],
          gameMode: gameMode,
          gameDuration: gameDuration,
        };
      });
    });
    setPlayerSpells(Object.assign(playerSpells, spellSets));
  };

  const getSpellsDurationGameModeForUser = () => {
    let mySpellSets = [];
    let gameDuration;
    let gameMode;
    matchHistory.map((match, i) => {
      gameDuration = match.gameDuration;
      gameMode = match.gameMode;
      match.participants.map((ptpt) => {
        //Separately save spells from a champion that you played
        if (ptpt.championId === allMatch[i][1]) {
          mySpellSets.push({
            spells: [ptpt.spell1Id, ptpt.spell2Id],
            gameMode: gameMode,
            gameDuration: gameDuration,
          });
        }
      });
    });
    setMySpells(Object.assign(mySpells, mySpellSets));
  };

  const getItemsKDAWin = () => {
    let myItemSets = [];
    let itemSets = matchHistory.map((match, i) => {
      return match.participants.map((ptpt) => {
        //Separately save spells from a champion that you played
        if (ptpt.championId === allMatch[i][1]) {
          myItemSets.push({
            items: [
              ptpt.stats.item0,
              ptpt.stats.item1,
              ptpt.stats.item2,
              ptpt.stats.item3,
              ptpt.stats.item4,
              ptpt.stats.item5,
              ptpt.stats.item6,
            ],
            win: ptpt.stats.win,
            kda:
              ptpt.stats.kills +
              "/" +
              ptpt.stats.deaths +
              "/" +
              ptpt.stats.assists,
            mainPerk: [ptpt.stats.perkPrimaryStyle, ptpt.stats.perk0],
            subPerk: ptpt.stats.perkSubStyle,
          });
        }
        return {
          items: [
            ptpt.stats.item0,
            ptpt.stats.item1,
            ptpt.stats.item2,
            ptpt.stats.item3,
            ptpt.stats.item4,
            ptpt.stats.item5,
            ptpt.stats.item6,
          ],
          win: ptpt.stats.win,
          kda:
            ptpt.stats.kills +
            "/" +
            ptpt.stats.deaths +
            "/" +
            ptpt.stats.assists,
          mainPerk: ptpt.stats.perk0,
          subPerk: ptpt.stats.perkSubStyle,
        };
      });
    });
    setMyItems(Object.assign(myItems, myItemSets));
    setPlayerItems(Object.assign(playerItems, itemSets));
  };

  useEffect(() => {
    if (!apiLoading && profileReady) {
      getSpellsDurationGameModeForAll();
      getSpellsDurationGameModeForUser();
      getItemsKDAWin();
    }
  }, [apiLoading, profileReady]);

  const fetchMoreData = () => {
    console.log("fetchmoreData");
    if (number === 35) {
      setHasMore(false);
    } else {
      setNumber(number + 7);
    }
  };

  console.log("countmatches", countMatches);
  //use countMatches to control fetchMoreData
  return (
    <Root id="root">
      <InfiniteScroll
        style={{ marginBottom: hasMore ? 100 : 50, overflow: "unset" }}
        dataLength={allMatch.length} //This is important field to render the next data
        next={fetchMoreData}
        hasMore={
          countMatches !== 0 && number === countMatches ? hasMore : false
        }
        loader={<Loading />}
        endMessage={
          <NoMore>
            <b>35 matches at a time</b>
          </NoMore>
        }
      >
        <Matches
          number={number}
          playerSpells={playerSpells}
          mySpells={mySpells}
          playerItems={playerItems}
          myItems={myItems}
          setCountMatches={setCountMatches}
          apiLoading={apiLoading}
        />
      </InfiniteScroll>
    </Root>
  );
};

const mapStateToProps = (state) => {
  return {
    spells: state.spells,
    allMatch: state.allMatch,
    profile: state.profile,
    matchHistory: state.matchHistory,
    myChamp: state.myChamp,
    version: state.version,
    playingTime: state.playingTime,
    profileReady: state.profileReady,
    playerSpells: state.playerSpells,
    mySpells: state.mySpells,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMatchHistory: (value) => dispatch(setMatchHistory(value)),
    setMyChamp: (value) => dispatch(setMyChamp(value)),
    setPlayingTime: (value) => dispatch(setPlayingTime(value)),
    setAllMatch: (value) => dispatch(setAllMatch(value)),
    setPlayerSpells: (value) => dispatch(setPlayerSpells(value)),
    setMySpells: (value) => dispatch(setMySpells(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultPage);
