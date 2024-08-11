import getInput from '../common/getInput.mjs';
import reportStatus from '../common/reportStatus.mjs';
import listJobs from './listJobs.mjs';
import getState from './getState.mjs';

import child_process from "child_process";

const phone_home_input: string = getInput('phone-home-input');
const target_url: string = getInput('target-url');
const custom_context: string = getInput('context');

const phone_home_list = phone_home_input.split(';');

if (phone_home_list.length < 4) {
    console.error('bad phone home input:', phone_home_input);
    throw 'bad phone home input'
}

const token = phone_home_list[0];
const repository = phone_home_list[1];
const sha = phone_home_list[2];
const context = phone_home_list.slice(3).join(';');

console.log(`::group::Get current job status`);

const run_id = process.env['GITHUB_RUN_ID'] || ''

console.log('Run ID:', run_id);

console.log('List JObs', listJobs(token, repository, run_id));

const jobs = await listJobs(token, repository, run_id);

console.log("Job ID", getState('job_id'));

console.log(child_process.execSync("env").toString())


console.log("::endgroup::");

console.log(`::group::Report finished status to ${repository}:${sha}`);

console.log('context:', context);
console.log('target_url:', target_url);

await reportStatus(token, repository, sha, custom_context || context, 'success', 'Finished', target_url);

console.log("::endgroup::");
