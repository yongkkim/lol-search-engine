import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  setMatchHistory,
  setPlayedChamp,
  setPlayingTime,
} from "./redux/actions";

import { Divider } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

const useStyles = makeStyles((theme) =>
  createStyles({
    divider: {
      marginTop: 25,
      marginBottom: 25,
      backgroundColor: "grey",
      height: 2,
    },
    subPerkContainer: {
      backgroundColor: "black",
      marginLeft: 1,
      width: 30,
      height: 30,
      textAlign: "center",
    },
  })
);

const SpellPerkContainer = styled.div`
  display: flex;
  align-content: center;
  margin-left: 20px;
  width: 70px;
  flex-wrap: wrap;
`;
const MainPerkDesc = styled.div`
  position: absolute;
  height: auto;
  opacity: 0;
  padding: 7px;
  top: ${(p) => p.pos};
  transition: opacity 0.1s ease-in-out;
`;

const SubPerkDesc = styled.div`
  position: absolute;
  height: 0;
  opacity: 0;
  padding: 7px;
  top: ${(p) => p.pos}
  transition: opacity 0.1s ease-in-out;
`;

const Match = styled.div`
  display: flex;
  color: white;
  height: 100px;
  margin-top: 10px;
  width: 100%;
  background-color: ${(p) =>
    p.win ? "rgba(155, 158, 255, 0.7)" : "rgba(255, 170, 170, 0.7)"};
  border-radius: 5px;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  &
    ${Match}:nth-child(${(p) => p.mIndex + 1})
    ${SpellPerkContainer}
    ${MainPerkDesc} {
    height: ${(p) => (p.hoverMainPerk ? "auto" : "0")};
    opacity: ${(p) => (p.hoverMainPerk ? "1" : "0")};
  }
  &
    ${Match}:nth-child(${(p) => p.sIndex + 1})
    ${SpellPerkContainer}
    ${SubPerkDesc} {
    height: ${(p) => (p.hoverSubPerk ? "auto" : "0")};
    opacity: ${(p) => (p.hoverSubPerk ? "1" : "0")};
  }
`;

const Champ = styled.img`
  width: 95px;
  height: 95px;
  align-self: center;
  margin-left: 3px;
  border-radius: 5px;
`;

const ItemContainer = styled(SpellPerkContainer)`
  min-width: 210px;
`;
const KDA = styled(SpellPerkContainer)`
  min-width: 68px;
`;
const DateAndDuration = styled(SpellPerkContainer)`
  flex-direction: column;
  justify-content: center;
  min-width: 76px;
`;

const WinAndGameMode = styled(DateAndDuration)``;

const Spell = styled.img`
  border-radius: 3px;
  width: 30px;
  height: 30px;
  margin-bottom: 1px;
  ${(p) => p.index && `margin-left: 1px;`}
`;

const Perk = styled.img`
  border-radius: 3px;
  width: ${(p) => (p.subPerk ? "25px" : "30px")};
  height: ${(p) => (p.subPerk ? "23px" : "30px")};
  ${(p) => p.subPerk && `margin-top:3px`};
  ${(p) => !p.subPerk && `background-color: black`};
`;

const Item = styled(Spell)`
  margin-left: 0;
  margin-bottom: 0;
`;

