import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

const Rank = ({ ranked }) => {
  const [rankedSolo, setRankedSolo] = useState(null);
  const [rankedFlex, setRankedFlex] = useState(null);

  useEffect(() => {
    if (Object.keys(ranked).length !== 0) {
      setRankedSolo(
        ranked.find((rank) => rank.queueType === "RANKED_SOLO_5x5")
      );
      setRankedFlex(ranked.find((rank) => rank.queueType === "RANKED_FLEX_SR"));
    }
  }, [ranked]);

  if (ranked.length === 0) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div>
        <span style={{ color: "rgb(199 247 255)" }}>Ranked Solo: </span>
        <span style={{ color: "rgb(0 231 255)" }}>
          {rankedSolo
            ? `${rankedSolo.tier} ${rankedSolo.rank} / ${rankedSolo.wins}W /
            ${rankedSolo.losses}L`
            : "Unranked"}
        </span>
      </div>
      <div>
        <span style={{ color: "rgb(199 247 255)" }}>Ranked Flex: </span>
        <span style={{ color: "rgb(0 231 255)" }}>
          {rankedFlex
            ? `${rankedFlex.tier} ${rankedFlex.rank}  ${rankedFlex.wins}W /
            ${rankedFlex.losses}L`
            : "Unranked"}
        </span>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    ranked: state.ranked,
  };
};

//   const mapDispatchToProps = (dispatch) => {
//     return {
//       setRanked: (ranked) => dispatch(setRanked(ranked)),
//     };
//   };

export default connect(mapStateToProps /*mapDispatchToProps*/)(Rank);
