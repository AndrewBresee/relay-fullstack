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
import passport from 'passport';
import schema from './data/schema';
// will be useful after database is setup
// import User from './data/database'

import mysql from 'mysql';
// import session from 'express-session';
import cookieSession from 'cookie-session';

import cookieParser from 'cookie-parser';
// import bodyParser from 'body-parser';

const initializedCookieParser = cookieParser();
// const initializedBodyParser = bodyParser.urlencoded({ extended: false });
const initializedCookieSession = cookieSession({ secret: 'Its a secret!', resave: true, saveUninitialized: true });
const initializedPassport = passport.initialize();
const initializedSession = passport.session();

// connct to the db
const connection = mysql.createConnection({
  host: 'gs-db-instance1.crkurxczxv8y.us-west-1.rds.amazonaws.com',
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

const searchAndUpdateDatabase = (profileID, googleUser) => {
  connection.query('SELECT * FROM googleUsers WHERE user = ?', [profileID], (error, results) => {
    // console.log('Query called');
    if (results.length < 1 && googleUser !== null) {
      connection.query('INSERT INTO googleUsers SET ?', googleUser, (err, res) => {
        if (err) {
          console.log('error in db insert : ', err);
        } else {
          console.log('User added to the db with the insertID:', res.insertId);
        }
        return null;
      });
    } else if (error) {
      console.log('Error in query: ', error);
    } else {
      console.log('query results return: ', results);
      return results;
    }
    return null;
  });
};

// Serialization saves the users credentials into the session
passport.serializeUser((accessToken, done) => {
  // does not have the fields we created earlier, user.uid does not exist.
  console.log(' === serialized === current user is: ', accessToken);
  // this sets req.session.passport.user = accessToken;
  done(null, accessToken);
});

passport.deserializeUser((profileID, done) => {
  console.log('Deserialize called with id: ', profileID);
  connection.query('SELECT * FROM googleUsers WHERE user =?', [profileID], (err, results) => {
    console.log('Deserilization Occured, results found as: ', results);
    done(err, results);
  });
});

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// The UI needs to communicate with the server, then the server makes the calls

passport.use(new GoogleStrategy({
  clientID: '841923969981-1gnkp30lmbb8hbf02krbqa96es4qhi73.apps.googleusercontent.com',
  clientSecret: '3mEC0WS0isqHCmD7G1KEG0W6',
  callbackURL: 'http://localhost:3000/auth/google/callback'
},

  (accessToken, refreshToken, profile, done) => {
    const profileID = profile.id;
    const firstName = profile.name.givenName;
    const lastName = profile.name.familyName;
    const googleUser = { user: profileID, givenName: firstName, familyName: lastName };
    // user gets updated each time someone logs in
    console.log('Passport called');
    searchAndUpdateDatabase(profileID, googleUser);
    done(null, profileID);
  }
));

if (config.env === 'development') {
  // Launch GraphQL sub-app
  const graphql = express();

  graphql.use(initializedCookieParser);
  graphql.use(initializedCookieSession);
  graphql.use(initializedPassport);
  graphql.use(initializedSession);

  graphql.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
  graphql.get('/logout', (req, res) => {
    console.log('Loging user out: ', req.user);
    req.logout();
    // req.session = null;
    res.redirect('/');
  });
  graphql.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      // if (req.user) {
      //   console.log('Cookie set: ', req.user);
      //   req.session.user = req.user;
      // }
      res.redirect('/');
    });

// this is responsible for being the route
  console.log('Testing on the server: ', schema);
  graphql.use('/', graphQLHTTP({
    graphiql: true,
    pretty: true,
    schema
    // context: request.session
  }));

  graphql.listen(config.graphql.port, () => console.log(chalk.green(`GraphQL is listening on port ${config.graphql.port}`)));

  // Launch Relay by using webpack.config.js
  // This is the main app
  // Research into this
  const relayServer = new WebpackDevServer(webpack(webpackConfig), {
    contentBase: '/build/',
    proxy: {
      '/graphql': `http://localhost:${config.graphql.port}`,
      '/auth/google': `http://localhost:${config.graphql.port}`,
      '/auth/google/callback': `http://localhost:${config.graphql.port}`,
      '/logout': `http://localhost:${config.graphql.port}`
      // '*': `http://localhost:${config.graphql.port}`
    },
    stats: {
      colors: true
    },
    hot: true,
    historyApiFallback: true
  });

  // Serve static resources
  // relayServer.use(googleAuth);

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

// export {
//   searchAndUpdateDatabase
// };
