import getInput from '../common/getInput.mjs';
import reportStatus from '../common/reportStatus.mjs';

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

console.log(`::group::Report started status to ${repository}:${sha}`);

console.log('context:', context);
console.log('target_url:', target_url);

await reportStatus(token, repository, sha, custom_context || context, 'pending', 'Started', target_url);

console.log("::endgroup::");
