const getCommitHistory = require('../src/commit-history.js');
const path = require('path');
const repoPath = path.resolve(__dirname, '../../nodegit/.git');
const assert = require('chai').assert;

describe('getCommitHistory', () => {
  it('should return a list of commits', () => {
    return getCommitHistory(repoPath)
      .then(commits => {
        for (let commit of commits) {
          assert.isString(commit.sha);
          assert.isString(commit.message);
          assert.isString(commit.author);
          assert(commit.date.constructor === Date);

          for (let parent of commit.parents) {
            assert.isString(parent);
          }
        }
      });
  });
});
