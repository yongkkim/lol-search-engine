import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import { setRanked } from "./redux/actions";
import Rank from "./rank";

const ProfileContainer = styled.div`
  margin-top: 80px;
  position: relative;
`;

const ProfileDetail = styled.div`
  color: white;
  display: flex;
`;

const BasicInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-left: 10px;
`;

const ProfileImage = styled.img`
  width: 130px;
  height: 130px;
`;

const Profile = ({ profile, loading, version, ranked, setRanked }) => {
  useEffect(() => {
    if (Object.keys(profile).length !== 0) {
      let rankedAPI = async () => {
        let response = await fetch(`/api/ranked?summonerID=${profile.id}`);
        response = await response.json();
        setRanked(response.data);
      };
      rankedAPI();
    }
  }, [profile]);

  const profileImage =
    Object.keys(profile).length !== 0
      ? "http://ddragon.leagueoflegends.com/cdn/" +
        version +
        "/img/profileicon/" +
        profile.profileIconId +
        ".png"
      : "";

  return (
    <ProfileContainer>
      <ProfileDetail>
        <ProfileImage
          src={profileImage}
          submit={Object.keys(profile).length !== 0}
        />
        <BasicInfo>
          <div>
            <span style={{ color: "rgb(199 247 255)" }}>Username: </span>
            <span style={{ color: "rgb(255 188 188)" }}>{profile.name}</span>
          </div>
          <div>
            <span style={{ color: "rgb(199 247 255)" }}>Summoner Level: </span>
            <span style={{ color: "rgb(0 231 255)" }}>
              {profile.summonerLevel}
            </span>
          </div>
          {ranked.length !== 0 && <Rank />}
        </BasicInfo>
      </ProfileDetail>
    </ProfileContainer>
  );
};
const mapStateToProps = (state) => {
  return {
    username: state.username,
    profile: state.profile,
    loading: state.loading,
    version: state.version,
    ranked: state.ranked,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRanked: (ranked) => dispatch(setRanked(ranked)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
