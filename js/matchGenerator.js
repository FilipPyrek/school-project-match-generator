function newTeam (name, limitations) {
  return {
    name: name,
    limitations: limitations,
    toString: function () {
      return JSON.stringify(this, null, 3)
    }
  }
}

function newRound (name) {
  return {
    name: name,
    toString: function () {
      return JSON.stringify(this, null, 3)
    }
  }
}

function newInput (teams, rounds, matchesInRound, matchesTeamInRound, maxTeamMatchesConsecutively, maxTeamPausesConsecutively) {
  let input = {
    teams: teams,
    rounds: rounds,
    matchesInRound: matchesInRound,
    matchesTeamInRound: matchesTeamInRound,
    maxTeamMatchesConsecutively: maxTeamMatchesConsecutively,
    maxTeamPausesConsecutively: maxTeamPausesConsecutively,
    toString: function () {
      return JSON.stringify(this, null, 3)
    }
  }
  return input
}

function newException (type, message) {
  return {
    type: type,
    message: message,
    toString: function () {
      return this.type + ': ' + this.message
    }
  }
}

function _prepareTmp (input) {
  let tmp = {
    teams: input.teams.slice(),
    lastTeams: [],
    teamsTmp: {},
    pairs: {},
    toString: function () {
      return JSON.stringify(this, null, 3)
    }
  }
  tmp.teams.forEach(team => {
    tmp.teamsTmp[team.name] = {
      actualMatches: 0,
      roundMatches: 0,
      consecutive: 0,
      team: team
    }
  })
  tmp.teams.forEach(team => {
    tmp.pairs[team.name] = {}
    tmp.teams.forEach(rival => {
      if (team === rival) return
      tmp.pairs[team.name][rival.name] = 0
    })
  })
  return tmp
}

function _whoCanPlay (input, tmp, roundName, rival) {
  tmp.teams.sort(function (x, y) {
    return tmp.teamsTmp[y.name].consecutive - tmp.teamsTmp[x.name].consecutive
  })

  if (input.maxTeamPausesConsecutively !== -1) {
    let targetTeamIndex = -1
    while (true) {
      targetTeamIndex++
      if (targetTeamIndex >= tmp.teams.length) break

      let team = tmp.teams[targetTeamIndex]
      if (team === rival) continue
      if (team.limitations.includes(roundName)) continue

      if (!tmp.lastTeams.includes(team.name)) {
        if (tmp.teamsTmp[team.name].consecutive >= input.maxTeamPausesConsecutively) {
          if (input.matchesTeamInRound !== -1 &&
              tmp.teamsTmp[team.name].roundMatches >= input.matchesTeamInRound) {
            throw newException('GeneratorException', 'Team reached maximum matches in round and maximal pauses consecutively.')
          }
          return team
        } else break
      }
    }
  }

  tmp.teams.sort((x, y) => {
    if (rival !== null) {
      let matchesDiff = tmp.pairs[x.name][rival.name] - tmp.pairs[y.name][rival.name]
      if (matchesDiff !== 0) return matchesDiff
    }
    return tmp.teamsTmp[x.name].actualMatches - tmp.teamsTmp[y.name].actualMatches
  })

  let targetTeamIndex = -1
  while (true) {
    targetTeamIndex++
    if (targetTeamIndex >= tmp.teams.length) return null

    let team = tmp.teams[targetTeamIndex]
    if (team === rival) continue
    if (team.limitations.includes(roundName)) continue

    if (input.matchesTeamInRound !== -1 &&
        tmp.teamsTmp[team.name].roundMatches >= input.matchesTeamInRound) continue
    if (input.maxTeamMatchesConsecutively !== -1 && tmp.lastTeams.includes(team.name) &&
        tmp.teamsTmp[team.name].consecutive >= input.maxTeamMatchesConsecutively) continue
    return team
  }
}

