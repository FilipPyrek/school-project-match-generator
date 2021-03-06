// @flow

type ExceptionType = 'Input' | 'Generator' | 'Unsupported';

export class Exception {
  type: ExceptionType; // Tells what causet the exception
  message: string // Some kind of text, that tells more about problem.
  messageEn: string // Message in English.
  messageCz: string // Message in Czech.

  constructor(type: ExceptionType, messageEn: string, messageCz: string) {
    this.type = type;
    this.message = messageCz;
    this.messageEn = messageEn;
    this.messageCz = messageCz;
  }

  toString() {
    return `${this.type}: ${this.message}`;
  }
}

export type Team = {
  name: string, // Name of the Team. Only for gui purposes.
  forbiddenSeasonsIndexes: Array<number> // Indexes of seasons where team can't play
};

export function makeTeam(
  name: string,
  forbiddenSeasonsIndexes: Array<number>,
) {
  return {
    name,
    forbiddenSeasonsIndexes,
  };
}

export type Input = {
  teams: Array<Team>, // Just array of teams
  seasonsCount: number, // Count of sessions (days, perions, etc.) of playing.
  maxMatchesInSeason: number, // Max amount of matches in one season.
  maxMatchesOfOneTeamInSeason: number, // Max amount of matches of one team in one season.
  maxOneTeamMatchesConsecutivelyInSeason: number, // Maximum of matches in a row of one team.
  maxOneTeamPausesConsecutivelyInSeason: number, // Maximum of pauses in a row of one team.
  allowIncompleteTable: boolean // Allow creating of insomplete games,
  // like all vs all, where everyone won't play with everyone (not enough time to do it).
};

export function makeInput(
  teams: Array<Team>,
  seasonsCount: number,
  maxMatchesInSeason: number,
  maxMatchesOfOneTeamInSeason: number,
  maxOneTeamMatchesConsecutivelyInSeason: number,
  maxOneTeamPausesConsecutivelyInSeason: number,
  allowIncompleteTable: boolean,
) {
  return {
    teams,
    seasonsCount,
    maxMatchesInSeason,
    maxMatchesOfOneTeamInSeason,
    maxOneTeamMatchesConsecutivelyInSeason,
    maxOneTeamPausesConsecutivelyInSeason,
    allowIncompleteTable,
  };
}


export type MatchResult = {
  team1Score?: number | null,
  team2Score?: number | null
};

export type Match = {
  team1Index: number, // Index of first team in input.teams
  team2Index: number, // Index of second team in input.teams
  result?: MatchResult // Result of match,
  // not added (and even not currently used) by generator
};

export type SeasonTable = Array<number | null>; // Array of indexes of matches in result.allMatches

export type AllVsAllTable = Array<Array<number | null>>; // 2D Array of indexes of
// matches in result.allMatches, indexes of rows and columns equals teams indexes

type ResultTmp = {
  nextMatchesIndexPointer: number,
  teamsStatus: {
    [teamIndex: number]: {
      actualMatches: number,
      seasonsMatches: number,
      consecutive: number
    }
  },
  pairs: {
    [teamIndex: number]: {
      [rivalTeamIndex: number]: number
    }
  }
};

function makeResultTmp(input: Input): ResultTmp {
  const resultTmp: ResultTmp = {
    nextMatchesIndexPointer: 0,
    teamsStatus: {},
    pairs: {},
  };

  for (let i = 0; i < input.teams.length; i++) {
    resultTmp.teamsStatus[i] = {
      actualMatches: 0,
      seasonsMatches: 0,
      consecutive: 0,
    };

    resultTmp.pairs[i] = {};
    for (let j = 0; j < input.teams.length; j++) {
      if (i === j) continue;
      resultTmp.pairs[i][j] = 0;
    }
  }

  return resultTmp;
}

type CalcTmp = {
  teamsIndexes: Array<number>,
  teamsIndexesLast: Array<number>,
  lastMatchesEquation: number
};

function makeCalcTmp(input: Input): CalcTmp {
  return {
    teamsIndexes: Array(input.teams.length).fill(-1).map((_, i) => i),
    teamsIndexesLast: [],
    lastMatchesEquation: 0,
  };
}

export type TeamPoints = {
  total: number
};

