const fs = require('fs');
const http2 = require('http2');
const path = require('path')
const url = require('url')
const mime = require('mime-types')
const { HTTP2_HEADER_PATH } = http2.constants

function getFileDescriptors(baseDir) {
    const files = new Map()
    fs.readdirSync(baseDir).forEach((fileName) => {
        const filePath = path.join(baseDir, fileName)
        const fileDescriptor = fs.openSync(filePath, 'r')
        const stat = fs.fstatSync(fileDescriptor)
        const contentType = mime.lookup(filePath)

        files.set(`/${fileName}`, {
            fileDescriptor,
            headers: {
                'content-length': stat.size,
                'last-modified': stat.mtime.toUTCString(),
                'content-type': contentType
            }
        })
    });
    return files;
}

function pushJsFiles(stream, filePath, publicFolder) {
    const fileDescriptor = fs.openSync(path.join(__dirname, publicFolder, filePath), 'r');
    const stat = fs.fstatSync(fileDescriptor);
    const contentType = mime.lookup(filePath);
    let file = {
        fileDescriptor,
        headers: {
            'content-length': stat.size,
            'last-modified': stat.mtime.toUTCString(),
            'content-type': contentType
        }
    };

    stream.pushStream({
        [HTTP2_HEADER_PATH]: filePath
    }, (err, pushStream) => {
        if (pushStream) {
            pushStream.respondWithFD(file.fileDescriptor, file.headers)
        }
    })
}

function http2Server(opts) {
    const publicFolder = opts.folder || 'public';
    var onRequest = function(request, response) {
        if (request.url.indexOf('/api') >= 0) {
            if (request.method === 'GET') {

            }
            if (request.method === 'POST') {

            }
        } else {
            var reqUrl = request.url === '/' ? '/index.html' : request.url;
            var files = getFileDescriptors(path.join(__dirname, publicFolder));
            var file = files.get(reqUrl);
            if (reqUrl === '/index.html') {
                // pushJsFiles(response.stream, "/css/global.css", publicFolder);
                pushJsFiles(response.stream, "/ng-elements.js", publicFolder);
            }
            if (file) {
                response.stream.respondWithFD(file.fileDescriptor, file.headers);
            } else {
                let filePath = path.join(__dirname, publicFolder, url.parse(request.url).pathname);
                if (fs.existsSync(filePath)) {
                    const fileDescriptor = fs.openSync(filePath, 'r')
                    const stat = fs.fstatSync(fileDescriptor)
                    const contentType = mime.lookup(filePath)
                    response.stream.respondWithFD(fileDescriptor, {
                        'content-length': stat.size,
                        'last-modified': stat.mtime.toUTCString(),
                        'content-type': contentType
                    });
                } else {
                    response.end("");
                }
            }
        }
    };
    const server = http2.createSecureServer({
        key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
        cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt'))
    }, onRequest);

    server.listen(opts.port, (err) => {
        if (err) {
            console.error(err)
            return;
        }
        console.log(`Server listening on ${opts.port}`)
    });
}
http2Server({
    port: 443
})