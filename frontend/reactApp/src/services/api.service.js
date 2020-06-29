var makeRequest = (opts) => {
    let fetchObject = {
        method: opts.method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (opts.data) {
        fetchObject['body'] = JSON.stringify(opts.data);
    }
    return fetch(opts.url, fetchObject).then(resp => resp.json());
}
var api = {
    post: (opts) => {
        opts.method = 'POST';
        return makeRequest(opts);
    },
    get: (opts) => {
        opts.method = 'GET';
        return makeRequest(opts);
    },
    delete: (opts) => {
        opts.method = 'DELETE';
        return makeRequest(opts);
    }
};
export default api;