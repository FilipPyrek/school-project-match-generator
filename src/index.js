import 'normalize.css';
import './../public/index.css';
import 'babel-polyfill';
import $ from 'jquery';

import {Team, Round, Input} from './matchGenerator/base';
import { generateMatch } from './matchGenerator/matchGenerator';
import { generateTreeMatch } from './matchGenerator/treeMatchGenerator';

function generateTestResult() {
  let TEAMS_COUNT = 6;
  let ROUNDS_COUNT = 12;
  let MATCHES_IN_ROUND = 4;
  let MATCHES_TEAM_IN_ROUND = 4;
  let MAX_TEAM_MATCHES_CONSECUTIVELY = 2;
  let MAX_TEAM_PAUSES_CONSECUTIVELY = -1;

  let teams = Array(TEAMS_COUNT);
  for (let i = 0; i < teams.length; i++) teams[i] = new Team((i + 1) + '. Team', []);
  teams[1].limitations = ['10. Round'];
  let rounds = Array(ROUNDS_COUNT);
  for (let i = 0; i < rounds.length; i++) rounds[i] = new Round((i + 1) + '. Round');
  let input = new Input(teams, rounds, MATCHES_IN_ROUND, MATCHES_TEAM_IN_ROUND,
      MAX_TEAM_MATCHES_CONSECUTIVELY, MAX_TEAM_PAUSES_CONSECUTIVELY);

  return generateMatch(input);
}

$(document).ready(() => {
  document.getElementById('content').innerHTML =
    '<pre>' + generateTestResult() + '</pre>';
});
