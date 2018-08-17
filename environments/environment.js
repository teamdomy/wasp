if (process.env.NODE_ENV === 'production') {
  exports.env = require('./environment.prod');
} else {
  exports.env = require('./environment.dev');
}
