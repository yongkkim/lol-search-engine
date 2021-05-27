import React, { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  setMatchHistory,
  setMyChamp,
  setPlayingTime,
  setAllMatch,
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
  spells,
  allMatch,
  profile,
  myChamp,
  version,
  playingTime,
  matchHistory,
  setMatchHistory,
  setMyChamp,
  setPlayingTime,
  setAllMatch,
}) => {
  const [number, setNumber] = useState(7);
  const [prevNumber, setPrevNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [playerSpells, setPlayerSpells] = useState([]);
  const [playerItems, setPlayerItems] = useState([]);
  const [mySpells, setMySpells] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const matchAPI = async () => {
    //Get information of most recent 7 matches (game ids, champion ids, time)
    await fetch(`/api/allmatch?id=${profile.accountId}&number=${number}`)
      .then((res) => res.json())
      .then(async (res) => {
        //get detailed information of each of 7 matches using game ids from the first fetch
        let ids = await res.gameInfo.map((id) => id[0]);

        await Promise.all(ids.map((id) => fetch(`/api/match?gameId=${id}`)))
          .then((allRes) => Promise.all(allRes.map((res) => res.json())))
          .then(async (data) => {
            let values = await data.map((champData) => {
              return champData.data;
            });
            //store results from the first fetch
            await setAllMatch(allMatch.concat(res.gameInfo));

            await setMatchHistory(matchHistory.concat(values));
          })
          .catch((err) => {
            console.error(err);
          });
      });
  };

  useEffect(() => {
    if (prevNumber !== number && Object.keys(profile).length !== 0) {
      matchAPI();
      setPrevNumber(number);
    }
  }, [profile, number]);

  //get a pair of spells from each player (10 in one game) from 7 matches
  const getSpellsDurationGameMode = async () => {
    let mySpellSets = [];
    let gameDuration;
    let gameMode;
    let spellSets = await matchHistory.map((match, i) => {
      gameDuration = match.gameDuration;
      gameMode = match.gameMode;
      return match.participants.map((ptpt) => {
        //Separately save spells from a champion that you played
        if (ptpt.championId === allMatch[i][1]) {
          mySpellSets.push({
            spells: [ptpt.spell1Id, ptpt.spell2Id],
            gameMode: gameMode,
            gameDuration: gameDuration,
          });
        }
        return {
          spells: [ptpt.spell1Id, ptpt.spell2Id],
          gameMode: gameMode,
          gameDuration: gameDuration,
        };
      });
    });
    await setMySpells(Object.assign(mySpells, mySpellSets));
    await setPlayerSpells(Object.assign(playerSpells, spellSets));
  };

  const getItemsKDAWin = async () => {
    let myItemSets = [];
    let itemSets = await matchHistory.map((match, i) => {
      return match.participants.map((ptpt) => {
        //Separately save spells from a champion that you played
        if (ptpt.championId === allMatch[i][1]) {
          console.log(ptpt.stats.win);
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
    await setMyItems(Object.assign(myItems, myItemSets));
    await setPlayerItems(Object.assign(playerItems, itemSets));
  };

  useEffect(() => {
    if (matchHistory.length > 0 && allMatch.length > 0) {
      console.log(matchHistory);
      getSpellsDurationGameMode();
      getItemsKDAWin();
    }
  }, [matchHistory, allMatch]);

  const fetchMoreData = () => {
    if (number === 35) {
      setHasMore(false);
    } else {
      setNumber(number + 7);
    }
  };

  return (
    <Root>
      <InfiniteScroll
        style={{ marginBottom: hasMore ? 100 : 50, overflow: "unset" }}
        dataLength={allMatch.length} //This is important field to render the next data
        next={fetchMoreData}
        hasMore={hasMore}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMatchHistory: (value) => dispatch(setMatchHistory(value)),
    setMyChamp: (value) => dispatch(setMyChamp(value)),
    setPlayingTime: (value) => dispatch(setPlayingTime(value)),
    setAllMatch: (value) => dispatch(setAllMatch(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultPage);
