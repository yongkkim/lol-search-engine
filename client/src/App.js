import React, { useEffect, useState } from "react";
import styled from "styled-components";
import image from "./components/images/leblanc.jpg";
import ResultPage from "./components/resultPage";
import ErrorAlert from "./components/errorAlert";
import Profile from "./components/profile";
import { connect } from "react-redux";
import {
  setScale,
  setTop,
  setWidth,
  setSubmit,
  setOpacity,
  setError,
  setErrorMsg,
  setUsername,
  setLoading,
  setUserProfile,
  setDragonDataVersion,
  setSpells,
  setPerks,
} from "./components/redux/actions";
import fetch from "node-fetch";

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  z-index: 1;
`;

const BackgroundImg = styled.div`
  position: fixed;
  min-height: inherit;
  width: 100%;
  background-image: url(${(p) => p.image});
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-attachment: scroll;
  z-index: -1;
`;

const Overlay = styled.div`
  position: fixed;
  opacity: ${(p) => (p.checkProfile ? `0.6` : `0`)};
  background-color: black;
  min-height: inherit;
  width: 100%;
  z-index: -1;
  transition: opacity 1s 1.5s ease-in-out;
`;

const SearchContainer = styled.div`
  position: absolute;
  min-height: inherit;
  width: 100%;
  opacity: ${(p) => p.opacity};
  transform: scale(${(p) => p.scale});
  ${(p) => p.submit && `background-color: rgba(0, 0, 0, 0.1);`};
  transition: opacity 1.5s ease-in-out, transform 2s 3s;
  z-index: -1;
`;

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: ${(p) => (p.show ? `1` : `0`)};
  visibility: ${(p) => (p.show ? `visible` : `hidden`)};
  transition: visibility 1s 1s linear, opacity 1s 1s ease-in-out;
`;

const SearchForm = styled.form`
  position: absolute;
  width: 100%;
  margin: 0 auto;
  top: ${(p) => p.top}px;
  opacity: ${(p) => p.opacity};
  transition: opacity 1s 1.5s ease-in-out, top 0.5s 1.5s linear;
`;

const FormElement = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  opacity: ${(p) => (p.submit ? `0` : p.opacity)};
  text-align: center;
  color: white;
  transition: opacity 0.5s 1s ease-in-out;
  width: 30%;
  margin: 0 auto;
`;

const Underline = styled.hr`
  border: 0;
  border-bottom: 8px solid #57c4d0;
  width: ${(p) => (p.submit ? `0` : p.width)}%;
  margin-top: 0;
  margin-bottom: 20px;
  transition: width 1s ${(p) => (p.submit ? `1s` : `3.5s`)} ease-in-out;
`;

const Searchbar = styled.input.attrs({
  type: "text",
  placeholder: "Type username",
})`
  height: 30px;
  width: 27%;
  padding-left: 10px;
  border: none;

  &:focus {
    outline: none;
  }
`;

const Submit = styled.input.attrs({ type: "submit", value: "GO" })`
  height: 32px;
  background-color: #57c4d0;
  color: white;
  font-size: 20px;
  outline: none;
  font-weight: bold;
  border: none;
  cursor: pointer;
`;

const App = ({
  opacity,
  scale,
  width,
  top,
  submit,
  error,
  username,
  profile,
  loading,
  version,
  setOpacity,
  setScale,
  setWidth,
  setTop,
  setSubmit,
  setError,
  setErrorMsg,
  setUsername,
  setLoading,
  setUserProfile,
  setDragonDataVersion,
  setSpells,
  setPerks,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    let cleanedUsername = username.replace(/['"]+/g, "").trim();
    if (cleanedUsername !== "") {
      setLoading(true);
      await fetch(`/api/profile?username=${cleanedUsername}`)
        .then((res) => res.json())
        .then((data) => {
          setUserProfile(data.data);
        });

      setSubmit(true);
      setError(false);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } else {
      setErrorMsg("Username should not be empty");
    }
  };

  const handleChange = (e) => {
    let input = e.target.value;
    if (input.length < 17) {
      setUsername(input);
    } else {
      setError(true);
      setErrorMsg("Username should be no more than 16 characters");
    }
  };

  useEffect(() => {
    const resource = async () => {
      setOpacity(1);
      setScale(1.05);
      setWidth(30);
      await fetch("https://ddragon.leagueoflegends.com/api/versions.json")
        .then((res) => res.json())
        .then(async (data) => {
          await setDragonDataVersion(data[0]);
          await fetch(`/api/spells?version=${data[0]}`)
            .then((res) => res.json())
            .then((data) => {
              setSpells(data);
            });
          await fetch(`/api/perks?version=${data[0]}`)
            .then((res) => res.json())
            .then((data) => {
              setPerks(data);
            });
        });
    };

    resource();
  }, []);

  useEffect(() => {
    if (submit) {
      setTop(-50);
    } else {
    }
  }, [submit]);

  return (
    <Container>
      <BackgroundImg image={image}></BackgroundImg>
      <Overlay checkProfile={Object.keys(profile).length !== 0}></Overlay>
      <SearchContainer opacity={opacity} scale={scale}>
        <SearchForm
          opacity={opacity}
          top={top}
          onSubmit={(e) => handleSubmit(e)}
        >
          <TitleContainer>
            <Title opacity={opacity} submit={Object.keys(profile).length !== 0}>
              Get your match history!
            </Title>
            <Underline
              width={width}
              submit={Object.keys(profile).length !== 0}
            />
          </TitleContainer>
          <FormElement>
            <Searchbar onChange={handleChange} value={username} />
            <Submit />
          </FormElement>
          {error && <ErrorAlert />}
        </SearchForm>
      </SearchContainer>
      <ResultContainer show={Object.keys(profile).length !== 0 && !loading}>
        <Profile />
        <ResultPage />
      </ResultContainer>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    version: state.version,
    loading: state.loading,
    profile: state.profile,
    opacity: state.opacity,
    submit: state.submit,
    top: state.top,
    width: state.width,
    scale: state.scale,
    error: state.error,
    username: state.username,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setOpacity: (value) => dispatch(setOpacity(value)),
    setSubmit: (value) => dispatch(setSubmit(value)),
    setTop: (value) => dispatch(setTop(value)),
    setWidth: (value) => dispatch(setWidth(value)),
    setScale: (value) => dispatch(setScale(value)),
    setUsername: (value) => dispatch(setUsername(value)),
    setErrorMsg: (errorMsg) => dispatch(setErrorMsg(errorMsg)),
    setError: (error) => dispatch(setError(error)),
    setLoading: (loading) => dispatch(setLoading(loading)),
    setUserProfile: (username) => dispatch(setUserProfile(username)),
    setDragonDataVersion: (version) => dispatch(setDragonDataVersion(version)),
    setSpells: (value) => dispatch(setSpells(value)),
    setPerks: (value) => dispatch(setPerks(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
