'use strict';

let nodegit = require('nodegit');
let path = require('path');

module.exports = function(repo_path) {
  return nodegit.Repository.open(path.resolve(__dirname, repo_path))
    .then(function(repo) {
      return repo.getMasterCommit();
    })
    .then(function(firstCommitOnMaster) {
      var history = firstCommitOnMaster.history(nodegit.Revwalk.SORT.time);
      var log = [];
      var logPromise = new Promise(function(resolve, reject) {
        history.on("commit", function(commit) {
          log.push(commit);
        });

        history.on("end", function() {
          resolve(log);
        });

        history.on("error", function(err) {
          reject(err);
        });

        history.start();
      });

      return logPromise;
    })
    .then(function(log) {
      return log.map(function(commit) {
        var author = commit.author();

        return {
          message: commit.message(),
          author: {
            name: author.name(),
            email: author.email()
          },
          sha: commit.sha(),
          date: commit.date()
        }
      });
    });
}