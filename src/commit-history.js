const nodegit = require('nodegit');

function getCommitHistory(repoPath) {
  return nodegit.Repository.open(repoPath)
    .then(repo => repo.getMasterCommit())
    .then(firstCommitOnMaster => {
      let history = firstCommitOnMaster.history(nodegit.Revwalk.SORT.time);
      let commitsP = new Promise((resolve, reject) => {
        history.on('end', commits => {
          resolve(commits.map(commit => {
            return {
              sha: commit.sha(),
              parents: commit.parents().map(oid => oid.toString()),
              date: commit.date(),
              message: commit.message(),
              author: commit.author().name()
            };
          }));
        });

        history.on('error', error => {
          reject(error);
        });
      });

      history.start();

      return commitsP;
    });
}

module.exports = getCommitHistory;
