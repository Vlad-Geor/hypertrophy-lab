require('ts-node').register({
  project: __dirname + '/../tsconfig.app.json',
  transpileOnly: true,
});

const { default: config } = require('./knexfile.ts');
module.exports = config;
