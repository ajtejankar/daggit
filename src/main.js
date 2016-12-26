const path = require('path');
const nodegit = require('nodegit');
const $ = require('jquery');
const d3 = require('d3');
const repos = require(__dirname + '\\src\\repos');
const getCommitHistory = require(__dirname + '\\src\\commit-history');

function renderGraph(commits) {
  const svg = d3.select('svg#graph');
  const nodeRadius = 5;
  const edgeLength = 5;
  const x = nodeRadius + 5;
  const y = nodeRadius + 5;

  $('svg#graph circle').remove();

  svg.selectAll('circle')
    .data(commits)
    .enter().append('circle')
      .attr('cy', (d, i) => i * (nodeRadius*2 + edgeLength) + y)
      .attr('cx', x)
      .attr('fill', '#FFAAAA')
      .attr('r', nodeRadius);
}

function validateCommits(commits) {
  if (commits === undefined || commits === null ||
      commits.constructor !== Array) {

    throw new Error('Api has to respond with an array of commits');
  }
}

function getCommits(repo) {
  let repoPath = path.resolve(__dirname, `../${repo}/.git`);
  // let repoPath = path.resolve(__dirname, `.git`);

  getCommitHistory(repoPath)
    .then(commits => {
      validateCommits(commits);
      renderGraph(commits);
    })
    .catch(err => console.log(err));
}

let repoLinks = repos.map(r => {
  return `<a href='?repo=${r.name}'>${r.name}</a>`;
});

$('.left').html(repoLinks.join('\n'));

$('.left a').click(function (ev) {
  let repo = $(this).text();
  getCommits(repo);

  ev.preventDefault();
  ev.stopPropagation();
});

