// @flow

export class JsonToString {
  toString() {
    return JSON.stringify(this, null, 3);
  }
}

export class Exception {
  type: string;
  message: string;

  constructor(type: string, message: string) {
    this.type = type;
    this.message = message;
  }

  toString() {
    return `${this.type}: ${this.message}`;
  }
}

export class Team extends JsonToString {
  name: string;
  limitations: Array<string>;

  constructor(name: string, limitations: Array<string>) {
    super();
    this.name = name;
    this.limitations = limitations;
  }
}

export class Round extends JsonToString {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}

export class Input extends JsonToString {
  teams: Array<Team>;
  rounds: Array<Round>;
  matchesInRound: number;
  matchesTeamInRound: number;
  maxTeamMatchesConsecutively: number;
  maxTeamPausesConsecutively: number;

  constructor(teams: Array<Team>, rounds: Array<Round>, matchesInRound: number,
    matchesTeamInRound: number, maxTeamMatchesConsecutively: number,
    maxTeamPausesConsecutively: number) {
    super();
    this.teams = teams;
    this.rounds = rounds;
    this.matchesInRound = matchesInRound;
    this.matchesTeamInRound = matchesTeamInRound;
    this.maxTeamMatchesConsecutively = maxTeamMatchesConsecutively;
    this.maxTeamPausesConsecutively = maxTeamPausesConsecutively;
  }
}

export function teamByName(input: Input, teamName: string): Team {
  let result: Team;
  input.teams.forEach((team: Team) => {
    if (team.name === teamName) result = team;
  });
  return result; // eslint-disable-line flowtype-errors/show-errors
}
