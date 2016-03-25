"use strict";

module.exports = server => {
    server
        .route({
            method: 'GET',
            path: '/hello-world',
            handler: (request, reply) => {
                reply(`Hello World!`);
            }
        });
};
