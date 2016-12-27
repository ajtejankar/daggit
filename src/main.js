const path = require('path');
const nodegit = require('nodegit');
const $ = require('jquery');
const d3 = require('d3');
const getCommitHistory = require(__dirname + '\\src\\commit-history');
const { ipcRenderer, remote } = require('electron');
const { dialog } = remote;

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

function getCommits(repoPath) {
  getCommitHistory(repoPath)
    .then(commits => {
      $('.graph-container').show();
      $('.welcome').hide();
      validateCommits(commits);
      renderGraph(commits);
    })
    .catch(err => {
      // TODO: Is a native dialog needed? Use alert box?
      dialog.showErrorBox('Could not open the git repo', err + '');
    });
}

ipcRenderer.on('open-repo', (ev, message) => {
  console.log(ev, message);
  getCommits(message);
});

