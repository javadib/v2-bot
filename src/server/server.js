const path = require('path');
const loopback = require('loopback');
const boot = require('loopback-boot');
const { I18n } = require('i18n')

const currentUser = require('./middleware/current-user');
const refreshToken = require('./middleware/refresh-token');

process.on('uncaughtException', function (err) {
  // handle the error safely
  console.log(err);
});


let app = module.exports = loopback();
app.set('LOG_ACTIVATE_ENABLE', false);

app.use(loopback.static(path.join(__dirname, 'public')));

// const i18n = new I18n({
//   locales: ['en', 'de'],
//   directory: path.join(__dirname, 'locales')
// })



app.use(loopback.token({
  model: app.models.accessToken,
  currentUserLiteral: 'me',
  searchDefaultTokenKeys: false,
  cookies: ['access_token'],
  headers: ['access_token', 'X-Access-Token', 'Authorization'],
  params: ['access_token']
}));

app.use(currentUser());

app.use(refreshToken());



app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');

    let baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);

    let nodeEnv = process.env.NODE_ENV || 'development';
    console.log(`NODE_ENV: ${nodeEnv}`);

    if (app.get('loopback-component-explorer')) {
      let explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }

  });
};


// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.start();
  }
});
