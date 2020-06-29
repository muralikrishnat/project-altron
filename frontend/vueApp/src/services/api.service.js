(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.api = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
    var makeRequest = async (opts) => {
        let fetchObject = {
            method: opts.method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (opts.body) {
            fetchObject['body'] = JSON.stringify(opts.data);
        }
        return fetch(opts.url, fetchObject).then(resp => resp.json());
    }
    return {
        post: async (opts) => {
            opts.method = 'POST';
            return makeRequest(opts);
        },
        get: async (opts) => {
            opts.method = 'GET';
            return makeRequest(opts);
        }
    };
})