export type Result = {
  input: Input, // Source of informations for generating result
  resultTmp: ResultTmp, // Holds state of generating.
  // Created for purposes of future result updating.
  allMatches: { [indexId: number]: Match }, // Map of all matches,
  // everywhere else is only indexes ("names") of matches.
  tablesSeasons: Array<SeasonTable>, // Array of Season tables.
  tablesAllVsAll: Array<AllVsAllTable> // Array of AllVsAll tables
};

function makeResult(input: Input): Result {
  return {
    input,
    resultTmp: makeResultTmp(input),
    allMatches: {},
    tablesSeasons: [],
    tablesAllVsAll: [],
  };
}

export type ResultRanking = {
  tableRanking: Array<number>,
  tablePoints: Array<TeamPoints>
};

function makeResultRanging(result: Result): ResultRanking {
  return {
    tableRanking: Array(result.input.teams.length).fill(-1).map((_, i) => i),
    tablePoints: Array(result.input.teams.length).fill(null).map(() => ({ total: 0 })),
  };
}

function addToAllVsAllTable(resultIn: Result, matchIndex: number) {
  const result = resultIn;
  const match: Match = result.allMatches[matchIndex];
  for (let i = 0; i < result.tablesAllVsAll.length; i++) {
    if (result.tablesAllVsAll[i][match.team1Index][match.team2Index] === null
        && result.tablesAllVsAll[i][match.team2Index][match.team1Index] === null) {
      result.tablesAllVsAll[i][match.team1Index][match.team2Index] = matchIndex;
      result.tablesAllVsAll[i][match.team2Index][match.team1Index] = matchIndex;
      return;
    }
  }

  const table: AllVsAllTable = Array(result.input.teams.length)
      .fill(Array(result.input.teams.length).fill(null));
  for (let i = 0; i < table.length; i++) {
    table[i] = Array(result.input.teams.length);
    table[i].fill(null);
  }
  result.tablesAllVsAll.push(table);

  table[match.team1Index][match.team2Index] = matchIndex;
  table[match.team2Index][match.team1Index] = matchIndex;
}

function whoShouldPlay(input: Input, resultTmp: ResultTmp, calcTmp: CalcTmp,
  seasonsIndex: number, rivalIndex: number): number {
  calcTmp.teamsIndexes.sort((teamIndex1: number, teamIndex2: number) =>
    resultTmp.teamsStatus[teamIndex2].consecutive - resultTmp.teamsStatus[teamIndex1].consecutive,
  );

  if (input.maxOneTeamPausesConsecutivelyInSeason !== -1) {
    for (let i = 0; i < calcTmp.teamsIndexes.length; i++) {
      const teamIndex: number = calcTmp.teamsIndexes[i];
      const team: Team = input.teams[teamIndex];

      if (teamIndex === rivalIndex) continue;
      if (team.forbiddenSeasonsIndexes.includes(seasonsIndex)) continue;

      if (!calcTmp.teamsIndexesLast.includes(teamIndex)) {
        if (resultTmp.teamsStatus[teamIndex].consecutive
            >= input.maxOneTeamPausesConsecutivelyInSeason) {
          if (input.maxMatchesOfOneTeamInSeason !== -1 &&
              resultTmp.teamsStatus[teamIndex].seasonsMatches
                >= input.maxMatchesOfOneTeamInSeason) {
            throw new Exception('Generator', 'Team reached maximum matches in season and maximal pauses in a row consecutively.',
                                'Došlo k dosažení maxima zápasů v herním období a maximum přestávek po sobě u jednoho týmu současně.');
          }
          return teamIndex;
        }
        break;
      }
    }
  }

  calcTmp.teamsIndexes.sort((teamIndex1: number, teamIndex2: number) => {
    if (rivalIndex !== -1) {
      const matchesDiff: number = resultTmp.pairs[teamIndex1][rivalIndex]
          - resultTmp.pairs[teamIndex2][rivalIndex];
      if (matchesDiff !== 0) return matchesDiff;
    }
    return resultTmp.teamsStatus[teamIndex1].actualMatches
      - resultTmp.teamsStatus[teamIndex2].actualMatches;
  });

  for (let i = 0; i < calcTmp.teamsIndexes.length; i++) {
    const teamIndex: number = calcTmp.teamsIndexes[i];
    const team: Team = input.teams[teamIndex];

    if (teamIndex === rivalIndex) continue;
    if (team.forbiddenSeasonsIndexes.includes(seasonsIndex)) continue;

    if (input.matchesTeamInRound !== -1
        && resultTmp.teamsStatus[teamIndex].seasonsMatches
          >= input.maxMatchesOfOneTeamInSeason) continue;
    if (input.maxOneTeamMatchesConsecutivelyInSeason !== -1
        && calcTmp.teamsIndexesLast.includes(teamIndex)
        && resultTmp.teamsStatus[teamIndex].consecutive
          >= input.maxOneTeamMatchesConsecutivelyInSeason) continue;
    return teamIndex;
  }
  return -1; // eslint-disable-line no-unreachable
  // if i remove this line, flow shows error, if i add it back eslint shows error...
  // So lets disable eslint.
}

