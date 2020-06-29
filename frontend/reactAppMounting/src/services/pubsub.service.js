(function() {
    let pubSubhash = {};
    var PubSub = function(){};
    PubSub.prototype.subscribe = function(eventName, eventFn) {
        if (!pubSubhash[eventName]) {
            pubSubhash[eventName] = [];
        }
        pubSubhash[eventName].push(eventFn);
    };
    PubSub.prototype.publish = function(eventName, eventData) {
        if (pubSubhash[eventName]) {
            pubSubhash[eventName].forEach(eventFn => {
                eventFn(eventData);
            });
        }
    }
    window.pubSub = new PubSub();
})();