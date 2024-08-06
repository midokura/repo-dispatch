import https from 'https';

export default function dispatchWorkflow(token: string, repository: string, ref: string, workflow: string, inputs: { [key: string]: string }) {
    const status_req = https.request({
        hostname: 'api.github.com',
        port: 443,
        path: `/repos/${repository}/actions/workflows/${workflow}/dispatches`,
        method: 'POST',
        headers: {
            'User-Agent': 'casaroli',
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${token}`,
            'X-GitHub-Api-Version': '2022-11-28'
        },
    }, (res) => {
        res.on('data', (d) => {
            const str = new TextDecoder().decode(d);
            console.log("received data:", str);
        });
        res.on('close', () => {
            console.log('received statusCode:', res.statusCode);
            if (!res.statusCode || Math.floor(res.statusCode/100) != 2) {
                console.error('error, bad statusCode', res.statusCode, 'expected 2xx');
                throw "bad status code";
            }
        })
    });

    status_req.write(JSON.stringify({
        ref: ref,
        inputs: inputs
    }));

    status_req.on('error', (e) => {
        console.error(e);
        throw "request error";
    });

    status_req.end();
}