import { Exception, JsonToString } from './base';

class Tmp extends JsonToString {
  constructor(input) {
    super();
    this.teams = input.teams.slice();
    this.lastTeams = [];
    this.teamsTmp = {};
    this.pairs = {};

    this.teams.forEach(team => {
      this.teamsTmp[team.name] = {
        actualMatches: 0,
        roundMatches: 0,
        consecutive: 0,
        team,
      };
    });

    this.teams.forEach(team => {
      this.pairs[team.name] = {};
      this.teams.forEach(rival => {
        if (team === rival) return;
        this.pairs[team.name][rival.name] = 0;
      });
    });
  }
}

class MatchGeneratorResult extends JsonToString {
  constructor(input) {
    super();
    this.input = input;
    this.totalMatches = input.rounds.length * input.matchesInRound;
    this.rounds = Array(input.rounds.length);
  }
}

class Round extends JsonToString {
  constructor(name, matches) {
    super();
    this.name = name;
    this.matches = matches;
  }
}

class Match extends JsonToString {
  constructor(free, team1, team2) {
    super();
    this.free = free;
    this.team1 = team1.name;
    this.team2 = team2.name;
    this.result = null;
  }
}

export class MatchResult extends JsonToString {
  constructor(pointsTeam1, pointsTeam2, winner) {
    super();
    this.pointsTeam1 = pointsTeam1;
    this.pointsTeam2 = pointsTeam2;
    this.winner = winner;
  }
}

function whoShouldPlay(input, tmp, roundName, rival) {
  tmp.teams.sort((x, y) =>
    tmp.teamsTmp[y.name].consecutive - tmp.teamsTmp[x.name].consecutive,
  );

  if (input.maxTeamPausesConsecutively !== -1) {
    let targetTeamIndex = -1;
    while (true) { // eslint-disable-line no-constant-condition
      targetTeamIndex++;
      if (targetTeamIndex >= tmp.teams.length) break;

      const team = tmp.teams[targetTeamIndex];
      if (team === rival) continue;
      if (team.limitations.includes(roundName)) continue;

      if (!tmp.lastTeams.includes(team.name)) {
        if (tmp.teamsTmp[team.name].consecutive >= input.maxTeamPausesConsecutively) {
          if (input.matchesTeamInRound !== -1 &&
              tmp.teamsTmp[team.name].roundMatches >= input.matchesTeamInRound) {
            throw new Exception('GeneratorException', 'Team reached maximum matches in round and maximal pauses consecutively.');
          }
          return team;
        }
        break;
      }
    }
  }

  tmp.teams.sort((x, y) => {
    if (rival !== null) {
      const matchesDiff = tmp.pairs[x.name][rival.name] - tmp.pairs[y.name][rival.name];
      if (matchesDiff !== 0) return matchesDiff;
    }
    return tmp.teamsTmp[x.name].actualMatches - tmp.teamsTmp[y.name].actualMatches;
  });

  let targetTeamIndex = -1;
  while (true) { // eslint-disable-line no-constant-condition
    targetTeamIndex++;
    if (targetTeamIndex >= tmp.teams.length) return null;

    const team = tmp.teams[targetTeamIndex];
    if (team === rival) continue;
    if (team.limitations.includes(roundName)) continue;

    if (input.matchesTeamInRound !== -1 &&
        tmp.teamsTmp[team.name].roundMatches >= input.matchesTeamInRound) continue;
    if (input.maxTeamMatchesConsecutively !== -1 && tmp.lastTeams.includes(team.name) &&
        tmp.teamsTmp[team.name].consecutive >= input.maxTeamMatchesConsecutively) continue;
    return team;
  }
}

