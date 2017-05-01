const packageJson = require('./package.json');

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('doiuse')({
      browsers: packageJson.browserslist,
      ignore: ['css-transitions', 'border-radius'],
      ignoreFiles: ['**/normalize.css'],
    }),
  ]
};
