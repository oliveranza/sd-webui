const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'http://127.0.0.1:7860/',
    secure: false,
    logLevel: 'debug',
    pathRewrite: {'^/api' : ''}
  },
  {
    context: ['/v1'],
    target: 'http://localhost:3000/',
    secure: false,
    logLevel: 'debug',
    pathRewrite: {'^/v1' : ''}
  }
];

module.exports = PROXY_CONFIG

