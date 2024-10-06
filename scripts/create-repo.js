import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_NAME = 'lithuanian-holiday-calendar';

if (!GITHUB_TOKEN) {
  console.error('GitHub token not found. Please set the GITHUB_TOKEN environment variable.');
  process.exit(1);
}

try {
  const createRepoCommand = `curl -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/user/repos -d '{"name":"${REPO_NAME}"}'`;
  execSync(createRepoCommand);
  console.log(`Repository '${REPO_NAME}' created successfully.`);
} catch (error) {
  console.error('Error creating repository:', error.message);
  process.exit(1);
}