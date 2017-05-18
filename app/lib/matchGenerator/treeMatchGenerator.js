import { Exception, JsonToString } from './base';

class TreeTmp extends JsonToString {
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

class TreeMatchGeneratorResult extends JsonToString {
  constructor(input) {
    super();
    this.input = input;
    this.tmp = new TreeTmp(input);
    this.totalMatches = 0;
    this.rounds = Array(input.rounds.length);
    this.tree = [];
  }
}

class TreeRound extends JsonToString {
  constructor(name, matches) {
    super();
    this.name = name;
    this.matches = matches;
  }
}

class TreeMatch extends JsonToString {
  constructor(free, team1, team2) {
    super();
    this.free = free;
    this.team1 = team1.name;
    this.team2 = team2.name;
    this.result = null;
  }
}

class TreeMatchResult extends JsonToString {
  constructor(pointsTeam1, pointsTeam2, winner) {
    super();
    this.pointsTeam1 = pointsTeam1;
    this.pointsTeam2 = pointsTeam2;
    this.winner = winner;
  }
}

function generateTreeMatch(input) {
  if (input.teams.length < 2) {
    throw new Exception('InputException', 'Two teams at last required for match generating.');
  }

  const result = new TreeMatchGeneratorResult(input);
  updateTreeMatch(result);
  return result;
}

function updateTreeMatch(treeMatchGeneratorResult) {
  // TODO: implement
}
