export class JsonToString {
  toString() {
    return JSON.stringify(this, null, 3);
  }
}

export class Exception {
  constructor(type, message) {
    this.type = type;
    this.message = message;
  }

  toString() {
    return `${this.type}: ${this.message}`;
  }
}

export class Team extends JsonToString {
  constructor(name, limitations) {
    super();
    this.name = name;
    this.limitations = limitations;
  }
}

export class Round extends JsonToString {
  constructor(name) {
    super();
    this.name = name;
  }
}

export class Input extends JsonToString {
  constructor(teams, rounds, matchesInRound,
    matchesTeamInRound, maxTeamMatchesConsecutively, maxTeamPausesConsecutively) {
    super();
    this.teams = teams;
    this.rounds = rounds;
    this.matchesInRound = matchesInRound;
    this.matchesTeamInRound = matchesTeamInRound;
    this.maxTeamMatchesConsecutively = maxTeamMatchesConsecutively;
    this.maxTeamPausesConsecutively = maxTeamPausesConsecutively;
  }
}
