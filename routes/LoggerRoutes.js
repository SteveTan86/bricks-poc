"use strict";

module.exports = server => {
    server
        .route({
            method: 'GET',
            path: '/test-logger',
            handler: (request, reply) => {

            }
        });
};
