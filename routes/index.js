"use strict";

const requireAll = require('require-all');

module.exports = server => {
    // Attach route for public folder
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                index: true,
                listing: false
            }
        }
    });

    requireAll({
        dirname: __dirname,
        filter: /(.+Routes)\.js$/,
        excludeDirs: /^\.(git|svn)$/,
        recursive: true,
        resolve: (attachRoutes) => attachRoutes(server)
    });
};
