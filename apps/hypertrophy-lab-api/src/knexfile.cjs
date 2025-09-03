require('ts-node').register({
  project: __dirname + './../tsconfig.tools.json',
  transpileOnly: true,
});

const { default: config } = require('./knexfile.ts');
module.exports = config;
