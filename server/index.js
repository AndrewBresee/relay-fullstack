// index.js

/* eslint-disable no-console, no-shadow */
import path from 'path';
import webpack from 'webpack';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import WebpackDevServer from 'webpack-dev-server';
import historyApiFallback from 'connect-history-api-fallback';
import chalk from 'chalk';
import webpackConfig from '../webpack.config';
import config from './config/environment';
import schema from './data/schema';
import passport from 'passport';
// will be useful after database is setup
// import User from './data/database'

import mysql from 'mysql';

// connct to the db
const connection = mysql.createConnection({
  host: 'ip-10-2-1-250',
  user: 'abresee',
  password: 'SmartTest1234',
  database: 'RelayFullstack'
});

connection.connect((err) => {
  if (err) {
    console.log(chalk.red('There was an error connecting to the DB'));
    return;
  }
  console.log(chalk.green('Connection to the DB has been made'));
});

// Passport for google oauth
passport.serializeUser((accessToken, done) => {
  // does not have the fields we created earlier, user.uid does not exist.
  console.log(' === serialized === : ', accessToken);
  // this sets req.session.passport.user = accessToken;
  done(null, accessToken);
});

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// The UI needs to communicate with the server, then the server makes the calls

passport.use(new GoogleStrategy({
  clientID: '841923969981-1gnkp30lmbb8hbf02krbqa96es4qhi73.apps.googleusercontent.com',
  clientSecret: '3mEC0WS0isqHCmD7G1KEG0W6',
  callbackURL: 'http://localhost:3000/auth/google/callback'
},

  (accessToken, refreshToken, profile, done) => {
    console.log('accessToken: ', accessToken);
    console.log('refreshToken: ', refreshToken);
    console.log('profile: ', profile);
    console.log('done: ', done);

    return done(null, accessToken);

    // User.findOrCreate({ id: profile.id }, function (err, user) {
    //   if (err) {
    //     console.log('THERE WAS AN ERROR!');
    //     return done(err);
    //   }
    //   if (user) {
    //     console.log('User found! ', user);
    //     return done(user);
    //   } else {
    //     // this is where the user can be saved into the database with google.id, google.token, google.name,
    //   }
    //   return done(err, user);
    // });
  }
));

function setupServerAuth(expressApp) {
  expressApp.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
  expressApp.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      console.log('== Google Response ==');
      // Window.sessionStorage.setItem(req.session.passport.user);
      res.redirect('/');
    });
  return expressApp;
}

if (config.env === 'development') {
  // Launch GraphQL sub-app
  const graphql = express();

  graphql.use('/', graphQLHTTP({
    graphiql: true,
    pretty: true,
    schema
  }));

  graphql.listen(config.graphql.port, () => console.log(chalk.green(`GraphQL is listening on port ${config.graphql.port}`)));

  // Launch Relay by using webpack.config.js
  // This is the main app
  // Research into this
  const relayServer = new WebpackDevServer(webpack(webpackConfig), {
    contentBase: '/build/',
    proxy: {
      '/graphql': `http://localhost:${config.graphql.port}`
    },
    stats: {
      colors: true
    },
    hot: true,
    historyApiFallback: false
  });

  // Serve static resources
  // relayServer.use(googleAuth);

  // Setup auth *with* endpoints
  // relayServer.use('/googleAuth', googleAuth);
  relayServer.use(passport.initialize());
  relayServer.use(passport.session());
  relayServer.use('/', setupServerAuth(express()));

   // Serve static resources
  // relayServer.use('/', express.static(path.join(__dirname, '../build')));

  relayServer.listen(config.port, () => console.log(chalk.green(`Relay is listening on port ${config.port}`)));
} else if (config.env === 'production') {
  console.log('========Production===========');
  // Launch Relay by creating a normal express server
  const relayServer = express();
  relayServer.use(historyApiFallback());
  relayServer.use('/', express.static(path.join(__dirname, '../build')));
  relayServer.use('/graphql', graphQLHTTP({ schema }));
  relayServer.listen(config.port, () => console.log(chalk.green(`Relay is listening on port ${config.port}`)));
}
