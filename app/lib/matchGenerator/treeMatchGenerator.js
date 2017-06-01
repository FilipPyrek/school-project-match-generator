// @flow

import { Input, Team, Exception, JsonToString } from './base';

class TreeTmp extends JsonToString {
  teams: Array<Team>;
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

class TreeMatchGeneratorResult extends JsonToString {
  input: Input;
  tmp: TreeTmp;
  totalMatches: number;
  rounds: Array<TreeRound>;
  tree: Array<Array<TreeMatch>>;

  constructor(input: Input) {
    super();
    this.input = input;
    this.tmp = new TreeTmp(input);
    this.totalMatches = 0;
    this.rounds = Array(input.rounds.length);
    this.tree = [];
  }
}

class TreeRound extends JsonToString {
  name: string;
  matches: Array<TreeMatch>;

  constructor(name: string, matches: Array<TreeMatch>) {
    super();
    this.name = name;
    this.matches = matches;
  }
}

class TreeMatch extends JsonToString {
  free: boolean;
  team1: string;
  team2: string;
  result: TreeMatchResult | null;

  constructor(free: boolean, team1: Team, team2: Team) {
    super();
    this.free = free;
    this.team1 = team1.name;
    this.team2 = team2.name;
    this.result = null;
  }
}

class TreeMatchResult extends JsonToString {
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

function generateTreeMatch(input: Input) {
  if (input.teams.length < 2) {
    throw new Exception('InputException', 'Two teams at last required for match generating.');
  }

  const result = new TreeMatchGeneratorResult(input);
  updateTreeMatch(result);
  return result;
}

function updateTreeMatch(treeMatchGeneratorResult: TreeMatchGeneratorResult) {
  // TODO: implement
}
