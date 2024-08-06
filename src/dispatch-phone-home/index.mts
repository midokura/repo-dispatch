import getInput from '../common/getInput.mjs';
import reportStatus from '../common/reportStatus.mjs';
import dispatchWorkflow from './dispatchWorkflow.mjs'

const dispatch_token: string = getInput('dispatch-token');
const dispatch_repository: string = getInput('dispatch-repository');
const dispatch_ref: string = getInput('dispatch-ref');
const dispatch_workflow: string = getInput('dispatch-workflow');
const status_context: string = getInput('status-context');
const status_token: string = getInput('status-token');
const status_repository: string = getInput('status-repository');
const status_sha: string = getInput('status-sha');
const inputs: string = getInput('inputs');
const phone_home_input_name: string = getInput('phone-home-input-name');

const dispatchInputs: { [key: string]: string } = {};

const inputs_obj = JSON.parse(inputs);

console.log('::group::Parse Inputs');

if (inputs_obj[phone_home_input_name]) {
    console.error(`error: cannot have ${phone_home_input_name} in inputs: ${inputs}`);
    throw 'error, bad input'
}

for (const [key, value] of Object.entries(inputs_obj)) {
    if (typeof(value) == 'number' ||
        typeof(value) == 'boolean') {
        dispatchInputs[key] = value.toString();
    }
    else if (typeof(value) == 'string') {
        dispatchInputs[key] = value;
    }
}

dispatchInputs[phone_home_input_name] = `${status_token};${status_repository};${status_sha};${status_context}`;

console.log('inputs:', dispatchInputs);

console.log("::endgroup::");

console.log(`::group::Dispatch ${dispatch_workflow} on ${dispatch_repository}`);

console.log('ref:', dispatch_ref);
console.log('inputs:', dispatchInputs);

await dispatchWorkflow(dispatch_token, dispatch_repository, dispatch_ref, dispatch_workflow, dispatchInputs);

console.log("::endgroup::");

console.log('::group::Report dispatched status to self');

console.log('context:', status_context);

await reportStatus(status_token, status_repository, status_sha, status_context, 'pending', 'Dispatched');

console.log("::endgroup::");