export function generate(input: Input): Result {
  const result = makeResult(input);

  // if (result.resultTmp.nextMatchesIndexPointer !== 0) {
  //   throw new Exception('Unsupported', 'Updating is not currently supported.',
  //                       'Aktualizování soutěže zatím není podporováno.');
  // }

  if (result.input.teams.length < 2) {
    throw new Exception('Input', 'Two teams at last required for competition generating.',
                        'Minimálně 2 týmy jsou vyžadovány pro generování soutěže.');
  }

  const calcTmp = makeCalcTmp(result.input);

  for (let seasonIndex = 0; seasonIndex < result.input.seasonsCount; seasonIndex++) {
    const season: SeasonTable = Array(result.input.maxMatchesInSeason).fill(null);
    for (let matchInSeasonIndex = 0; matchInSeasonIndex < season.length; matchInSeasonIndex++) {
      const teamIndex1: number = whoShouldPlay(result.input, result.resultTmp,
                                               calcTmp, seasonIndex, -1);
      let teamIndex2: number = -1;
      if (teamIndex1 !== -1) {
        teamIndex2 = whoShouldPlay(result.input, result.resultTmp,
                                   calcTmp, seasonIndex, teamIndex1);
      }

      const team1: Team | null = teamIndex1 === -1 ? null : result.input.teams[teamIndex1];
      const team2: Team | null = teamIndex2 === -1 ? null : result.input.teams[teamIndex2];

      if (team1 === null || team2 === null) {
        calcTmp.teamsIndexesLast.forEach((teamIndex: number) => {
          result.resultTmp.teamsStatus[teamIndex].consecutive = 0;
        });
        calcTmp.teamsIndexesLast = [];

        season[matchInSeasonIndex] = null;
      } else {
        const oldLastTeams: Array<number> = calcTmp.teamsIndexesLast;
        const newLastTeams: Array<number> = [teamIndex1, teamIndex2];
        oldLastTeams.forEach((teamIndex: number) => {
          if (!newLastTeams.includes(teamIndex)) {
            result.resultTmp.teamsStatus[teamIndex].consecutive = 0;
          }
        });
        newLastTeams.forEach((teamIndex: number) => {
          if (!oldLastTeams.includes(teamIndex)) {
            result.resultTmp.teamsStatus[teamIndex].consecutive = 0;
          }
        });
        calcTmp.teamsIndexesLast = newLastTeams;

        result.resultTmp.teamsStatus[teamIndex1].seasonsMatches++;
        result.resultTmp.teamsStatus[teamIndex2].seasonsMatches++;
        result.resultTmp.teamsStatus[teamIndex1].actualMatches++;
        result.resultTmp.teamsStatus[teamIndex2].actualMatches++;

        result.resultTmp.pairs[teamIndex1][teamIndex2]++;
        result.resultTmp.pairs[teamIndex2][teamIndex1]++;

        const nextMatchIndex: number = result.resultTmp.nextMatchesIndexPointer;
        result.resultTmp.nextMatchesIndexPointer++;
        result.allMatches[nextMatchIndex] = {
          team1Index: teamIndex1,
          team2Index: teamIndex2,
        };
        season[matchInSeasonIndex] = nextMatchIndex;
        addToAllVsAllTable(result, nextMatchIndex);
      }

      for (let teamIndex = 0; teamIndex < result.input.teams.length; teamIndex++) {
        result.resultTmp.teamsStatus[teamIndex].consecutive++;
        if (result.input.maxOneTeamMatchesConsecutivelyInSeason !== -1 &&
            calcTmp.teamsIndexesLast.includes(teamIndex) &&
            result.resultTmp.teamsStatus[teamIndex].consecutive
              > result.input.maxOneTeamMatchesConsecutivelyInSeason) {
          throw new Exception('Generator', 'Too much teams can\'t play at same time.',
                              'Příliš mnoho týmů nemůže hrát ve stejnou dobu.');
        }
        if (result.input.maxOneTeamPausesConsecutivelyInSeason !== -1 &&
            !result.input.teams[teamIndex].forbiddenSeasonsIndexes.includes(seasonIndex) &&
            !calcTmp.teamsIndexesLast.includes(teamIndex) &&
            result.resultTmp.teamsStatus[teamIndex].consecutive
              > result.input.maxOneTeamPausesConsecutivelyInSeason) {
          throw new Exception('Generator', 'More then two teams must play at same time.',
                              'Více jak dva týmy musí hrát ve stejnou chvíly.');
        }
      }

      calcTmp.lastMatchesEquation++;
      const targetActualMatches: number = result.resultTmp
        .teamsStatus[calcTmp.teamsIndexes[0]].actualMatches;
      const targetPairsMatches: number = result.resultTmp
        .pairs[calcTmp.teamsIndexes[0]][calcTmp.teamsIndexes[1]];
      const equals = calcTmp.teamsIndexes.every((teamIndex: number) =>
        result.resultTmp.teamsStatus[teamIndex].actualMatches === targetActualMatches &&
            calcTmp.teamsIndexes.every((rivalTeamIndex: number) =>
              teamIndex === rivalTeamIndex ||
              result.resultTmp.pairs[teamIndex][rivalTeamIndex] === targetPairsMatches,
            ),
      );
      if (equals) calcTmp.lastMatchesEquation = 0;
      /*
      console.log(`"equation": ${lastEquation}
         \n"round": ${(i + 1)}
         \n"match": ${(j + 1)}
         \n"matches": ${(i * matches.length) + (j + 1)}
         \n"tmp": ${tmp.toString()}`);
      */
    }

    calcTmp.teamsIndexes.forEach((teamIndex: number) => {
      result.resultTmp.teamsStatus[teamIndex].seasonsMatches = 0;
      result.resultTmp.teamsStatus[teamIndex].consecutive = 0;
    });
    result.tablesSeasons[seasonIndex] = season;
  }

  if (!result.input.allowIncompleteTable && calcTmp.lastMatchesEquation !== 0) {
    if (calcTmp.lastMatchesEquation ===
        (result.input.seasonsCount * result.input.maxMatchesInSeason)) {
      throw new Exception('Generator', 'Can\'t create equality of played matches for all teams.',
                          'Nelze vytvořit rovnost zápasů všech týmů, příliš málo zápasů.');
    }

    console.log(`Reverting last ${calcTmp.lastMatchesEquation} matches to get equality of played matches for all teams.`);
    for (let i = result.input.seasonsCount - 1; i >= 0; i--) {
      for (let j = result.input.maxMatchesInSeason - 1; j >= 0; j--) {
        const matchIndex: number | null = result.tablesSeasons[i][j];
        if (matchIndex !== null) {
          result.tablesSeasons[i][j] = null;
          delete result.allMatches[matchIndex];
        }
        if (--calcTmp.lastMatchesEquation === 0) break;
      }
      if (calcTmp.lastMatchesEquation === 0) break;
    }
    result.tablesAllVsAll.pop();
  }

  return result;
}

