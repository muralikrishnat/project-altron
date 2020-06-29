(function() {
    var store = {};
    var storeHash = {};
    var SM = function(){};
    SM.prototype.saveStore = function(dataToSave, moduleName) {
        if (moduleName) {
            store[moduleName] = Object.assign({}, store[moduleName], dataToSave);
            if (storeHash[moduleName]) {
                storeHash[moduleName].forEach(eventFn => {
                    eventFn(store[moduleName]);
                });
            }
        }
    };
    SM.prototype.getStore = function(moduleName) {
        return store[moduleName]
    };
    SM.prototype.subscribe = function(moduleName, eventFn) {
        if (!storeHash[moduleName]) {
            storeHash[moduleName] = [];
        }
        storeHash[moduleName].push(eventFn);
    }
    window.store = new SM();
})();