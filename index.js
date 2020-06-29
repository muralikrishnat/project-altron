var fs = require('fs');
var path = require('path');
var url = require('url');

var allowedHeaders = ['Authorization', 'Content-Type', 'x-api-key'];

var sendResponse = function(opts) {
    let response =  otps.response;
    let request = opts.request;
    response.setHeader('Access-Control-Allow-Origin', request.headers.origin || '*');
    response.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(','));
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH, OPTIONS');
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.writeHead(200, {
        'Content-Type': opts.contentType || 'application/json'
    });
    if (opts.body) {
        response.end(opts.body);
    } else {
        response.end();
    }

};

var initServer = function(opts) {
    let fePort = opts.fePort || 7679;
    let folder = opts.folder || 'editor-dist';
    require('http').createServer((request, response) => {
        if (request.method === 'OPTIONS') {
             sendResponse({
                 request, response
             });
        } else if (request.method === 'POST') {
            if (request.url.indexOf('/api') >= 0) {

            }
        } else if (request.method === 'GET') {
            if (request.url.indexOf('/api') >= 0 && request.url.indexOf('/api.') < 0) {

            } else {
                let parsedUrl = url.parse(request.url);
                let fileName = parsedUrl.pathname === '/' ? 'index.html' : parsedUrl.pathname;
                let filePath = path.join(__dirname, folder, fileName);
                if (fs.existsSync(filePath)) {
                    var stat = fs.statSync(filePath);
                    let contentType = 'application/json';
                    let fExtension = fileName.substr(fileName.lastIndexOf('.'))
                    switch (fExtension) {
                        case '.html':
                            contentType = 'text/html';
                            break;
                        case '.icon':
                            contentType = 'image/x-icon';
                            break;
                        case '.svg':
                            contentType = 'image/svg+xml';
                            break;
                        case '.css':
                            contentType = 'text/css';
                            break;
                        case '.css.gz':
                            contentType = 'text/css';
                            break;
                        case '.js':
                            contentType = 'application/javascript';
                            break;
                        default:
                            break;
                    }
                    let responseHeaders = {
                        'Content-Type': contentType,
                        'Content-Length': stat.size
                    };
                    if (fileName.indexOf('.css.gz') >= 0) {
                        responseHeaders['Content-Type'] = 'text/css';
                        responseHeaders['Content-Encoding'] = 'gzip';
                        responseHeaders['Content-Length'] = stat.size;
                    }
                    response.setHeader('Access-Control-Allow-Origin', request.headers.origin || '*');
                    response.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(','));
                    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH, OPTIONS');
                    response.setHeader('Access-Control-Allow-Credentials', true);
                    response.writeHead(200, responseHeaders);
                    var readStream = fs.createReadStream(filePath);
                    readStream.pipe(response);

                } else {
                    let filePath = path.join(__dirname, folder, 'index.html');
                    if (fs.existsSync(filePath)) {
                        let stat = fs.statSync(filePath);
                        let contentType = 'text/html';
                        response.writeHead(200, {
                            'Content-Type': contentType,
                            'Content-Length': stat.size
                        });
                        let readStream = fs.createReadStream(filePath);
                        readStream.pipe(response);
                    } else {
                        response.end();
                    }
                }
            }
        }
    }).listen(fePort, () => {
        console.log('Server Listining on ' + fePort);
    })
};

let port = process.env.PORT || 3434,
    folder = 'build',
    endpoint = "dev",
    ssl = false,
    host = '0.0.0.0';
if (process.argv) {
    process.argv.forEach((p) => {
        if (p.indexOf('--port=') >= 0) {
            port = parseInt(p.split('=')[1]);
        }
    });
    process.argv.forEach((p) => {
        if (p.indexOf('--folder=') >= 0) {
            folder = p.split('=')[1];
        }
    });
    process.argv.forEach((p) => {
        if (p.indexOf('--endpoint=') >= 0) {
            endpoint = p.split('=')[1];
        }
    });
    process.argv.forEach((p) => {
        if (p.indexOf('--host=') >= 0) {
            host = p.split('=')[1];
        }
    });
    process.argv.forEach((p) => {
        if (p.indexOf('--ssl=') >= 0) {
            if (p.split('=')[1] && p.split('=')[1] === 'false') {
                ssl = false;
            }
        }
    });
}

initServer({
    fePort: port,
    folder
});