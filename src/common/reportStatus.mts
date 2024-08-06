import https from 'https';

export default (token: string,
    repository: string,
    sha: string,
    context: string,
    state: string,
    description: string,
    url?: string) =>
    new Promise((resolve, reject) => {
        const status_req = https.request({
            hostname: 'api.github.com',
            port: 443,
            path: `/repos/${repository}/statuses/${sha}`,
            method: 'POST',
            headers: {
                'User-Agent': 'casaroli',
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${token}`,
                'X-GitHub-Api-Version': '2022-11-28'
            },
        }, (res) => {
            let data = Buffer.alloc(0);
            res.on('data', (d) => {
                data = Buffer.concat([data, d]);
            });
            res.on('close', () => {
                console.log('received statusCode:', res.statusCode);
                if (!res.statusCode || Math.floor(res.statusCode / 100) != 2) {
                    console.error('error, bad statusCode', res.statusCode, 'expected: 2xx');
                    reject();
                }
            });
            res.on('end', () => {
                const str = new TextDecoder().decode(data);
                console.log("received data:", JSON.parse(str));
                resolve(data);
            });
        });

        status_req.on('error', (e) => {
            console.error(e);
            reject();
        });

        status_req.end(JSON.stringify({
            state: state,
            description: description,
            context: context,
            target_url: url || null
        }));
    });