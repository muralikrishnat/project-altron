const path = require('path');
module.exports = {
    configureWebpack: {
        watch: true
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
          // mutate config for production...
        } else {
            config.watch = true;
        }
    }
}