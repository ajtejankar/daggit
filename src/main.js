const path = require('path');
const nodegit = require('nodegit');
const $ = require('jquery');
const d3 = require('d3');
const getCommitHistory = require(__dirname + '\\src\\commit-history');
const { ipcRenderer, remote } = require('electron');
const { dialog } = remote;


function renderGraph(graph) {
  let i = 0;
  let height = 500;
  let width = 500;
  let sep = 50;
  let radius = 10;

  let tree = d3.layout.tree()
    .size([height, width]);

  let diagonal = d3.svg.diagonal()
    .projection(d => [d.x, d.y]);

  let svg = d3.select('svg#graph')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(50, 50)`);

  let root = graph[0];

  function update(source) {
    let nodes = tree.nodes(root).reverse();
    let links = tree.links(nodes);

    nodes.forEach(d => d.y = d.depth * sep);
    d3.select('svg#graph').attr('height', nodes.length * sep + 50);

    let node = svg.selectAll('g.node')
      .data(nodes, d => d.id || (d.id = ++i));

    let nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    nodeEnter.append('circle')
      .attr('r', radius)
      .style('fill', '#fff');

    let link = svg.selectAll('path.link')
      .data(links, d => d.target.id);

    link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', diagonal);
  }

  update(root);
}

function validateCommits(commits) {
  if (commits === undefined || commits === null ||
      commits.constructor !== Array) {

    throw new Error('Api has to respond with an array of commits');
  }
}

function commitsToGraph(commits) {
  let currentNode, root;
  let revCommits = commits.reverse();

  root = revCommits.shift();
  root.parent = null;
  root.name = root.sha;

  currentNode = root;
  revCommits.forEach(c => {
    currentNode.children = [c];
    c.parent = currentNode.name;
    c.name = c.sha;
    currentNode = c;
  });

  return [ root ];
}

function getCommits(repoPath) {
  getCommitHistory(repoPath)
    .then(commits => {
      $('.graph-container').show();
      $('.welcome').hide();
      validateCommits(commits);
      renderGraph(commitsToGraph(commits));
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