function generateMatch (input) {
  if (input.teams.length < 2) {
    throw newException('InputException', 'Two teams at last required for match generating.')
  }
  let tmp = _prepareTmp(input)
  let result = {
    input: input,
    totalMatches: input.rounds.length * input.matchesInRound,
    rounds: Array(input.rounds.length),
    toString: function () {
      return JSON.stringify(this, null, 3)
    }
  }

  let lastEquation = 0
  for (let i = 0; i < input.rounds.length; i++) {
    let roundName = input.rounds[i].name
    let matches = Array(input.matchesInRound)
    for (let j = 0; j < matches.length; j++) {
      let team1 = _whoCanPlay(input, tmp, roundName, null)
      let team2 = null
      if (team1 !== null) team2 = _whoCanPlay(input, tmp, roundName, team1)

      if (team1 === null || team2 === null) {
        tmp.lastTeams.forEach(teamName => {
          tmp.teamsTmp[teamName].consecutive = 0
        })
        tmp.lastTeams = []

        result.totalMatches--
        matches[j] = {free: true}
      } else {
        let oldLastTeams = tmp.lastTeams
        let newLastTeams = [team1.name, team2.name]
        oldLastTeams.forEach(teamName => {
          if (!newLastTeams.includes(teamName)) {
            tmp.teamsTmp[teamName].consecutive = 0
          }
        })
        newLastTeams.forEach(teamName => {
          if (!oldLastTeams.includes(teamName)) {
            tmp.teamsTmp[teamName].consecutive = 0
          }
        })
        tmp.lastTeams = newLastTeams

        tmp.teamsTmp[team1.name].roundMatches++
        tmp.teamsTmp[team2.name].roundMatches++
        tmp.teamsTmp[team1.name].actualMatches++
        tmp.teamsTmp[team2.name].actualMatches++

        tmp.pairs[team1.name][team2.name]++
        tmp.pairs[team2.name][team1.name]++
        matches[j] = {
          free: false,
          team1: team1,
          team2: team2
        }
      }

      tmp.teams.forEach(team => {
        tmp.teamsTmp[team.name].consecutive++
        if (input.maxTeamMatchesConsecutively !== -1 &&
            tmp.lastTeams.includes(team.name) &&
            tmp.teamsTmp[team.name].consecutive > input.maxTeamMatchesConsecutively) {
          throw newException('GeneratorException', 'Too much teams can\'t play at same time.')
        }
        if (input.maxTeamPausesConsecutively !== -1 &&
            !team.limitations.includes(roundName) &&
            !tmp.lastTeams.includes(team.name) &&
            tmp.teamsTmp[team.name].consecutive > input.maxTeamPausesConsecutively) {
          throw newException('GeneratorException', 'More then two teams must play at same time.')
        }
      })

      lastEquation++
      let targetActualMatches = tmp.teamsTmp[tmp.teams[0].name].actualMatches
      let targetPairsMatches = tmp.pairs[tmp.teams[0].name][tmp.teams[1].name]
      let equals = tmp.teams.every(team => {
        return tmp.teamsTmp[team.name].actualMatches === targetActualMatches &&
            tmp.teams.every(rival => {
              return team === rival || tmp.pairs[team.name][rival.name] === targetPairsMatches
            })
      })
      if (equals) lastEquation = 0

      console.log('"equation": ' + lastEquation +
          '\n"round": ' + (i + 1) +
          '\n"match": ' + (j + 1) +
          '\n"matches": ' + (i * matches.length + (j + 1)) +
          '\n"tmp": ' + tmp.toString())
    }

    tmp.teams.forEach(team => {
      tmp.teamsTmp[team.name].roundMatches = 0
      tmp.teamsTmp[team.name].consecutive = 0
    })
    result.rounds[i] = {
      name: roundName,
      matches: matches
    }
  }

  if (lastEquation !== 0) {
    if (lastEquation === (input.rounds.length * input.matchesInRound)) {
      throw newException('GeneratorException', 'Can\'t create equality of played matches for all teams.')
    }

    console.log('Reverting last ' + lastEquation + ' matches to get equality of played matches for all teams.')
    for (let i = input.rounds.length - 1; i >= 0; i--) {
      for (let j = input.matchesInRound - 1; j >= 0; j--) {
        if (!result.rounds[i].matches[j].free) {
          result.rounds[i].matches[j] = {free: true}
          result.totalMatches--
        }
        if (--lastEquation === 0) break
      }
      if (lastEquation === 0) break
    }
  }
  return result
}
