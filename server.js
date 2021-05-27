const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const APP_PORT = 5000;
const app = express();

app.use(cors());

app.route("/api/spells").get((req, res) => {
  fetch(
    "http://ddragon.leagueoflegends.com/cdn/" +
      req.query.version +
      "/data/en_US/summoner.json"
  )
    .then((res) => res.json())
    .then((data) => {
      res.send(Object.values(data.data));
    });
});

app.route("/api/perks").get((req, res) => {
  fetch(
    "http://ddragon.leagueoflegends.com/cdn/" +
      req.query.version +
      "/data/en_US/runesReforged.json"
  )
    .then((res) => res.json())
    .then((data) => {
      res.send(data);
    });
});

app.route("/api/findChampion/").get((req, res) => {
  fetch(
    "http://ddragon.leagueoflegends.com/cdn/" +
      req.query.version +
      "/data/en_US/champion.json"
  )
    .then((res) => res.json())
    .then((data) => {
      let champ = Object.values(data.data).find((champion) => {
        return champion.key === req.query.champNum;
      });
      res.send({ champ });
    })
    .catch((err) => {
      res.send(err);
    });
});

app.route("/api/playedChampDetail/").get((req, res) => {
  fetch(
    "http://ddragon.leagueoflegends.com/cdn/" +
      req.query.version +
      "/data/en_US/champion/" +
      req.query.champ +
      ".json"
  )
    .then((res) => res.json())
    .then((data) => {
      res.send(data.data);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.route("/api/spell/").get((req, res) => {
  fetch(
    "http://ddragon.leagueoflegends.com/cdn/" +
      req.query.version +
      "/data/en_US/summoner.json"
  )
    .then((res) => res.json())
    .then((data) => {
      res.send({ data });
    })
    .catch((err) => {
      res.send(err);
    });
});

app.route("/api/item/").get((req, res) => {
  fetch(
    "https://ddragon.leagueoflegends.com/cdn/" +
      req.query.version +
      "/data/en_US/item.json"
  )
    .then((res) => res.json())
    .then((data) => {
      res.send({ data });
    })
    .catch((err) => {
      res.send(err);
    });
});

app.route("/api/profile/").get((req, res) => {
  fetch(
    "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
      req.query.username +
      "?api_key=RGAPI-823ed1f4-600d-48ae-803c-ebbfa25ad58e"
  )
    .then((res) => res.json())
    .then((data) => {
      res.send({ data });
    })
    .catch((err) => {
      res.send(err);
    });
});

app.route("/api/ranked/").get((req, res) => {
  fetch(
    "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" +
      req.query.summonerID +
      "?api_key=RGAPI-823ed1f4-600d-48ae-803c-ebbfa25ad58e"
  )
    .then((res) => res.json())
    .then((data) => {
      res.send({ data });
    })
    .catch((err) => {
      res.send(err);
    });
});

app.route("/api/allmatch/").get((req, res) => {
  fetch(
    "https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/" +
      req.query.id +
      "?endIndex=" +
      req.query.number +
      "&beginIndex=" +
      (req.query.number - 7) +
      "&api_key=RGAPI-823ed1f4-600d-48ae-803c-ebbfa25ad58e"
  )
    .then((res) => res.json())
    .then((data) => {
      let gameInfo = data.matches.map((game) => [
        game.gameId,
        game.champion,
        game.timestamp,
      ]);
      res.send({ gameInfo });
    })
    .catch((err) => {
      res.send(err);
    });
});

app.route("/api/match/").get((req, res) => {
  fetch(
    "https://na1.api.riotgames.com/lol/match/v4/matches/" +
      req.query.gameId +
      "?api_key=RGAPI-823ed1f4-600d-48ae-803c-ebbfa25ad58e"
  )
    .then((res) => res.json())
    .then((data) => {
      res.send({ data });
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(APP_PORT, () => {
  console.log("Server started!");
});
