// @flow

import { Input, Team, Exception, JsonToString, teamByName } from './base';

class Tmp extends JsonToString {
  teams: Array<string>;
  lastTeams: Array<string>;
  teamsTmp: {
    [team_name: string]: {
      actualMatches: number,
      roundMatches: number,
      consecutive: number,
      team: Team
    }
  };
  pairs: {
    [team_name: string]: {
      [rival_team_name: string]: number
    }
  };

  constructor(input: Input) {
    super();
    this.teams = Array(input.teams.length);
    this.lastTeams = [];
    this.teamsTmp = {};
    this.pairs = {};

    let i = 0;
    input.teams.forEach((team: Team) => {
      this.teams[i++] = team.name;
      this.teamsTmp[team.name] = {
        actualMatches: 0,
        roundMatches: 0,
        consecutive: 0,
        team,
      };
    });

    this.teams.forEach((teamName: string) => {
      this.pairs[teamName] = {};
      this.teams.forEach((rivalTeamName: string) => {
        if (teamName === rivalTeamName) return;
        this.pairs[teamName][rivalTeamName] = 0;
      });
    });
  }
}

class MatchGeneratorResult extends JsonToString {
  input: Input;
  totalMatches: number;
  rounds: Array<Round>;
  tables: Array<Array<Array<{
    roundName: string,
    matchIndex: number
  }>>>;

  constructor(input: Input) {
    super();
    this.input = input;
    this.totalMatches = input.rounds.length * input.matchesInRound;
    this.rounds = Array(input.rounds.length);
    this.tables = [];
  }
}

class Round extends JsonToString {
  name: string;
  matches: Array<Match>;

  constructor(name: string, matches: Array<Match>) {
    super();
    this.name = name;
    this.matches = matches;
  }
}

class Match extends JsonToString {
  free: boolean;
  team1: string | null;
  team2: string | null;
  result: MatchResult | null;

  constructor(free: boolean, team1: Team | null, team2: Team | null) {
    super();
    this.free = free;
    this.team1 = team1 ? team1.name : null;
    this.team2 = team2 ? team2.name : null;
    this.result = null;
  }
}

export class MatchResult extends JsonToString { // More universal, ideally interface
  pointsTeam1: number;
  pointsTeam2: number;
  winner: string;

  constructor(pointsTeam1: number, pointsTeam2: number, winner: string) {
    super();
    this.pointsTeam1 = pointsTeam1;
    this.pointsTeam2 = pointsTeam2;
    this.winner = winner;
  }
}

function whoShouldPlay(input: Input, tmp: Tmp, roundName: string, rival: Team | null): Team | null {
  tmp.teams.sort((teamName1: string, teamName2: string) =>
    tmp.teamsTmp[teamName2].consecutive - tmp.teamsTmp[teamName1].consecutive,
  );

  if (input.maxTeamPausesConsecutively !== -1) {
    let targetTeamIndex: number = -1;
    while (true) { // eslint-disable-line no-constant-condition
      targetTeamIndex++;
      if (targetTeamIndex >= tmp.teams.length) break;

      const team: Team = teamByName(input, tmp.teams[targetTeamIndex]);
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

  tmp.teams.sort((teamName1: string, teamName2: string) => {
    if (rival !== null) {
      const matchesDiff: number = tmp.pairs[teamName1][rival.name]
          - tmp.pairs[teamName2][rival.name];
      if (matchesDiff !== 0) return matchesDiff;
    }
    return tmp.teamsTmp[teamName1].actualMatches - tmp.teamsTmp[teamName2].actualMatches;
  });

  let targetTeamIndex: number = -1;
  while (true) { // eslint-disable-line no-constant-condition
    targetTeamIndex++;
    if (targetTeamIndex >= tmp.teams.length) return null;

    const team: Team = teamByName(input, tmp.teams[targetTeamIndex]);
    if (team === rival) continue;
    if (team.limitations.includes(roundName)) continue;

    if (input.matchesTeamInRound !== -1 &&
        tmp.teamsTmp[team.name].roundMatches >= input.matchesTeamInRound) continue;
    if (input.maxTeamMatchesConsecutively !== -1 && tmp.lastTeams.includes(team.name) &&
        tmp.teamsTmp[team.name].consecutive >= input.maxTeamMatchesConsecutively) continue;
    return team;
  }
  return null; // eslint-disable-line no-unreachable
}

export function generateMatch(input: Input) {
  if (input.teams.length < 2) {
    throw new Exception('InputException', 'Two teams at last required for match generating.');
  }

  const tmp: Tmp = new Tmp(input);
  const result: MatchGeneratorResult = new MatchGeneratorResult(input);

  let lastEquation: number = 0;
  for (let i = 0; i < input.rounds.length; i++) {
    const roundName: string = input.rounds[i].name;
    const matches: Array<Match> = Array(input.matchesInRound);
    for (let j = 0; j < matches.length; j++) {
      const team1: Team | null = whoShouldPlay(input, tmp, roundName, null);
      let team2: Team | null = null;
      if (team1 !== null) team2 = whoShouldPlay(input, tmp, roundName, team1);

      if (team1 === null || team2 === null) {
        tmp.lastTeams.forEach((teamName: string) => {
          tmp.teamsTmp[teamName].consecutive = 0;
        });
        tmp.lastTeams = [];

        result.totalMatches--;
        matches[j] = new Match(true, null, null);
      } else {
        const oldLastTeams: Array<string> = tmp.lastTeams;
        const newLastTeams: Array<string> = [team1.name, team2.name];
        oldLastTeams.forEach((teamName: string) => {
          if (!newLastTeams.includes(teamName)) {
            tmp.teamsTmp[teamName].consecutive = 0;
          }
        });
        newLastTeams.forEach((teamName: string) => {
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

      input.teams.forEach((team: Team) => {
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
      const targetActualMatches: number = tmp.teamsTmp[tmp.teams[0]].actualMatches;
      const targetPairsMatches: number = tmp.pairs[tmp.teams[0]][tmp.teams[1]];
      const equals = tmp.teams.every((teamName: string) =>
        tmp.teamsTmp[teamName].actualMatches === targetActualMatches &&
            tmp.teams.every((rivalTeamName: string) =>
              teamName === rivalTeamName ||
              tmp.pairs[teamName][rivalTeamName] === targetPairsMatches,
            ),
      );
      if (equals) lastEquation = 0;
      /*
      console.log(`"equation": ${lastEquation}
         \n"round": ${(i + 1)}
         \n"match": ${(j + 1)}
         \n"matches": ${(i * matches.length) + (j + 1)}
         \n"tmp": ${tmp.toString()}`);
      */
    }

    tmp.teams.forEach((teamName: string) => {
      tmp.teamsTmp[teamName].roundMatches = 0;
      tmp.teamsTmp[teamName].consecutive = 0;
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
          result.rounds[i].matches[j] = new Match(true, null, null);
          result.totalMatches--;
        }
        if (--lastEquation === 0) break;
      }
      if (lastEquation === 0) break;
    }
  }
  return result;
}
