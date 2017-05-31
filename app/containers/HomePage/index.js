// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import Home from '../../components/Home';
import { Team, Round, Input } from '../../lib/matchGenerator/base';
import { generateMatch } from '../../lib/matchGenerator/matchGenerator';
// import { generateTreeMatch } from '../../lib/matchGenerator/treeMatchGenerator';

function generateTestResult() {
  const TEAMS_COUNT = 6;
  const ROUNDS_COUNT = 12;
  const MATCHES_IN_ROUND = 4;
  const MATCHES_TEAM_IN_ROUND = 4;
  const MAX_TEAM_MATCHES_CONSECUTIVELY = 2;
  const MAX_TEAM_PAUSES_CONSECUTIVELY = -1;

  const teams = Array(TEAMS_COUNT).fill(0).map((_, i) => new Team(`${i + 1}. Team`, []));
  console.log(teams);
  teams[1].limitations = ['10. Round'];
  const rounds = Array(ROUNDS_COUNT).fill(0).map((_, i) => new Round(`${i + 1}. Round`));
  const input = new Input(teams, rounds, MATCHES_IN_ROUND, MATCHES_TEAM_IN_ROUND,
      MAX_TEAM_MATCHES_CONSECUTIVELY, MAX_TEAM_PAUSES_CONSECUTIVELY);

  const a = generateMatch(input);
  console.log(a);
  return a;
}

export default class HomePage extends Component {
  render() {
    // generateTestResult();
    return (
      <div>
        {/* <Home /> */}
        <Link to="/pick-sport">Pick sport</Link>
        <Link to="/edit">Edit</Link>
      </div>
    );
  }
}
