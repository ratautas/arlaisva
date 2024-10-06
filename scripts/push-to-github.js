import simpleGit from 'simple-git';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_NAME = 'lithuanian-holiday-calendar';
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

if (!GITHUB_TOKEN || !GITHUB_USERNAME) {
  console.error('GitHub token or username not found. Please set the GITHUB_TOKEN and GITHUB_USERNAME environment variables.');
  process.exit(1);
}

const git = simpleGit();

async function pushToGithub() {
  try {
    await git.init();
    await git.add('./*');
    await git.commit('Initial commit');
    
    const remoteUrl = `https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git`;
    await git.addRemote('origin', remoteUrl);
    await git.push('origin', 'master');
    
    console.log('Successfully pushed to GitHub!');
  } catch (error) {
    console.error('Error pushing to GitHub:', error.message);
    process.exit(1);
  }
}

pushToGithub();