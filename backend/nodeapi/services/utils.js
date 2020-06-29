var allowedHeaders = ['Authorization', 'Content-Type', 'x-api-key', 'authtype', 'username', 'name'];
module.exports = {
    sendResponse: function(opts) {
        let response = opts.response;
        let request = opts.request;
        response.setHeader('Access-Control-Allow-Origin', request.headers.origin || '*');
        response.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(','));
        response.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH, OPTIONS');
        response.setHeader('Access-Control-Allow-Credentials', true);
        response.writeHead(200, {
            'Content-Type': opts.contentType || 'application/json'
        });
        if (opts.body || opts.data) {
            response.end(typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body));
        } else {
            response.end();
        }
    }
};