export function generateRanking(result: Result): ResultRanking {
  const resultRanking: ResultRanking = makeResultRanging(result);

  resultRanking.tablePoints.map(() => ({ total: 0 }));
  Object.keys(result.allMatches) // eslint-disable-line flowtype-errors/show-errors
    .forEach((indexId: string) => {
      const match: Match = result.allMatches[Number(indexId)];

      if (!match.result) return;
      const matchResult: MatchResult = match.result;
      if (!matchResult.team1Score || !matchResult.team2Score) return;

      const team1Points: TeamPoints = resultRanking.tablePoints[match.team1Index];
      const team2Points: TeamPoints = resultRanking.tablePoints[match.team2Index];

      const team1Score: number =
        matchResult.team1Score; // eslint-disable-line flowtype-errors/show-errors
      const team2Score: number =
        matchResult.team2Score; // eslint-disable-line flowtype-errors/show-errors
      if (team1Score > team2Score) {
        team1Points.total += 3;
      } else if (team2Score > team1Score) {
        team2Points.total += 3;
      } else {
        team1Points.total += 1;
        team2Points.total += 1;
      }
    });

  resultRanking.tableRanking.sort((teamIndex1: number, teamIndex2: number) =>
    resultRanking.tablePoints[teamIndex2].total - resultRanking.tablePoints[teamIndex1].total,
  );

  return resultRanking;
}