export function generateMatch(input) {
  if (input.teams.length < 2) {
    throw new Exception('InputException', 'Two teams at last required for match generating.');
  }

  const tmp = new Tmp(input);
  const result = new MatchGeneratorResult(input);

  let lastEquation = 0;
  for (let i = 0; i < input.rounds.length; i++) {
    const roundName = input.rounds[i].name;
    const matches = Array(input.matchesInRound);
    for (let j = 0; j < matches.length; j++) {
      const team1 = whoShouldPlay(input, tmp, roundName, null);
      let team2 = null;
      if (team1 !== null) team2 = whoShouldPlay(input, tmp, roundName, team1);

      if (team1 === null || team2 === null) {
        tmp.lastTeams.forEach(teamName => {
          tmp.teamsTmp[teamName].consecutive = 0;
        });
        tmp.lastTeams = [];

        result.totalMatches--;
        matches[j] = new Match(true, null, null);
      } else {
        const oldLastTeams = tmp.lastTeams;
        const newLastTeams = [team1.name, team2.name];
        oldLastTeams.forEach(teamName => {
          if (!newLastTeams.includes(teamName)) {
            tmp.teamsTmp[teamName].consecutive = 0;
          }
        });
        newLastTeams.forEach(teamName => {
          if (!oldLastTeams.includes(teamName)) {
            tmp.teamsTmp[teamName].consecutive = 0;
          }
        });
        tmp.lastTeams = newLastTeams;

        tmp.teamsTmp[team1.name].roundMatches++;
        tmp.teamsTmp[team2.name].roundMatches++;
        tmp.teamsTmp[team1.name].actualMatches++;
        tmp.teamsTmp[team2.name].actualMatches++;

        tmp.pairs[team1.name][team2.name]++;
        tmp.pairs[team2.name][team1.name]++;
        matches[j] = new Match(false, team1, team2);
      }

      tmp.teams.forEach(team => {
        tmp.teamsTmp[team.name].consecutive++;
        if (input.maxTeamMatchesConsecutively !== -1 &&
            tmp.lastTeams.includes(team.name) &&
            tmp.teamsTmp[team.name].consecutive > input.maxTeamMatchesConsecutively) {
          throw new Exception('GeneratorException', 'Too much teams can\'t play at same time.');
        }
        if (input.maxTeamPausesConsecutively !== -1 &&
            !team.limitations.includes(roundName) &&
            !tmp.lastTeams.includes(team.name) &&
            tmp.teamsTmp[team.name].consecutive > input.maxTeamPausesConsecutively) {
          throw new Exception('GeneratorException', 'More then two teams must play at same time.');
        }
      });

      lastEquation++;
      const targetActualMatches = tmp.teamsTmp[tmp.teams[0].name].actualMatches;
      const targetPairsMatches = tmp.pairs[tmp.teams[0].name][tmp.teams[1].name];
      const equals = tmp.teams.every(team =>
        tmp.teamsTmp[team.name].actualMatches === targetActualMatches &&
            tmp.teams.every(rival =>
              team === rival || tmp.pairs[team.name][rival.name] === targetPairsMatches,
            ),
      );
      if (equals) lastEquation = 0;

      console.log(`"equation": ${lastEquation}
         \n"round": ${(i + 1)}
         \n"match": ${(j + 1)}
         \n"matches": ${(i * matches.length) + (j + 1)}
         \n"tmp": ${tmp.toString()}`);
    }

    tmp.teams.forEach(team => {
      tmp.teamsTmp[team.name].roundMatches = 0;
      tmp.teamsTmp[team.name].consecutive = 0;
    });
    result.rounds[i] = new Round(roundName, matches);
  }

  if (lastEquation !== 0) {
    if (lastEquation === (input.rounds.length * input.matchesInRound)) {
      throw new Exception('GeneratorException', 'Can\'t create equality of played matches for all teams.');
    }

    console.log(`Reverting last ${lastEquation} matches to get equality of played matches for all teams.`);
    for (let i = input.rounds.length - 1; i >= 0; i--) {
      for (let j = input.matchesInRound - 1; j >= 0; j--) {
        if (!result.rounds[i].matches[j].free) {
          result.rounds[i].matches[j] = { free: true };
          result.totalMatches--;
        }
        if (--lastEquation === 0) break;
      }
      if (lastEquation === 0) break;
    }
  }
  return result;
}