const Matches = ({
  apiLoading,
  profileReady,
  spells,
  perks,
  number,
  playerSpells,
  mySpells,
  myItems,
  allMatch,
  version,
  setCountMatches,
  setPlayedChamp,
  playedChamp,
  setPlayingTime,
  playingTime,
}) => {
  const classes = useStyles();

  const imageUrl =
    "http://ddragon.leagueoflegends.com/cdn/" + version + "/img/champion/";

  const spellUrl =
    "http://ddragon.leagueoflegends.com/cdn/" + version + "/img/spell/";

  const itemUrl =
    "http://ddragon.leagueoflegends.com/cdn/" + version + "/img/item/";

  const perkUrl =
    "https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/";

  const [matchesLoading, setMatchesLoading] = useState(false);
  const [desc, setDesc] = useState("");
  const [spellSet, setSpellSet] = useState({});
  const [mySpellSet, setMySpellSet] = useState({});
  const [myPerkSet, setMyPerkSet] = useState({});
  const [myItemSet, setMyItemSet] = useState({});
  const [hoverMainPerk, setHoverMainPerk] = useState(false);
  const [hoverSubPerk, setHoverSubPerk] = useState(false);
  const [mPerkDecIndex, setMPerkDescIndex] = useState(0);
  const [sPerkDecIndex, setSPerkDescIndex] = useState(0);
  const [mPerkDescPos, setMPerkDescPos] = useState(0);
  const [sPerkDescPos, setSPerkDescPos] = useState(0);

  const findSpell = (key) => {
    const foundkey = spells.find((spell) => {
      return spell.key === key.toString();
    });
    return foundkey;
  };

  const findPerk = (perkTypeKey, perkKey, name) => {
    let found = false;
    let perkInfo;
    for (let i = 0; i < perks.length && !found; i++) {
      if (name === "main" && perks[i].id === perkTypeKey) {
        for (let r = 0; r < perks[i].slots[0].runes.length && !found; r++) {
          if (perks[i].slots[0].runes[r].id === perkKey) {
            perkInfo = {
              perkImg: perks[i].slots[0].runes[r].icon.toLocaleLowerCase(),
              perkDesc: perks[i].slots[0].runes[r].longDesc,
            };
            found = true;
          }
        }
      } else if (name === "sub" && perks[i].id === perkTypeKey) {
        perkInfo = {
          perkImg: perks[i].icon.toLocaleLowerCase(),
          perkDesc: perkTypeKey,
        };
      }
    }

    return perkInfo;
  };

  const getAllSpellInfo = () => {
    let twoSpells = [];
    let tenPlayersSpells = [];
    let sevenGameSpells = {};
    let pyrspells = playerSpells.slice(number - 7, number);
    for (let i = 0; i < pyrspells.length; i++) {
      for (let keys of pyrspells[i]) {
        for (let key of keys.spells) {
          twoSpells.push(findSpell(key));
        }
        tenPlayersSpells.push(twoSpells);
        twoSpells = [];
      }
      sevenGameSpells[i] = tenPlayersSpells;
      tenPlayersSpells = [];
    }

    return sevenGameSpells;
  };

  const getMyspellInfo = () => {
    let twoSpells = [];
    let mySevenGameSpells = {};
    let spells = mySpells.slice(number - 7, number);
    spells.forEach((spell, i) => {
      spell.spells.forEach((s, index) => {
        twoSpells.push(findSpell(s));
      });
      mySevenGameSpells[number - 7 + i] = twoSpells;
      twoSpells = [];
    });

    return mySevenGameSpells;
  };

  const getMyPerksInfo = () => {
    let twoPerks = {};
    let mySevenGamePerks = {};
    let items = myItems.slice(number - 7, number);
    items.forEach((item, i) => {
      twoPerks["mainPerk"] = findPerk(
        item.mainPerk[0],
        item.mainPerk[1],
        "main"
      );
      twoPerks["subPerk"] = findPerk(item.subPerk, "", "sub");
      mySevenGamePerks[number - 7 + i] = twoPerks;
      twoPerks = {};
    });

    return mySevenGamePerks;
  };

  const champList = async () => {
    let timeStamps = await allMatch
      .slice(number - 7, number)
      .map((match) => match[2]);
    setPlayingTime(playingTime.concat(timeStamps));

    let champInfo = await allMatch
      .slice(number - 7, number)
      .map((champion) => champion[1]);

    let championInfo = await Promise.all(
      champInfo.map((champ) =>
        fetch(`/api/findChampion?version=${version}&champNum=${champ}`)
      )
    );
    let champJsonInfo = await Promise.all(
      championInfo.map((res) => res.json())
    );
    let champDetails = await Promise.all(
      champJsonInfo.map((champ) =>
        fetch(
          `/api/playedChampDetail?version=${version}&champ=${champ.champ.id}`
        )
      )
    );
    let champJsonDetails = await Promise.all(
      champDetails.map((res) => res.json())
    );
    let champsData = await champJsonDetails.map((champ) => {
      return Object.values(champ)[0];
    });
    setMySpellSet({ ...mySpellSet, ...getMyspellInfo() });
    setMyPerkSet({ ...myPerkSet, ...getMyPerksInfo() });
    setPlayedChamp(playedChamp.concat(champsData));
  };

  useEffect(() => {
    if (profileReady && !apiLoading) {
      setMatchesLoading(true);
      champList();
      setSpellSet(getAllSpellInfo());
      setMatchesLoading(false);
    }
  }, [profileReady, apiLoading]);

  useEffect(() => {
    setCountMatches(Object.keys(mySpellSet).length);
  }, [mySpellSet]);

  const getGameDuration = (timeInSeconds) => {
    return Math.floor(timeInSeconds / 60);
  };

  const setMainPerkDesc = (e, i) => {
    let perkPos = e.target.parentNode.getBoundingClientRect();
    setHoverMainPerk(true);
    setMPerkDescIndex(i + 1);
    setMPerkDescPos(perkPos.top);
  };

  const setSubPerkDesc = (e, i) => {
    let perkPos = e.target.parentNode.getBoundingClientRect();
    setHoverSubPerk(true);
    setSPerkDescIndex(i + 1);
    setSPerkDescPos(perkPos.top);
  };

  console.log("from matches", Object.keys(mySpellSet).length);

  return (
    <Root
      hoverMainPerk={hoverMainPerk}
      hoverSubPerk={hoverSubPerk}
      mIndex={mPerkDecIndex}
      sIndex={sPerkDecIndex}
    >
      <Divider className={classes.divider} />
      {!matchesLoading &&
        playedChamp.map((champ, i) => (
          <Match
            key={i + "_" + champ.key + "_" + champ.id}
            win={myItems[i].win}
          >
            <Champ src={imageUrl + champ.image.full} />
            <SpellPerkContainer key={i + "_Spell"}>
              {mySpellSet[i].map((s, r) => (
                <Spell
                  key={i + "_" + r + "_Spell"}
                  src={spellUrl + s.image.full}
                  index={r !== 0}
                />
              ))}
              <Perk
                key={i + "_" + "_mainPerk"}
                src={perkUrl + myPerkSet[i].mainPerk.perkImg}
                onMouseOver={(e) => setMainPerkDesc(e, i)}
                onMouseOut={() => {
                  setHoverMainPerk(false);
                  setMPerkDescIndex(i + 1);
                }}
              />
              {/* {myPerkSet[i].mainPerk.perkDesc} */}
              <div className={classes.subPerkContainer}>
                <Perk
                  key={i + "_" + "_subPerk"}
                  subPerk={true}
                  src={perkUrl + myPerkSet[i].subPerk.perkImg}
                  onMouseOver={(e) => setSubPerkDesc(e, i)}
                  onMouseOut={() => {
                    setHoverSubPerk(false);
                    setSPerkDescIndex(i + 1);
                  }}
                />
              </div>
            </SpellPerkContainer>
            <ItemContainer key={i + "_Item"}>
              {myItems[i].items.map(
                (item, t) =>
                  item !== 0 && (
                    <Item
                      key={i + "_" + t + "_Item"}
                      src={itemUrl + item + ".png"}
                    />
                  )
              )}
            </ItemContainer>
            <KDA>{myItems[i].kda}</KDA>
            <DateAndDuration>
              <span>
                {new Date(playingTime[i]).toLocaleDateString("en-US")}
              </span>
              <span>{getGameDuration(mySpells[i].gameDuration)} mins</span>
            </DateAndDuration>
            <WinAndGameMode>
              <span style={{ color: myItems[i].win ? "#0106B7" : "#C30000" }}>
                {myItems[i].win ? "Victory" : "Defeat"}
              </span>
              <span>{mySpells[i].gameMode}</span>
            </WinAndGameMode>
          </Match>
        ))}
    </Root>
  );
};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    spells: state.spells,
    perks: state.perks,
    playingTime: state.playingTime,
    allMatch: state.allMatch,
    matchHistory: state.matchHistory,
    myChamp: state.myChamp,
    version: state.version,
    playedChamp: state.playedChamp,
    profileReady: state.profileReady,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMatchHistory: (value) => dispatch(setMatchHistory(value)),
    setPlayedChamp: (value) => dispatch(setPlayedChamp(value)),
    setPlayingTime: (value) => dispatch(setPlayingTime(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Matches);
