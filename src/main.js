const path = require('path');
const nodegit = require('nodegit');
const $ = require('jquery');
const d3 = require('d3');
const { repos } = require(__dirname + '\\src\\repos');
const getCommitHistory = require(__dirname + '\\src\\commit-history');

function renderGraph(graph, firsNodeKey) {
  let queue = [graph[firsNodeKey]];
  let nodeRadius = 25;
  let edgeLength = 60;
  let svg = $('#graph')[0];
  let x = nodeRadius + 50;
  let y = nodeRadius + 20;

  $(svg).children('circle, text, line').remove();

  while (queue.length) {
    let node = queue.shift();

    if (node.parents) {
      for (let p of node.parents) {
        if (graph[p]) {
          queue.push(graph[p]);
        }
      }
    }

    let circle = document.createElementNS(svg.namespaceURI, 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', nodeRadius);
    circle.setAttribute('fill', '#FFAAAA');
    svg.appendChild(circle);

    let sha = document.createElementNS(svg.namespaceURI, 'text');
    sha.textContent = node.sha.substr(0, 5);
    sha.setAttribute('x', x);
    sha.setAttribute('y', y+4);
    sha.setAttribute('text-anchor', 'middle');
    sha.setAttribute('fill', '#444');
    svg.appendChild(sha);

    if (queue.length) {
      let edge = document.createElementNS(svg.namespaceURI, 'line');
      edge.setAttribute('stroke', '#999');
      edge.setAttribute('stroke-width', '2');
      edge.setAttribute('marker-end', 'url(#Triangle)');
      edge.setAttribute('x1', x);
      edge.setAttribute('y1', `${y+nodeRadius+edgeLength}`);
      edge.setAttribute('x2', x);
      edge.setAttribute('y2', `${y+nodeRadius+10}`);
      svg.appendChild(edge);
    }

    y += nodeRadius*2 + edgeLength;
    svg.setAttribute('height', y);
    svg.setAttribute('width', x+100);
   }
}

function renderGraphD3(commits) {
  const svg = d3.select('svg#graph');
  const nodeRadius = 5;
  const edgeLength = 5;
  const x = nodeRadius + 5;
  const y = nodeRadius + 5;

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

  getCommitHistory(repoPath)
    .then(commits => {
      validateCommits(commits);

      let graph = {};
      let firsNodeKey = commits[0].sha;

      for (let commit of commits) {
        graph[commit.sha] = commit;
      }

      // renderGraph(graph, firsNodeKey);
      renderGraphD3(commits);
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
  window.history.pushState({}, '', `/?repo=${repo}`);

  ev.preventDefault();
  ev.stopPropagation();
});

let repo = window.location.search.slice(1).split('=')[1];

if (repo) {
  getCommits(repo);
  window.history.pushState({}, '', `/?repo=${repo}`);
}
